// models/userModel.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Role from "./roleModel.js";

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
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2 // Default to regular user role
    },
  },
  {
    timestamps: false, // ✅ disable automatic createdAt & updatedAt
  }
);

// Define association with Role
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

export default User;
