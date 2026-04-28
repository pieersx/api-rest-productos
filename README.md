# API REST de Productos (Express + Sequelize + MySQL)

## Requisitos

- Node.js 18+
- Docker y Docker Compose

## Configuracion

1. Instalar dependencias:

```bash
npm install
```

2. Levantar MySQL en Docker:

```bash
docker compose up -d
```

3. Iniciar API:

```bash
npm start
```

La API corre en: `http://localhost:3000`

## Endpoints

- `GET /productos`
- `GET /productos/:id`
- `POST /productos`
- `PUT /productos/:id`
- `DELETE /productos/:id`

## Base de datos

- Motor: MySQL 8 (Docker)
- Nombre BD: `catalogo_db`
- Tabla: `productos`
