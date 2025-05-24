import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import initRoles from "./config/initRoles.js";
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

app.get("/", (req, res) => {
  res.send("Quick Dine Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await syncDatabase(); // Sync database tables
  await initRoles(); // Initialize default roles
});
