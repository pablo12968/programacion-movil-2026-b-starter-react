# Guía para demostrar y explicar el parcial

## Recorrido de 5 minutos
1. Arrancar API y app siguiendo README. Mostrar ocho productos y estados Disponible, Pocas unidades y Agotado.
2. Pulsar Bebidas, buscar por parte del nombre y probar texto sin coincidencias. Limpiar filtros.
3. Crear un producto: intentar guardar vacío, explicar cada validación y completar nombre, precio, categoría y stock 4.
4. Consultar el detalle, mostrar precio COP e id del servidor. Editar stock a 0 y comprobar Agotado.
5. Pulsar Eliminar, cancelar, volver a eliminar y confirmar. La lista se actualiza desde la API.
6. Mostrar npm test, lint/build, archivo Kotlin y el primer commit de documentación.

## Preguntas para prepararse
- **¿Dónde está el estado?** En cada página con hooks. La ubicación reactiva recarga datos al volver y la limpieza de efectos evita respuestas obsoletas.
- **¿Por qué dominio separado?** Las reglas no necesitan React ni red y pueden probarse aisladamente.
- **¿Dónde se valida?** Formulario usa validateProduct; Express valida otra vez porque alguien puede llamar directamente a la API.
- **¿400 o 404?** Id mal formado es 400; id numérico sin producto es 404. Una ruta desconocida usa el middleware final 404.
- **¿Red o servidor?** ApiError status null significa que no llegó respuesta HTTP; status numérico permite distinguir 400/404/500 y mostrar details.
- **¿Por qué cuatro argumentos?** Express reconoce el middleware de error por (err, req, res, next), incluso si no se usa next.
- **¿Por qué DELETE no lee JSON?** El contrato devuelve 204 sin cuerpo; request retorna undefined.
- **¿Por qué no se reutiliza id?** Un contador independiente aumenta al crear; no se calcula a partir de la longitud actual.
- **¿Qué pasa al reiniciar?** Se restaura la semilla: almacenamiento en memoria requerido, sin base de datos.
- **¿Qué demuestra Kotlin?** val/var, clase, Int? y null safety, when, función con Double y porcentaje usando 100.0.

## Comandos de evidencia
```bash
git log --reverse --oneline main..feature/catalogo-productos
git show --stat 175f5f8
git check-ignore .env
npm test
npm run lint
npm run build
```

Revisar y comprender el código antes de la sustentación. No afirmar persistencia, autenticación o pruebas de dispositivos que no se implementaron.
