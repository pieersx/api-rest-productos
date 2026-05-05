const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DetallePedido = sequelize.define(
  "DetallePedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pedidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    producto: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.01,
      },
    },
  },
  {
    tableName: "detalles_pedido",
    timestamps: false,
  }
);

module.exports = DetallePedido;
