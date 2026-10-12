// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../data/api-error';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../data/products-api';

const input = { name: 'Café', price: 8500, category: 'Bebidas', stock: 5 };
afterEach(() => vi.unstubAllGlobals());
describe('Cliente HTTP', () => {
  it('usa los verbos, las rutas y JSON del contrato', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 9, ...input })));
    vi.stubGlobal('fetch', fetchMock);
    await createProduct(input);
    expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining('/api/products'), expect.objectContaining({ method: 'POST', body: JSON.stringify(input) }));
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: 9, ...input })));
    await updateProduct(9, input);
    expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining('/api/products/9'), expect.objectContaining({ method: 'PUT' }));
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(deleteProduct(9)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenLastCalledWith(expect.stringContaining('/api/products/9'), { method: 'DELETE' });
  });
  it('codifica filtros en la URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('[]'));
    vi.stubGlobal('fetch', fetchMock);
    await getProducts({ search: 'café & té', category: 'Bebidas' });
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get('search')).toBe('café & té');
    expect(url.searchParams.get('category')).toBe('Bebidas');
  });
  it('distingue error de red de HTTP con details', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(getProduct(1)).rejects.toMatchObject({ status: null, isNetworkError: true });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'Datos inválidos', details: ['stock inválido'] }), { status: 400 })));
    await expect(createProduct(input)).rejects.toMatchObject({ status: 400, isNetworkError: false, details: ['stock inválido'] });
  });
  it('un error HTTP sin JSON sigue siendo ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('fallo', { status: 500 })));
    await expect(getProduct(1)).rejects.toBeInstanceOf(ApiError);
  });
});
