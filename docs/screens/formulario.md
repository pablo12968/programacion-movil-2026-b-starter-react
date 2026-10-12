# Screen — Crear y editar
- **Routes:** `/productos/nuevo`, `/productos/:id/editar`
- **Feature:** Productos
- **Design reference:** una columna con cuatro campos; mismo componente para ambas rutas.

## Purpose
Capturar los atributos editables con reglas iguales a la API.

## UI regions
| Region | Component | Notes |
|---|---|---|
| Header | IonToolbar | Nuevo / Editar producto |
| Body | IonInput / IonSelect | Nombre, precio COP, categoría, stock |
| Validation | Mensajes asociados | validateProduct por campo |
| Server errors | Alerta + lista | error y cada details |
| CTA | IonButton | Guardar y Cancelar |

## States
| State | Trigger | UI |
|---|---|---|
| Loading | Editar: GET | Indicador previo al formulario |
| Ready | Crear / carga completa | Campos habilitados |
| Invalid | Cambio / envío | Errores en línea; sin petición inválida |
| Saving | POST / PUT | Guardando, evita doble envío |
| Error / Offline | Rechazo remoto | Mantener campos y mostrar details |
| Not found | Id inexistente | Mensaje y retorno |

## Actions
Guardar crea con POST o actualiza con PUT sin cambiar id; éxito va al detalle. Cancelar vuelve sin guardar. Vacíos numéricos son inválidos, no cero. Nombre ≤60 no vacío, precio finito >0, categoría exacta y stock entero ≥0.

## Accessibility
Labels, aria-invalid, mensajes asociados, teclado numérico, botones ≥48px y errores anunciados. Mantener valores permite corregir sin volver a escribir todo.
