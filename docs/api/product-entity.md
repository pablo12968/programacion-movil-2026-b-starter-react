# Local Entity — Product
- **Store:** N/A, almacenamiento en memoria Express.
- **Collection:** products, copia de server/data/products.json por createApp.
- **Schema version:** contrato inicial C2.

## Fields
| Campo | Tipo | Null | Reglas |
|---|---|---|---|
| id | number | No | Incremental del servidor, no editable |
| name | string | No | No vacío ni solo espacios, máximo 60 |
| price | number | No | Finito >0; no cadenas |
| category | string | No | Bebidas, Snacks, Aseo u Hogar exactas |
| stock | integer | No | ≥0; no fracciones ni cadenas |

POST/PUT reciben cuatro campos sin id; se recorta nombre al guardar tras validar longitud. ProductView añade priceLabel, stockLabel, isLowStock e isOutOfStock. Kotlin admite stock null para null safety; API no lo admite.

## Indexes
N/A, memoria: find/filter sobre ocho datos semilla.

## Relationships
N/A, entidad independiente y categoría cerrada, sin tabla relacionada.

## Sync
No sincronización ni base local; última escritura válida reemplaza atributos. Reiniciar restaura semilla y contador. Eliminar no reutiliza ids en esa ejecución.

## Migration notes
N/A, almacenamiento en memoria, sin migraciones ni datos duraderos.
