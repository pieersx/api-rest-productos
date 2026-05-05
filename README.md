# API REST de Gestión de Pedidos (E-commerce) - Express + Sequelize + MySQL

## Requisitos

- Node.js 18+
- Docker y Docker Compose
- Python 3.x (para importar datos)

## Configuracion

1. Instalar dependencias:

```bash
npm install
```

2. Levantar MySQL en Docker:

```bash
docker compose up -d
```

3. Importar datos del DataSet:

```bash
py importar_datos.py
```

4. Iniciar API:

```bash
npm start
```

La API corre en: `http://localhost:3000`

## Modelo de Datos (ORM - Sequelize)

### Pedido
- id (INT, PK, autoincrement)
- cliente (STRING, NOT NULL)
- total (DECIMAL(10,2), NOT NULL)
- estado (ENUM: pendiente, confirmado, cancelado, DEFAULT: pendiente)

### DetallePedido
- id (INT, PK, autoincrement)
- pedidoId (INT, FK a Pedido, NOT NULL)
- producto (STRING, NOT NULL)
- cantidad (INT, NOT NULL)
- precio_unitario (DECIMAL(10,2), NOT NULL)

Relación: Un Pedido tiene muchos DetallePedido (1:N)

## Endpoints

### Pedidos
| Método | Endpoint | Descripción |
|---|---|---|
| GET | /pedidos | Listar pedidos con sus detalles |
| GET | /pedidos/:id | Obtener pedido por id |
| POST | /pedidos | Crear pedido (calcula total automático) |
| PUT | /pedidos/:id | Actualizar estado del pedido |
| DELETE | /pedidos/:id | Eliminar pedido |

### Productos (datos de referencia)
| Método | Endpoint | Descripción |
|---|---|---|
| GET | /productos | Listar productos |
| GET | /productos/:id | Obtener producto por id |

## Base de datos

- Motor: MySQL 8 (Docker)
- Nombre BD: `catalogo_db`
- Tablas: `pedidos`, `detalles_pedido`, `productos`
- Datos importados: 15 productos, 10 pedidos, 14 detalles
