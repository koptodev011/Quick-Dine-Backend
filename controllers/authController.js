// controllers/authController.js
import User from "../models/userModel.js";
import UserTenantUnit from "../models/userTenantUnitModel.js";
import Tenant from "../models/tenantModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sequelize from "../config/database.js";

// Login Function
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Register Function
// Get All Users Function
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({
      message: "Users retrieved successfully",
      users
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get User's Tenants
export const getUserTenants = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Validate user ID
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if user exists
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'phone', 'profilePhoto']
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's tenants
    const userTenants = await UserTenantUnit.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Tenant,
          as: 'tenant',
          attributes: ['id', 'name', 'image', 'website', 'active', 'gst']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      message: "User's tenants retrieved successfully",
      user: user,
      tenants: userTenants.map(ut => ({
        ...ut.tenant.dataValues,
        active: ut.active,
        joinedAt: ut.createdAt
      }))
    });

  } catch (error) {
    console.error("Error fetching user's tenants:", error);
    res.status(500).json({ 
      message: "Error fetching user's tenants", 
      error: error.message 
    });
  }
};


















export const register = async (req, res) => {
  try {
    // Debug logging
    console.log('=== DEBUG START ===');
    console.log('Request body:', req.body);
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', Object.keys(req.body));
    console.log('Raw body:', JSON.stringify(req.body, null, 2));
    console.log('=== DEBUG END ===');

    // Extract user data
    const { name, email, password, phone } = req.body;

    // Validate required user fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ 
        message: "Please provide all required fields: name, email, password, and phone" 
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // If file was uploaded but user exists, we should clean it up
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting uploaded file:', unlinkError);
        }
      }
      return res.status(400).json({ message: "User already exists" });
    }

    // Handle profile photo
    let profilePhotoPath = null;
    if (req.file) {
      // Convert backslashes to forward slashes for consistency
      profilePhotoPath = req.file.path.replace(/\\/g, '/');
      console.log('Profile photo uploaded:', profilePhotoPath);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    const result = await sequelize.transaction(async (t) => {

      console.log('Creating user with data:', { name, email, phone });
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        profilePhoto: profilePhotoPath
      }, { transaction: t });
      console.log('User created with ID:', newUser.id);

      // Step 2: Handle tenant IDs
      const tenantIds = [];
      
      console.log('=== TENANT ID PROCESSING ===');
      // Try to get tenant IDs from form data
      if (req.body) {
        Object.entries(req.body).forEach(([key, value]) => {
          console.log(`Key: ${key}, Value: ${value}, Type: ${typeof value}`);
          
          // Try to extract index from the key
          const index = key.match(/\d+/);
          if (key.includes('tenant_id') && index) {
            const parsedValue = parseInt(value);
            console.log(`Found tenant_id key: ${key}, Value: ${value}, Parsed: ${parsedValue}`);
            if (!isNaN(parsedValue)) {
              tenantIds.push(parsedValue);
              console.log(`Added tenant ID: ${parsedValue}`);
            }
          }
        });
      }

      console.log('Final tenant IDs:', tenantIds);
      console.log('=== END TENANT ID PROCESSING ===');

      if (tenantIds.length === 0) {
        throw new Error('At least one tenant ID is required');
      }

      // Step 3: Verify all tenants exist
      for (const tenantId of tenantIds) {
        const tenant = await Tenant.findByPk(tenantId, { transaction: t });
        if (!tenant) {
          throw new Error(`Tenant with ID ${tenantId} not found`);
        }
        console.log(`Verified tenant ${tenantId} exists`);
      }

      // Step 4: Create user-tenant relationships
      console.log('Creating relationships for tenant IDs:', tenantIds);
      
      const userTenantRecords = tenantIds.map(tenantId => ({
        user_id: newUser.id,
        tenant_id: tenantId,
        active: true,
        meta: null
      }));

      console.log('User-tenant records to create:', userTenantRecords);
      
      // Create all tenant relationships
      const createdRecords = await UserTenantUnit.bulkCreate(userTenantRecords, {
        transaction: t,
        validate: true,
        returning: true
      });
      
      console.log('Created records:', createdRecords.length);
      console.log('User-tenant relationships created successfully');
      
      // Double check the created records
      const verifyRecords = await UserTenantUnit.findAll({
        where: { user_id: newUser.id },
        transaction: t
      });
      console.log('Verified created records count:', verifyRecords.length);

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return { newUser, token };
    });

    // Send success response
    res.status(201).json({
      message: "User registered successfully",
      token: result.token,
      user: {
        id: result.newUser.id,
        name: result.newUser.name,
        email: result.newUser.email,
        phone: result.newUser.phone,
        profilePhoto: result.newUser.profilePhoto
      },
    });
  } catch (error) {
    // If there was an error and a file was uploaded, clean it up
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    console.error("Registration error:", error);

    // Send appropriate error message
    if (error.message.includes('Invalid file type')) {
      res.status(400).json({ 
        message: "Registration failed", 
        error: "Profile photo must be JPEG, PNG or GIF format"
      });
    } else {
      res.status(500).json({ 
        message: "Registration failed", 
        error: error.message 
      });
    }
  }
};
