// scripts/syncDatabase.js
import sequelize from '../config/database.js';
import { Tenant, TenantUnit, UserTenantUnit, User } from '../models/index.js';

const syncDatabase = async () => {
  try {
    // Sync all models with the database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
};

syncDatabase();
