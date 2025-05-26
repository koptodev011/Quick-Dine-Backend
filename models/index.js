// models/index.js
import Tenant from './tenantModel.js';
import TenantUnit from './tenantUnitModel.js';
import UserTenantUnit from './userTenantUnitModel.js';
import User from './userModel.js';

// Tenant relationships
Tenant.hasMany(TenantUnit, {
  foreignKey: 'tenant_id',
  as: 'tenantUnits'
});

// TenantUnit relationships
TenantUnit.hasMany(UserTenantUnit, {
  foreignKey: 'tenant_unit_id',
  as: 'userTenantUnits'
});

// User relationships
User.hasMany(UserTenantUnit, {
  foreignKey: 'user_id',
  as: 'userTenantUnits'
});

// Many-to-Many relationship between User and TenantUnit through UserTenantUnit
User.belongsToMany(TenantUnit, {
  through: UserTenantUnit,
  foreignKey: 'user_id',
  otherKey: 'tenant_unit_id',
  as: 'tenantUnits'
});

TenantUnit.belongsToMany(User, {
  through: UserTenantUnit,
  foreignKey: 'tenant_unit_id',
  otherKey: 'user_id',
  as: 'users'
});

export {
  Tenant,
  TenantUnit,
  UserTenantUnit,
  User
};
