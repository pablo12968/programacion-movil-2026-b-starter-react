// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { startTestServer } from './test-server';

let baseUrl: string;
let close: () => Promise<void>;
const input = { name: 'Café de prueba', price: 8500, category: 'Bebidas', stock: 4 };
beforeEach(async () => { ({ baseUrl, close } = await startTestServer()); });
afterEach(async () => { await close(); });
const call = (path: string, method = 'GET', body?: unknown) => fetch(`${baseUrl}${path}`, {
  method, headers: { 'Content-Type': 'application/json' },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

describe('Contrato HTTP de productos', () => {
  it('crea, consulta, actualiza y elimina sin reutilizar el id', async () => {
    const created = await call('/api/products', 'POST', { ...input, id: 1234 });
    expect(created.status).toBe(201);
    const product = await created.json();
    expect(product).toEqual({ id: 9, ...input });
    expect(await (await call('/api/products/9')).json()).toEqual(product);
    const updated = await call('/api/products/9', 'PUT', { ...input, name: '  Café nuevo  ', stock: 0, id: 20 });
    expect(updated.status).toBe(200);
    expect(await updated.json()).toEqual({ ...input, id: 9, name: 'Café nuevo', stock: 0 });
    const deleted = await call('/api/products/9', 'DELETE');
    expect(deleted.status).toBe(204);
    expect(await deleted.text()).toBe('');
    expect((await call('/api/products/9')).status).toBe(404);
    expect((await (await call('/api/products', 'POST', input)).json()).id).toBe(10);
  });

  it.each(['POST', 'PUT'])('acumula cuatro errores en %s y no cambia el inventario', async (method) => {
    const path = method === 'POST' ? '/api/products' : '/api/products/1';
    const before = await (await call('/api/products')).json();
    const response = await call(path, method, { name: ' ', price: 0, category: 'otra', stock: -1.5 });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Datos inválidos', details: [
      'name es obligatorio', 'price debe ser un número finito mayor que 0',
      'category debe ser Bebidas, Snacks, Aseo u Hogar', 'stock debe ser un entero mayor o igual que 0',
    ] });
    expect(await (await call('/api/products')).json()).toEqual(before);
  });

  it.each(['GET', 'PUT', 'DELETE'])('%s distingue ids inválidos y productos inexistentes', async (method) => {
    for (const id of ['abc', '-1', '1.5', '1x']) {
      const response = await call(`/api/products/${id}`, method, method === 'PUT' ? input : undefined);
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: expect.any(String), details: expect.any(Array) });
    }
    expect((await call('/api/products/99999', method, method === 'PUT' ? input : undefined)).status).toBe(404);
  });

  it('combina búsqueda sin mayúsculas y categoría exacta', async () => {
    await call('/api/products', 'POST', input);
    const matches = await (await call('/api/products?search=CAF%C3%89%20DE&category=Bebidas')).json();
    expect(matches).toEqual([{ id: 9, ...input }]);
    expect(await (await call('/api/products?search=caf%C3%A9&category=Hogar')).json()).toEqual([]);
    expect(await (await call('/api/products?category=bebidas')).json()).toEqual([]);
    expect(await (await call('/api/products?search=%20%20')).json()).toHaveLength(9);
  });

  it('rechaza tipos incorrectos y nombre largo; acepta los límites válidos', async () => {
    const invalid = await call('/api/products', 'POST', { ...input, name: 'x'.repeat(61), price: '5', stock: '0' });
    expect(invalid.status).toBe(400);
    expect((await invalid.json()).details).toHaveLength(3);
    expect((await call('/api/products', 'POST', { ...input, name: 'x'.repeat(60), price: 0.01, stock: 0 })).status).toBe(201);
    expect((await call('/api/products', 'POST', {})).status).toBe(400);
  });

  it('ejercita el middleware 404 dado con método y ruta en details', async () => {
    const response = await call('/api/ruta-inexistente');
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Ruta no encontrada', details: ['GET /api/ruta-inexistente'] });
  });

  it('el manejador central devuelve 400 uniforme ante JSON malformado', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'El cuerpo no es un JSON válido', details: [] });
  });
});
