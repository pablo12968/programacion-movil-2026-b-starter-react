# ADR-002 — HTTP y errores
- **ID:** ADR-002
- **Date:** 2026-10-12
- **Status:** Accepted
- **Authors:** Pablo Esteban Santana Vidal

## Context
App en 5173 y Express en 3000. Red sin respuesta es diferente de HTTP 400 con errores corregibles. El starter entrega API_URL, request, ApiError y getProducts.

## Decision
**We decided:** conservar el cliente fetch dado en data/products-api.ts y replicarlo para CRUD. ApiError distingue status null (red) de códigos HTTP y details.
**Justification:** páginas usan funciones tipadas y getErrorMessage; dominio no importa HTTP. 204 no se lee como JSON. API_URL usa .env.example y .env ignorado.

## Evaluated alternatives
| Alternative | Pros | Cons | Reason for discarding |
|---|---|---|---|
| fetch central del starter | Uniforme, sin dependencia | Sin caché | Elegida |
| Axios | Interceptores | Dependencia adicional | Ya existe cliente |
| fetch en vistas | Rápido al inicio | Duplicación y acoplamiento | Rompe capas |

## Consequences
**Positive:** red recuperable, details visibles, contrato uniforme.
**Negative:** solo en línea, sin reintentos automáticos ni persistencia. Se conserva request tal como pide el enunciado; recuperación manual. Presentación consume data según la adaptación explícita del starter.
**Impact:** cinco funciones HTTP y tres páginas; [contrato](../api/products-endpoints.md).

## Comprensión de piezas dadas
express.json() convierte JSON a req.body; JSON malformado produce 400 en el manejador central. cors() autoriza ambos orígenes locales. parseId() acepta solo dígitos; null implica 400. El middleware final de ruta desconocida devuelve 404 con método/ruta en details. El de CUATRO argumentos recibe excepciones o next(error), registra el fallo y devuelve 500 genérico sin traza. Se conservan ambos y se probará una ruta desconocida, distinto del 404 de producto inexistente.

## References
Mobile Governance Framework, 03-api-and-data/api-networking; [ADR-001](ADR-001-estado.md). La implementación HTTP base se usa tal como viene por requisito del parcial.
