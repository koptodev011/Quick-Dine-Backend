// routes/tenantRoutes.js
import express from 'express';
import { createTenant, validateTenantData, getTenants, editTenant, addTenantUnit } from '../controllers/tenantController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new tenant (no auth)
router.post('/',
  upload.single('image'), // Handle file upload
  validateTenantData, // Validate request data
  createTenant
);

// Get all tenants (no auth required)
router.get('/',
  getTenants
);

// Edit tenant data (no auth required)
router.put('/:tenant_id',
  upload.single('image'),
  editTenant
);

// Add tenant unit (no auth required)
router.post('/',
  upload.single('image'), // Handle file upload
  addTenantUnit
);

export default router;
