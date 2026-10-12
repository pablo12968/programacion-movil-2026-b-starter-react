## Catálogo de productos · Parcial C2

El starter respondía 501 y mostraba pantallas pendientes. Esta entrega implementa el CRUD completo de productos en Express e Ionic React, con filtros combinados, validación acumulada, cuatro rutas, precio COP y disponibilidad por stock. Incluye ejercicio Kotlin con stock nullable y descuento, y documentación del Mobile Governance Framework escrita antes del código (175f5f8).

## Validación
- 36 pruebas Vitest aprobadas: dominio, contrato API y cliente HTTP; sin pendientes.
- 6 pruebas Playwright aprobadas en móvil y escritorio: CRUD real y estados recuperables.
- npm run lint y npm run build correctos; Kotlin compilado y ejecutado localmente.
- [Evidencias y límites](docs/evidencias/VERIFICACION.md), [guía de demostración](docs/GUIA-DEMOSTRACION.md).
- Vite advierte del tamaño del bundle principal de Ionic; no hay error de compilación.

## Checklist de entrega
- [x] Nueve documentos completados y commit de documentación previo al código.
- [x] Cinco endpoints, filtros, ids incrementales, validación y errores del contrato.
- [x] Manejadores dados conservados y prueba de ruta desconocida 404.
- [x] CRUD Ionic real con cuatro rutas, ProductCard y capas requeridas.
- [x] Lista con carga, vacío, sin resultados y error con Reintentar.
- [x] Detalle completo y eliminación con confirmación.
- [x] Formulario crear/editar, validación en línea y details del servidor.
- [x] Kotlin compila/ejecuta tres productos, null safety y descuento 10 %.
- [x] npm test pasa con al menos dos unitarias y dos de API nuevas.
- [x] npm run lint y npm run build pasan.
- [x] Flujo CRUD y recuperación comprobados en navegador móvil y escritorio.
- [x] .env ignorado, .env.example presente; sin secretos ni node_modules en Git.
- [x] README de ejecución y dos secciones en inglés de 3–5 frases.
- [x] Rama feature/catalogo-productos, seis o más commits convencionales.
- [x] PR descrito con checklist hacia main del propio fork.
- [ ] Enlace del PR entregado en Moodle antes del cierre del PDF.

## Alcance
API en memoria, sin base de datos ni modo offline. No aplica publicación en tiendas ni proyecto Android. El PR se dirige a main del propio fork y se deja abierto para revisión. La entrega en Moodle es un paso posterior del estudiante.
