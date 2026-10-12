# ADR-001 — Estado local
- **ID:** ADR-001
- **Date:** 2026-10-12
- **Status:** Accepted
- **Authors:** Pablo Esteban Santana Vidal

## Context
Cuatro rutas de una funcionalidad sin consumidores globales. El parcial permite useState/useEffect en páginas. Ionic puede conservar páginas en navegación: hay que recargar al regresar y evitar respuestas obsoletas.

## Decision
**We decided:** estado local inmutable con hooks y API como fuente de verdad; dominio concentra validaciones y transformaciones.
**Justification:** filtros y formulario son locales. No se precisa una caché compartida para ocho productos.

## Evaluated alternatives
| Alternative | Pros | Cons | Reason for discarding |
|---|---|---|---|
| Hooks | Simples, vistos en clase | Repetir lecturas | Elegida |
| Context | Compartir datos | Invalidación global | Sin necesidad actual |
| Redux | Flujos complejos | Dependencia y boilerplate | Excesivo para el alcance |

## Consequences
**Positive:** páginas comprensibles, dominio testeable, datos frescos tras CRUD.
**Negative:** más lecturas y sin soporte offline. Si crece, introducir repositorio/caché con nuevo ADR.
**Impact:** lista, detalle y formulario; [feature](../features/productos.md).

## References
Mobile Governance Framework, 01-architecture/layers-and-state, adaptado a la excepción de hooks locales del parcial. [ADR-002](ADR-002-consumo-api.md).
