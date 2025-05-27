// models/stateModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Country from './countryModel.js';

const State = sequelize.define('State', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Country,
      key: 'id'
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define relationship with Country
State.belongsTo(Country, {
  foreignKey: 'country_id',
  as: 'country'
});

export default State;
