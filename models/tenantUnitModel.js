// models/tenantUnitModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Tenant from './tenantModel.js';
import State from './stateModel.js';
import Country from './countryModel.js';

const TenantUnit = sequelize.define('TenantUnit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tenant,
      key: 'id'
    }
  },
  line_one: {
    type: DataTypes.STRING,
    allowNull: true
  },
  line_two: {
    type: DataTypes.STRING,
    allowNull: true
  },
  line_three: {
    type: DataTypes.STRING,
    allowNull: true
  },
  landmark: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lattitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  altitude: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: State,
      key: 'id'
    }
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Country,
      key: 'id'
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
TenantUnit.belongsTo(Tenant, {
  foreignKey: 'tenant_id',
  as: 'tenant'
});

TenantUnit.belongsTo(State, {
  foreignKey: 'state_id',
  as: 'unit_state'
});

TenantUnit.belongsTo(Country, {
  foreignKey: 'country_id',
  as: 'unit_country'
});

export default TenantUnit;
