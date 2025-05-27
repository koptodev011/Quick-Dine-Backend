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

const syncDatabase = async () => {
  try {
    // This will create/update all tables
    await sequelize.sync({ force: true }); // This will recreate all tables
    console.log("✅ All database tables were synchronized successfully.");
  } catch (error) {
    console.error("❌ Error synchronizing database:", error);
  }
};

export default syncDatabase;
