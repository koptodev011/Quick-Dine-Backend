// routes/tenantRoutes.js
import express from 'express';
import { createTenant, validateTenantData } from '../controllers/tenantController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new tenant (protected route)
router.post('/',
  verifyToken, // Ensure user is authenticated
  upload.single('image'), // Handle file upload
  validateTenantData, // Validate request data
  createTenant
);

export default router;
