const express = require("express");
require("dotenv").config();

const sequelize = require("./config/database");
require("./models/Producto");
const productosRoutes = require("./routes/productos");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(productosRoutes);

app.use((req, res) => {
  return res.status(404).json({ mensaje: "Endpoint no encontrado." });
});

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`API ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar la API:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
