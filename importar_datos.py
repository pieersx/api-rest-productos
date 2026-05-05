import pandas as pd
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

xl = pd.ExcelFile("DataSet.xlsx")

conn = mysql.connector.connect(
    host=os.getenv("DB_HOST", "127.0.0.1"),
    port=int(os.getenv("DB_PORT", 3306)),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", "root123"),
    database=os.getenv("DB_NAME", "catalogo_db")
)
cursor = conn.cursor()

# 1. Importar Productos
df_prod = pd.read_excel(xl, sheet_name="DataSet Productos", header=None)
df_prod = df_prod[0].str.split(",", expand=True)
df_prod.columns = ["id", "nombre", "precio", "stock"]
df_prod = df_prod.iloc[1:].reset_index(drop=True)
df_prod["id"] = df_prod["id"].astype(int)
df_prod["precio"] = df_prod["precio"].astype(float)
df_prod["stock"] = df_prod["stock"].astype(int)

cursor.execute("DROP TABLE IF EXISTS productos")
cursor.execute("""
    CREATE TABLE productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL
    )
""")
for _, row in df_prod.iterrows():
    cursor.execute(
        "INSERT INTO productos (id, nombre, precio, stock) VALUES (%s, %s, %s, %s)",
        (int(row["id"]), str(row["nombre"]), float(row["precio"]), int(row["stock"]))
    )
print(f"Productos importados: {len(df_prod)}")

# 2. Importar Pedidos
df_ped = pd.read_excel(xl, sheet_name="DataSet Pedidos", header=None)
df_ped = df_ped[0].str.split(",", expand=True)
df_ped.columns = ["id", "cliente", "total", "estado"]
df_ped = df_ped.iloc[1:].reset_index(drop=True)
df_ped["id"] = df_ped["id"].astype(int)
df_ped["total"] = df_ped["total"].astype(float)
df_ped["estado"] = df_ped["estado"].astype(str)

cursor.execute("SET FOREIGN_KEY_CHECKS=0")
cursor.execute("DROP TABLE IF EXISTS detalles_pedido")
cursor.execute("DROP TABLE IF EXISTS pedidos")
cursor.execute("SET FOREIGN_KEY_CHECKS=1")
cursor.execute("""
    CREATE TABLE pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente VARCHAR(255) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        estado ENUM('pendiente','confirmado','cancelado') NOT NULL DEFAULT 'pendiente'
    )
""")
for _, row in df_ped.iterrows():
    cursor.execute(
        "INSERT INTO pedidos (id, cliente, total, estado) VALUES (%s, %s, %s, %s)",
        (int(row["id"]), str(row["cliente"]), float(row["total"]), str(row["estado"]))
    )
print(f"Pedidos importados: {len(df_ped)}")

# 3. Importar Detalle_Pedido
df_det = pd.read_excel(xl, sheet_name="DataSet Detalle_Pedido", header=None)
df_det = df_det[0].str.split(",", expand=True)
df_det.columns = ["id", "pedidoId", "producto", "cantidad", "precio_unitario"]
df_det = df_det.iloc[1:].reset_index(drop=True)
df_det["id"] = df_det["id"].astype(int)
df_det["pedidoId"] = df_det["pedidoId"].astype(int)
df_det["cantidad"] = df_det["cantidad"].astype(int)
df_det["precio_unitario"] = df_det["precio_unitario"].astype(float)

cursor.execute("""
    CREATE TABLE detalles_pedido (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pedidoId INT NOT NULL,
        producto VARCHAR(255) NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL
    )
""")
for _, row in df_det.iterrows():
    cursor.execute(
        "INSERT INTO detalles_pedido (id, pedidoId, producto, cantidad, precio_unitario) VALUES (%s, %s, %s, %s, %s)",
        (int(row["id"]), int(row["pedidoId"]), str(row["producto"]), int(row["cantidad"]), float(row["precio_unitario"]))
    )
print(f"Detalles importados: {len(df_det)}")

conn.commit()
cursor.close()
conn.close()
print("Importacion completada.")
