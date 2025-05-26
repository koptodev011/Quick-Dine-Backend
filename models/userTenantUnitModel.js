// models/userTenantUnitModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js';
import TenantUnit from './tenantUnitModel.js';

const UserTenantUnit = sequelize.define('UserTenantUnit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  tenant_unit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TenantUnit,
      key: 'id'
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // This enables soft deletes
  deletedAt: 'deleted_at'
});

// Define relationships
UserTenantUnit.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

UserTenantUnit.belongsTo(TenantUnit, {
  foreignKey: 'tenant_unit_id',
  as: 'tenantUnit'
});

export default UserTenantUnit;
