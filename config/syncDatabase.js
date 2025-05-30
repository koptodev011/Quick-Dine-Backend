// config/syncDatabase.js
import sequelize from "./database.js";
import "../models/roleModel.js";
import "../models/userModel.js";
import "../models/countryModel.js";
import "../models/stateModel.js";
import "../models/tenantModel.js";
import "../models/tenantUnitModel.js";
import "../models/userTenantUnitModel.js";
import "../models/index.js"; // Import relationships
import removeTenantUnitId from './removeTenantUnitId.js';

const syncDatabase = async () => {
  try {
    // This will create/update all tables
    // Drop foreign key constraint if it exists
    try {
      await sequelize.query('ALTER TABLE UserTenantUnits DROP FOREIGN KEY UserTenantUnits_tenant_unit_id_fkey');
    } catch (err) {
      console.log('Foreign key constraint might not exist, continuing...');
    }

    // Drop the column
    try {
      await sequelize.query('ALTER TABLE UserTenantUnits DROP COLUMN tenant_unit_id');
    } catch (err) {
      console.log('Column might not exist, continuing...');
    }

    // Then sync the database
    await sequelize.sync({ alter: true }); // This will update tables while preserving data
    console.log("✅ All database tables were synchronized successfully.");
  } catch (error) {
    console.error("❌ Error synchronizing database:", error);
  }
};

export default syncDatabase;
