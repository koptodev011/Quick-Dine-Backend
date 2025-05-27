// controllers/tenantController.js
import { Tenant, TenantUnit } from '../models/index.js';
import { uploadFile } from '../middleware/uploadMiddleware.js';
import fs from 'fs/promises';
import path from 'path';

// Create new tenant
export const createTenant = async (req, res) => {
  try {
    const { name, website, gst } = req.body;
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
// Get all tenants
export const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      where: { active: true },
      attributes: ['id', 'name', 'website', 'gst', 'image', 'meta', 'created_at', 'updated_at']
    });

    res.status(200).json({
      success: true,
      message: 'Tenants retrieved successfully',
      data: tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving tenants',
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

  next();
};

// Edit tenant data only
export const editTenant = async (req, res) => {
  try {
    const { tenant_id } = req.params;
    const { name, website, gst } = req.body;
    let image = null;

    // Find the tenant
    const tenant = await Tenant.findOne({
      where: { id: tenant_id }
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Handle image upload if present
    if (req.file) {
      const uploadResult = await uploadFile(req.file, 'tenants');
      if (uploadResult.success) {
        // Delete old image if exists
        if (tenant.image) {
          try {
            await fs.unlink(tenant.image);
          } catch (unlinkError) {
            console.error('Error deleting old image:', unlinkError);
          }
        }
        image = uploadResult.path;
      }
    }

    // Update tenant data
    await tenant.update({
      name: name || tenant.name,
      website: website || tenant.website,
      gst: gst || tenant.gst,
      image: image || tenant.image
    });

    // Get updated tenant
    const updatedTenant = await Tenant.findOne({
      where: { id: tenant_id }
    });

    res.status(200).json({
      success: true,
      message: 'Tenant updated successfully',
      data: updatedTenant
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
      message: 'Error updating tenant',
      error: error.message
    });
  }
};

// Add new tenant unit with form data
export const addTenantUnit = async (req, res) => {
  try {
    const {
      name,
      line_one,
      line_two,
      line_three,
      landmark,
      city,
      postal_code,
      lattitude,
      longitude,
      altitude,
      state_id,
      country_id
    } = req.body;

    // Validate required fields
    if (!name || !line_one || !city || !postal_code || !state_id || !country_id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    let image = null;

    // Handle image upload if present
    if (req.file) {
      const uploadResult = await uploadFile(req.file, 'tenant-units');
      if (uploadResult.success) {
        image = uploadResult.path;
      }
    }

    // For now, using a default tenant_id of 1
    const tenant_id = 1;

    // Create tenant unit with tenant_id
    const tenantUnit = await TenantUnit.create({
      name,
      tenant_id,
      image,
      line_one,
      line_two,
      line_three,
      landmark,
      city,
      postal_code,
      lattitude,
      longitude,
      altitude,
      state_id,
      country_id
    });

    res.status(201).json({
      success: true,
      message: 'Tenant unit created successfully',
      data: tenantUnit
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
      message: 'Error creating tenant unit',
      error: error.message
    });
  }
};
