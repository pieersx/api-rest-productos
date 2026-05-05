const Pedido = require("../models/Pedido");
const DetallePedido = require("../models/DetallePedido");

const ESTADOS_VALIDOS = ["pendiente", "confirmado", "cancelado"];

function validarId(id) {
  const numero = Number(id);
  return Number.isInteger(numero) && numero > 0;
}

function validarDetalles(detalles) {
  const errores = [];
  if (!Array.isArray(detalles) || detalles.length === 0) {
    errores.push("El pedido debe tener al menos un detalle.");
    return errores;
  }
  detalles.forEach((det, idx) => {
    if (!det.producto || String(det.producto).trim() === "") {
      errores.push(`Detalle ${idx + 1}: producto es obligatorio.`);
    }
    const cantidad = Number(det.cantidad);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      errores.push(`Detalle ${idx + 1}: cantidad debe ser un entero mayor a 0.`);
    }
    const precio = Number(det.precio_unitario);
    if (Number.isNaN(precio) || precio <= 0) {
      errores.push(`Detalle ${idx + 1}: precio_unitario debe ser mayor a 0.`);
    }
  });
  return errores;
}

function calcularTotal(detalles) {
  return detalles.reduce((sum, d) => {
    return sum + (Number(d.cantidad) * Number(d.precio_unitario));
  }, 0);
}

exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{ model: DetallePedido }],
    });
    return res.json(pedidos);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al listar pedidos." });
  }
};

exports.obtenerPedido = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validarId(id)) {
      return res.status(400).json({ mensaje: "ID inválido." });
    }
    const pedido = await Pedido.findByPk(id, {
      include: [{ model: DetallePedido }],
    });
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado." });
    }
    return res.json(pedido);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener pedido." });
  }
};

exports.crearPedido = async (req, res) => {
  try {
    const { cliente, detalles } = req.body;
    const errores = [];
    if (!cliente || String(cliente).trim() === "") {
      errores.push("El campo 'cliente' es obligatorio.");
    }
    errores.push(...validarDetalles(detalles));
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: "Datos inválidos.", errores });
    }
    const total = calcularTotal(detalles);
    const pedido = await Pedido.create({
      cliente: String(cliente).trim(),
      total,
      estado: "pendiente",
    });
    const detallesCreados = await Promise.all(
      detalles.map((d) =>
        DetallePedido.create({
          pedidoId: pedido.id,
          producto: String(d.producto).trim(),
          cantidad: Number(d.cantidad),
          precio_unitario: Number(d.precio_unitario),
        })
      )
    );
    const pedidoCompleto = await Pedido.findByPk(pedido.id, {
      include: [{ model: DetallePedido }],
    });
    return res.status(201).json(pedidoCompleto);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear pedido." });
  }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validarId(id)) {
      return res.status(400).json({ mensaje: "ID inválido." });
    }
    const { estado } = req.body;
    if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        mensaje: "Estado inválido. Debe ser: pendiente, confirmado o cancelado.",
      });
    }
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado." });
    }
    pedido.estado = estado;
    await pedido.save();
    const pedidoCompleto = await Pedido.findByPk(id, {
      include: [{ model: DetallePedido }],
    });
    return res.json(pedidoCompleto);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al actualizar pedido." });
  }
};

exports.eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validarId(id)) {
      return res.status(400).json({ mensaje: "ID inválido." });
    }
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado." });
    }
    if (pedido.estado === "confirmado") {
      return res.status(400).json({
        mensaje: "No se puede eliminar un pedido confirmado.",
      });
    }
    await pedido.destroy();
    return res.json({ mensaje: "Pedido eliminado correctamente." });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar pedido." });
  }
};
