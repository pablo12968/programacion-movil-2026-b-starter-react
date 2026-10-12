# Screen — Detalle
- **Route:** `/productos/:id`
- **Feature:** Productos
- **Design reference:** retorno, ficha y acciones con confirmación integrada.

## Purpose
Consultar id, nombre, precio, categoría y stock; editar o eliminar conscientemente.

## UI regions
| Region | Component | Notes |
|---|---|---|
| Header | IonToolbar | Volver al catálogo |
| Body | Ficha | Todos los campos y toProductView |
| CTA | IonButton | Editar y Eliminar |
| Confirmation | Bloque accesible | Nombre, Cancelar, Confirmar eliminación |

## States
| State | Trigger | UI |
|---|---|---|
| Loading | Entrada / reintento | Indicador |
| Loaded | GET 200 | Información y acciones |
| Not found | GET 404 | No encontramos ese producto + Volver |
| Error / Offline | Red / HTTP | Mensaje + reintento |
| Deleting | Confirmar | Botones bloqueados hasta respuesta |

## Actions
Editar abre `/productos/:id/editar`. Eliminar muestra confirmación; Cancelar no manda DELETE. Confirmar manda una petición y 204 vuelve al catálogo. Un fallo conserva la ficha y muestra recuperación.

## Accessibility
Nombres visibles, advertencia explícita, errores con role alert, foco visible y botones ≥48px. Etiqueta de stock no depende del color.
