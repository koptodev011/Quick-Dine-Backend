// models/userModel.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// models/userModel.js
const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // ✅ disable automatic createdAt & updatedAt
  }
);

export default User;
