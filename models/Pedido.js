const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "confirmado", "cancelado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    tableName: "pedidos",
    timestamps: false,
  }
);

module.exports = Pedido;
