// config/removeTenantUnitId.js
import sequelize from './database.js';

const removeTenantUnitId = async () => {
  try {
    // Use raw query to remove the column
    await sequelize.query('ALTER TABLE UserTenantUnits DROP COLUMN tenant_unit_id');
    
    console.log('✅ Successfully removed tenant_unit_id column');
  } catch (error) {
    console.error('❌ Error removing tenant_unit_id column:', error);
    throw error;
  }
};

export default removeTenantUnitId;
