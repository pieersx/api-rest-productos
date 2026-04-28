const Producto = require("../models/Producto");

function validarId(id) {
  const numero = Number(id);
  return Number.isInteger(numero) && numero > 0;
}

function validarProducto(body) {
  const errores = [];

  if (body.nombre === undefined || body.nombre === null || String(body.nombre).trim() === "") {
    errores.push("El campo 'nombre' es obligatorio.");
  }

  if (body.precio === undefined || body.precio === null || body.precio === "") {
    errores.push("El campo 'precio' es obligatorio.");
  } else {
    const precio = Number(body.precio);
    if (Number.isNaN(precio) || precio <= 0) {
      errores.push("El precio debe ser mayor a 0.");
    }
  }

  if (body.stock === undefined || body.stock === null || body.stock === "") {
    errores.push("El campo 'stock' es obligatorio.");
  } else {
    const stock = Number(body.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      errores.push("El stock debe ser un entero mayor o igual a 0.");
    }
  }

  return errores;
}

exports.listarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    return res.json(productos);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al listar productos." });
  }
};

exports.obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({ mensaje: "ID inválido." });
    }

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    return res.json(producto);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al obtener producto." });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const errores = validarProducto(req.body);

    if (errores.length > 0) {
      return res.status(400).json({ mensaje: "Datos inválidos.", errores });
    }

    const nuevoProducto = await Producto.create({
      nombre: String(req.body.nombre).trim(),
      precio: Number(req.body.precio),
      stock: Number(req.body.stock),
    });

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al crear producto." });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({ mensaje: "ID inválido." });
    }

    const errores = validarProducto(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: "Datos inválidos.", errores });
    }

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    producto.nombre = String(req.body.nombre).trim();
    producto.precio = Number(req.body.precio);
    producto.stock = Number(req.body.stock);

    await producto.save();

    return res.json(producto);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al actualizar producto." });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({ mensaje: "ID inválido." });
    }

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    await producto.destroy();

    return res.json({ mensaje: "Producto eliminado correctamente." });
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al eliminar producto." });
  }
};
