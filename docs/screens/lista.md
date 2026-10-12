# Screen — Lista
- **Route:** `/productos`
- **Feature:** Productos
- **Design reference:** cabecera, buscador, cinco filtros y cuadrícula adaptable; una columna móvil.

## Purpose
Explorar el inventario, identificar stock y acceder a crear o consultar.

## UI regions
| Region | Component | Notes |
|---|---|---|
| Header | IonToolbar | Catálogo y Nuevo producto |
| Filters | IonInput + IonButton | Todas, Bebidas, Snacks, Aseo, Hogar |
| Results | ProductCard | Nombre, categoría, precio COP, stock y enlace a detalle |
| Status | EmptyState / indicador | Conteo o estado de petición |

## States
| State | Trigger | UI |
|---|---|---|
| Loading | Entrada / reintento | Cargando productos |
| Loaded | API con datos | filterProducts y tarjetas |
| Empty | API devuelve [] | Inventario vacío + Crear producto |
| No results | Filtros sin coincidencia | Sin resultados + Limpiar filtros |
| Error / Offline | Falla petición | Mensaje + Reintentar |

## Actions
Escribir y seleccionar categoría combina filtros locales. Abrir tarjeta navega por id. Nuevo producto abre formulario. Regresar recarga getProducts para evitar datos obsoletos.

## Accessibility
Labels visibles, aria-pressed en filtros, stock con texto además de color, foco visible, controles ≥48px y texto adaptable. Verificar teclado y ancho móvil.
