// routes/tenantUnitRoutes.js
import express from 'express';
import { addTenantUnit } from '../controllers/tenantController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Add tenant unit (no auth)
router.post('/', upload.single('image'), addTenantUnit);

export default router;
