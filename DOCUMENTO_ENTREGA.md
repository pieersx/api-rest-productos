# Caso Practico 1 - Desarrollo y testing de una API Rest

## 1) Endpoints implementados

| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | /productos | Listar productos |
| GET | /productos/{id} | Obtener producto por id |
| POST | /productos | Crear producto |
| PUT | /productos/{id} | Actualizar producto |
| DELETE | /productos/{id} | Eliminar producto |

## 2) Reglas de negocio aplicadas

- No se permite precio <= 0
- No se permite stock negativo
- Campos obligatorios: nombre, precio, stock
- Manejo de errores: 400 y 404
- Respuestas en formato JSON

## 3) Casos de prueba ejecutados

| Caso | Prueba | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| Caso 1 | Crear producto valido | 201 Created | 201 Created |
| Caso 2 | Crear producto invalido (precio negativo) | 400 Bad Request | 400 Bad Request |
| Caso 3 | Obtener producto inexistente | 404 Not Found | 404 Not Found |
| Caso 4 | Actualizar producto | 200 OK | 200 OK |
| Caso 5 | Eliminar producto y validar lista | 200 OK y que no aparezca en lista | 200 OK y lista vacia |

## 4) Evidencia para capturas Postman

Tomar y adjuntar capturas de:

1. POST /productos valido (status 201)
2. POST /productos invalido (status 400)
3. GET /productos/9999 (status 404)
4. PUT /productos/1 (status 200)
5. DELETE /productos/1 y luego GET /productos (sin el producto)

## 5) Archivos de entrega

- Codigo backend (carpeta del proyecto)
- Coleccion Postman: `Postman_Collection_Caso1.json`
- Documento: `DOCUMENTO_ENTREGA.md`
