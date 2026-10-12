# Verificación local · 12 de octubre de 2026

Entorno: Windows, Node 24.20.0 (cumple ≥22.12), Ionic React 8.8.19, Express 5.3.0, Vitest 5.0.3 y Playwright 1.63.0.

| Comprobación | Resultado observado |
|---|---|
| npm test | 5 archivos, 36 pruebas aprobadas; cero pendientes |
| npm run lint | Salida 0, sin advertencias |
| npm run build | Salida 0; TypeScript y Vite correctos |
| npm run test:e2e | 6 aprobadas: 3 flujos en escritorio y móvil |
| Kotlin 2.4.21 / JDK 21 | Compila y corre; tres líneas y checks de límites correctos |
| .env | git check-ignore confirma exclusión |
| Historia | 175f5f8 solo docs, anterior al código de e38ff31 |

## Cobertura funcional
Dominio: errores acumulados, 60/61 caracteres, precio no finito/cero/negativo, stock inválido, etiquetas 0/1/4/5, COP, filtros combinados e inmutabilidad.

API: CRUD real, id de cliente ignorado, ids no reutilizados tras borrar, PUT conserva id, DELETE 204 sin cuerpo, rechazo sin mutación, ids no numéricos e inexistentes para GET/PUT/DELETE, filtros, límites, ruta desconocida y JSON malformado. Cada prueba usa startTestServer con semilla nueva y puerto libre.

Cliente: métodos/cuerpos, filtros codificados, 204, ApiError de red versus HTTP y respuesta no JSON.

Navegador: crear con validación, consultar precio/stock, editar a Agotado, cancelar eliminación, confirmar eliminación y recargar lista. Vacío/error/carga/reintento/404 y conservación de valores ante details del servidor. Sin excepciones JavaScript ni desbordamiento horizontal en el flujo real.

## Capturas revisadas
| Estado | Escritorio 1440×1000 | Móvil 390×844 |
|---|---|---|
| Lista | [Ver](desktop/01-lista.png) | [Ver](mobile/01-lista.png) |
| Validación | [Ver](desktop/02-validacion.png) | [Ver](mobile/02-validacion.png) |
| Detalle | [Ver](desktop/03-detalle.png) | [Ver](mobile/03-detalle.png) |
| Error recuperable | [Ver](desktop/04-error.png) | [Ver](mobile/04-error.png) |

Las capturas son de la app real. Ionic utiliza un contenedor con desplazamiento interno: la captura móvil muestra el área visible, y los botones inferiores del formulario se alcanzan desplazando. Playwright comprobó sus acciones.

## Límites declarados
No se verificó APK/dispositivo físico ni iOS; no lo pide el parcial. Kotlin se compiló localmente; el archivo es autónomo y apto para Playground, pero no se afirma una ejecución web no realizada. Vite muestra advertencia de chunk grande (aprox. 1,08 MB sin comprimir / 248 KB gzip) asociada al paquete principal Ionic; no es un error. API en memoria y app sin caché offline conforme al alcance. CI remoto, publicación del PR y entrega en Moodle se verifican por separado; este informe no los da por realizados.
