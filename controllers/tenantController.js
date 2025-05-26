// controllers/tenantController.js
import { Tenant } from '../models/index.js';
import { uploadFile } from '../middleware/uploadMiddleware.js';
import fs from 'fs/promises';
import path from 'path';

// Create new tenant
export const createTenant = async (req, res) => {
  try {
    const { name, website, gst, meta } = req.body;
    let image = null;

    // Handle image upload if present
    if (req.file) {
      const uploadResult = await uploadFile(req.file, 'tenants');
      if (uploadResult.success) {
        image = uploadResult.path;
      }
    }

    // Create tenant
    const tenant = await Tenant.create({
      name,
      image,
      website,
      gst,
      meta: meta ? JSON.parse(meta) : null,
      active: true
    });

    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      data: tenant
    });
  } catch (error) {
    // If there was an error and we uploaded an image, delete it
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error creating tenant',
      error: error.message
    });
  }
};

// Validate tenant data
export const validateTenantData = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Tenant name is required'
    });
  }

  // Validate meta JSON if present
  if (req.body.meta) {
    try {
      JSON.parse(req.body.meta);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meta data format. Must be valid JSON'
      });
    }
  }

  next();
};
