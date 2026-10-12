# Feature — Catálogo de productos
- **Owner:** Pablo Esteban Santana Vidal
- **Status:** Planned
- **Related stories:** CAT-01 consultar, CAT-02 crear, CAT-03 editar, CAT-04 eliminar.

## Purpose
Administrar un inventario desde Ionic: encontrar productos por nombre y categoría, identificar pocas existencias y realizar CRUD contra Express.

## Screens
| Screen | Route | Purpose |
|---|---|---|
| Lista | `/productos` | Buscar, filtrar y abrir productos |
| Detalle | `/productos/:id` | Consultar todos los campos y eliminar con confirmación |
| Crear | `/productos/nuevo` | Registrar un producto |
| Editar | `/productos/:id/editar` | Modificar un producto existente |

Specs: [lista](../screens/lista.md), [detalle](../screens/detalle.md), [formulario](../screens/formulario.md).

## State
- **Pattern:** flujo unidireccional con useState/useEffect locales permitido por el parcial; sin store global.
- **State objects:** productos, búsqueda, categoría, carga/error; producto y confirmación; valores, errores por campo y envío.
- **Key transitions:** carga → contenido/vacío/error; filtros → resultados/sin resultados; envío → errores/guardado; confirmar eliminación → eliminando → lista/error.
- Estado inmutable; recarga al volver de otra ruta; ignorar respuestas obsoletas al salir.

## Data
Casos de uso: listar, consultar, crear, actualizar y eliminar. Cliente en data/products-api.ts; [contrato](../api/products-endpoints.md). Dominio puro: Product, validateProduct, toProductView, filterProducts y formatCOP. Persistencia N/A: copia en memoria de ocho productos semilla que se restaura al reiniciar.

## Edge cases & states
Carga visible; envío bloqueado durante petición; vacío ofrece crear y sin resultados permite limpiar filtros. Red/HTTP muestran error recuperable. Nombre vacío o >60, precio no finito/≤0, categoría inválida y stock fraccionario/negativo generan errores acumulados. Stock 0: Agotado; 1–4: Pocas unidades; ≥5: Disponible. Permisos y offline N/A; app solo en línea.

## Decisions
[ADR-001](../decisions/ADR-001-estado.md), [ADR-002](../decisions/ADR-002-consumo-api.md).

## Tests
Unitarias: límites de validación, precio COP, etiquetas 0/1/4/5, filtros combinados e inmutabilidad. API con startTestServer(): CRUD, ids, filtros, validación, ruta desconocida y JSON malformado. UI: tarjeta accesible y flujo crear → consultar → editar → cancelar borrado → eliminar en móvil/escritorio.
