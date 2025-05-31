// routes/dashboardRoutes.js
import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/data", getDashboardData);

export default router;
