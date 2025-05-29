import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import tenantUnitRoutes from "./routes/tenantUnitRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import initRoles from "./config/initRoles.js";
import initLocations from "./config/initLocations.js";
import syncDatabase from "./config/syncDatabase.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/addtenants", tenantRoutes);
app.use("/api/getalltenants", tenantRoutes);
app.use("/api/updatetenant", tenantRoutes);
app.use("/api/tenantunit", tenantUnitRoutes);
app.use("/api/location", locationRoutes);

app.get("/", (req, res) => {
  res.send("Quick Dine Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await syncDatabase(); // Sync database tables
  await initRoles();
  await initLocations(); // Initialize default roles
});
