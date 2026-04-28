const express = require("express");
const {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/productosController");

const router = express.Router();

router.get("/productos", listarProductos);
router.get("/productos/:id", obtenerProducto);
router.post("/productos", crearProducto);
router.put("/productos/:id", actualizarProducto);
router.delete("/productos/:id", eliminarProducto);

module.exports = router;
