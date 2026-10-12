# Endpoint Integration — Productos
- **Feature:** Productos
- **Base URL:** http://localhost:3000 (VITE_API_URL configurable).
- **Auth required:** No; demostración local.

## Request
| Método y ruta | Parámetros | Cuerpo | Éxito |
|---|---|---|---|
| GET /api/products | search y category opcionales | Ninguno | 200 Product[] |
| GET /api/products/:id | id requerido | Ninguno | 200 Product |
| POST /api/products | Ninguno | ProductInput | 201 Product |
| PUT /api/products/:id | id requerido | ProductInput completo | 200 Product |
| DELETE /api/products/:id | id requerido | Ninguno | 204 sin cuerpo |

search busca nombre que contiene texto sin distinguir mayúsculas; espacios solos no filtran. category es exacta, vacía indica todas; desconocida da []. Ambos filtros se combinan con AND. Id solo dígitos; se busca antes de validar PUT.

Content-Type POST/PUT: application/json.
```json
{ "name": "Café", "price": 8500, "category": "Bebidas", "stock": 4 }
```

## Response
```json
{ "id": 9, "name": "Café", "price": 8500, "category": "Bebidas", "stock": 4 }
```
Lista devuelve arreglo; detalle, crear y actualizar objeto; DELETE ningún JSON. Id incremental asignado por servidor. DTO → dominio mantiene campos; toProductView recorta nombre, formatCOP da `$ 8.500` y stock deriva Agotado (0), Pocas unidades (1–4), Disponible (≥5).

## Errors
Formato: `{ "error": "mensaje", "details": ["..."] }`.
| Status | Meaning | App behavior |
|---|---|---|
| 400 | Id no numérico GET/PUT/DELETE | Mensaje y retorno |
| 400 | POST/PUT inválido | Mantener valores, error y todos los details |
| 400 | JSON malformado | Mensaje del manejador dado |
| 404 | Producto inexistente | No encontrado y volver |
| 404 | Ruta desconocida | Método/ruta en details del middleware |
| 500 | Excepción inesperada | Mensaje genérico, recuperación |
| Sin HTTP | Red / API apagada | ApiError status null; reintentar |

Validación acumulada: name texto no vacío ≤60, price number finito >0, category permitida exacta, stock entero ≥0. Un mensaje por cada campo inválido; sin guardar parcialmente. Se ignoran campos extra/id del cuerpo.

## Caching / offline
Online-only; sin caché persistente ni reintentos automáticos de escritura. Al volver se lee de nuevo. [Entidad](product-entity.md) en memoria.
