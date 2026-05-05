# Caso Practico 2 - API REST para Gestión de Pedidos (E-commerce)

## 1) Modelo de Datos (ORM - Sequelize)

### Entidad: Pedido
| Campo | Tipo | Restricciones |
|---|---|---|
| id | INTEGER | PK, autoincrement |
| cliente | STRING | NOT NULL |
| total | DECIMAL(10,2) | NOT NULL (calculado automáticamente) |
| estado | ENUM | NOT NULL, valores: pendiente, confirmado, cancelado |

### Entidad: DetallePedido
| Campo | Tipo | Restricciones |
|---|---|---|
| id | INTEGER | PK, autoincrement |
| pedidoId | INTEGER | FK a Pedido, NOT NULL |
| producto | STRING | NOT NULL |
| cantidad | INTEGER | NOT NULL, min: 1 |
| precio_unitario | DECIMAL(10,2) | NOT NULL, min: 0.01 |

**Relación:** Un Pedido tiene muchos DetallePedido (1:N)

## 2) Endpoints implementados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /pedidos | Listar pedidos con sus detalles |
| GET | /pedidos/:id | Obtener pedido por id |
| POST | /pedidos | Crear pedido |
| PUT | /pedidos/:id | Actualizar estado |
| DELETE | /pedidos/:id | Eliminar pedido |

## 3) Lógica de Negocio implementada

- El total del pedido se calcula automáticamente (suma de cantidad * precio_unitario)
- No se permiten pedidos sin detalles
- No se permiten cantidades <= 0
- Estados válidos: pendiente, confirmado, cancelado
- No se puede eliminar un pedido confirmado
- Manejo de errores HTTP: 400 (Bad Request), 404 (Not Found)
- Respuestas en formato JSON
- Validación de datos obligatorios

## 4) Casos de prueba ejecutados

| Caso | Prueba | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| Caso 1 | Crear pedido válido | 201 Created, total calculado correctamente | 201 Created, total: 3600.50 |
| Caso 2 | Pedido sin detalles | 400 Bad Request | 400 Bad Request |
| Caso 3 | Cantidad inválida (<= 0) | 400 Bad Request | 400 Bad Request |
| Caso 4 | Cambiar estado a confirmado | 200 OK, estado actualizado | 200 OK, estado: confirmado |
| Caso 5 | Eliminar pedido confirmado | 400 Bad Request | 400 Bad Request |

## 5) Evidencia - Capturas Postman

Tomar y adjuntar capturas de:

1. POST /pedidos válido (status 201, total calculado)
2. POST /pedidos sin detalles (status 400)
3. POST /pedidos cantidad inválida (status 400)
4. PUT /pedidos/1 cambiar estado (status 200)
5. DELETE /pedidos/1 (pedido confirmado, status 400)
6. GET /pedidos lista completa

## 6) Datos importados del DataSet

- **Productos:** 15 registros (DataSet Productos)
- **Pedidos:** 10 registros (DataSet Pedidos)
- **Detalles:** 14 registros (DataSet Detalle_Pedido)

## 7) Archivos de entrega

- Código backend (carpeta del proyecto)
- Script de importación: `importar_datos.py`
- Colección Postman: `Postman_Collection_Caso1.json`
- Archivo de pruebas: `api.http`
- Documento: `DOCUMENTO_ENTREGA.md`
- README: `README.md`
