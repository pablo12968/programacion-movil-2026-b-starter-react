import { describe, expect, it } from 'vitest';
import { filterProducts, toProductView, validateProduct } from '../domain/product';
import type { ProductInput } from '../domain/product';

const valid: ProductInput = { name: 'Café', price: 1250000, category: 'Bebidas', stock: 5 };

describe('validateProduct', () => {
  it('acumula todos los errores sin modificar el input', () => {
    const input = Object.freeze({ name: ' ', price: 0, category: 'otra', stock: -1 });
    expect(validateProduct(input)).toEqual({ isValid: false, errors: {
      name: expect.any(String), price: expect.any(String), category: expect.any(String), stock: expect.any(String),
    } });
  });
  it('acepta nombre de 60 caracteres, precio positivo y stock cero', () => {
    expect(validateProduct({ ...valid, name: 'a'.repeat(60), price: 0.01, stock: 0 })).toEqual({ isValid: true, errors: {} });
    expect(validateProduct({ ...valid, name: 'a'.repeat(61) }).errors.name).toBeDefined();
  });
  it.each([NaN, Infinity, -Infinity, 0, -1])('rechaza precio %s', (price) => {
    expect(validateProduct({ ...valid, price }).errors.price).toBeDefined();
  });
  it.each([NaN, Infinity, -1, 1.5])('rechaza stock %s', (stock) => {
    expect(validateProduct({ ...valid, stock }).errors.stock).toBeDefined();
  });
});

describe('toProductView', () => {
  it.each([
    [0, 'Agotado', true, false], [1, 'Pocas unidades', false, true],
    [4, 'Pocas unidades', false, true], [5, 'Disponible', false, false],
  ])('transforma stock %s sin mutar el producto', (stock, stockLabel, isOutOfStock, isLowStock) => {
    const product = Object.freeze({ ...valid, id: 1, name: ' Café ', stock: stock as number });
    expect(toProductView(product)).toEqual({
      id: 1, name: 'Café', category: 'Bebidas', stock, priceLabel: '$ 1.250.000', stockLabel, isOutOfStock, isLowStock,
    });
    expect(product.name).toBe(' Café ');
  });
});

describe('filterProducts', () => {
  const products = [{ ...valid, id: 1 }, { ...valid, id: 2, name: 'Cafetera', category: 'Hogar' }];
  it('combina texto sin mayúsculas y categoría exacta', () => {
    expect(filterProducts(products, { search: ' cAF ', category: 'Hogar' })).toEqual([products[1]]);
    expect(filterProducts(products, { search: 'xyz', category: '' })).toEqual([]);
    expect(filterProducts(products, { search: '', category: 'hogar' })).toEqual([]);
  });
  it('sin filtros devuelve un arreglo nuevo y no modifica el original', () => {
    const result = filterProducts(products, { search: '  ', category: '' });
    expect(result).toEqual(products);
    expect(result).not.toBe(products);
    expect(products).toHaveLength(2);
  });
});
