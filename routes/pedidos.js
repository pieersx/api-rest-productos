const express = require("express");
const {
  listarPedidos,
  obtenerPedido,
  crearPedido,
  actualizarEstado,
  eliminarPedido,
} = require("../controllers/pedidosController");

const router = express.Router();

router.get("/pedidos", listarPedidos);
router.get("/pedidos/:id", obtenerPedido);
router.post("/pedidos", crearPedido);
router.put("/pedidos/:id", actualizarEstado);
router.delete("/pedidos/:id", eliminarPedido);

module.exports = router;
