// config/syncDatabase.js
import sequelize from "./db.js";
import "../models/roleModel.js";
import "../models/userModel.js";

const syncDatabase = async () => {
  try {
    // This will create/update all tables
    await sequelize.sync({ alter: true });
    console.log("✅ All database tables were synchronized successfully.");
  } catch (error) {
    console.error("❌ Error synchronizing database:", error);
  }
};

export default syncDatabase;
