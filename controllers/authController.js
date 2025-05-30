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

// export const register = async (req, res) => {
//   try {
//     console.log('Full request body:', JSON.stringify(req.body, null, 2));
//     console.log('Request file:', req.file);

//     // Parse form data
//     const { name, email, password, phone } = req.body;
    
//     // Get tenant IDs from form data
//     const tenantIds = [];
    
//     // Log all keys in the request body
//     console.log('All form field keys:', Object.keys(req.body));
    
//     // First check for tenant_id[index] format (singular)
//     let index = 0;
//     while (req.body[`tenant_id[${index}]`] !== undefined) {
//       const tenantId = req.body[`tenant_id[${index}]`];
//       console.log(`Found tenant_id[${index}]:`, tenantId, 'type:', typeof tenantId);
//       tenantIds.push(tenantId);
//       index++;
//     }
    
//     // Log the final tenant IDs array
//     console.log('Final tenant IDs array:', tenantIds, 'length:', tenantIds.length);
    
//     // If no tenant_id[index] found, try tenant_ids[index] format (plural)
//     if (tenantIds.length === 0) {
//       index = 0;
//       while (req.body[`tenant_ids[${index}]`]) {
//         tenantIds.push(req.body[`tenant_ids[${index}]`]);
//         index++;
//       }
//     }
    
//     // If still no IDs found, try other formats
//     if (tenantIds.length === 0 && req.body.tenant_ids) {
//       if (typeof req.body.tenant_ids === 'string') {
//         try {
//           const parsedIds = JSON.parse(req.body.tenant_ids);
//           if (Array.isArray(parsedIds)) {
//             tenantIds.push(...parsedIds);
//           } else {
//             tenantIds.push(parsedIds);
//           }
//         } catch (e) {
//           tenantIds.push(req.body.tenant_ids);
//         }
//       } else if (Array.isArray(req.body.tenant_ids)) {
//         tenantIds.push(...req.body.tenant_ids);
//       }
//     }
    
//     // Finally try single tenant_id field
//     if (tenantIds.length === 0 && req.body.tenant_id) {
//       tenantIds.push(req.body.tenant_id);
//     }

//     console.log('Parsed tenant IDs:', tenantIds);

//     // Validate required fields
//     if (!name || !email || !password || !phone || tenantIds.length === 0) {
//       return res.status(400).json({ 
//         message: "Please provide all required fields: name, email, password, phone, and at least one tenant_id" 
//       });
//     }

//     // Get profile photo path if uploaded
//     const profilePhotoPath = req.file ? req.file.path : null;

//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // Create user in transaction to ensure all operations succeed or none
//     const result = await sequelize.transaction(async (t) => {
//       console.log('Starting transaction...');
//       // Create a new user
//       const newUser = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         phone,
//         profilePhoto: profilePhotoPath
//       }, { transaction: t });

//       // Create user-tenant relationships
//       if (tenantIds.length > 0) {
//         console.log('Creating tenant relationships for user:', newUser.id);
//         console.log('Tenant IDs to process:', tenantIds);
        
//         // Create an array of records for each tenant ID
//         const userTenantRecords = [];
//         for (const tenant_id of tenantIds) {
//           const record = {
//             user_id: newUser.id,
//             tenant_id: parseInt(tenant_id), // Convert to integer
//             active: true,
//             meta: null
//           };
//           console.log('Creating record:', record);
//           userTenantRecords.push(record);
//         }

//         console.log('Final records to create:', JSON.stringify(userTenantRecords, null, 2));
        
//         try {
//           // First, verify we can find the tenant IDs
//           for (const record of userTenantRecords) {
//             const tenant = await Tenant.findByPk(record.tenant_id, { transaction: t });
//             if (!tenant) {
//               throw new Error(`Tenant with ID ${record.tenant_id} not found`);
//             }
//             console.log(`Verified tenant ${record.tenant_id} exists`);
//           }

//           // Create all records in a single transaction
//           const createdRecords = await UserTenantUnit.bulkCreate(userTenantRecords, { 
//             transaction: t,
//             validate: true // Enable validation
//           });
          
//           console.log('Successfully created user tenant records:', createdRecords.length);
          
//           // Verify all records were created
//           const verifyRecords = await UserTenantUnit.findAll({
//             where: { user_id: newUser.id },
//             transaction: t
//           });
//           console.log('Verified records in database:', JSON.stringify(verifyRecords.map(r => r.toJSON()), null, 2));
//         } catch (err) {
//           console.error('Error creating user tenant records:', err);
//           throw err;
//         }
//       }

//       const token = jwt.sign(
//         { id: newUser.id, email: newUser.email },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       return { newUser, token };
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       token: result.token,
//       user: {
//         id: result.newUser.id,
//         name: result.newUser.name,
//         email: result.newUser.email,
//         phone: result.newUser.phone,
//         profilePhoto: result.newUser.profilePhoto,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


export const register = async (req, res) => {
  try {
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Request file:', req.file);

    const { name, email, password, phone } = req.body;

    // Parse and normalize tenant IDs
    const tenantIds = [];
    let index = 0;

    // Handle tenant_id[0], tenant_id[1], ...
    while (req.body[`tenant_id[${index}]`] !== undefined) {
      tenantIds.push(parseInt(req.body[`tenant_id[${index}]`])); // parse to int
      index++;
    }

    // Fallbacks if tenant_id[0] format not found
    if (tenantIds.length === 0 && req.body.tenant_ids) {
      if (typeof req.body.tenant_ids === 'string') {
        try {
          const parsed = JSON.parse(req.body.tenant_ids);
          if (Array.isArray(parsed)) {
            tenantIds.push(...parsed.map(id => parseInt(id)));
          } else {
            tenantIds.push(parseInt(parsed));
          }
        } catch (e) {
          tenantIds.push(parseInt(req.body.tenant_ids));
        }
      } else if (Array.isArray(req.body.tenant_ids)) {
        tenantIds.push(...req.body.tenant_ids.map(id => parseInt(id)));
      }
    }

    if (tenantIds.length === 0 && req.body.tenant_id) {
      tenantIds.push(parseInt(req.body.tenant_id));
    }

    // Remove duplicates
    const uniqueTenantIds = [...new Set(tenantIds)];
    console.log('Final unique tenant IDs:', uniqueTenantIds);

    // Validate required fields
    if (!name || !email || !password || !phone || uniqueTenantIds.length === 0) {
      return res.status(400).json({ 
        message: "Please provide all required fields: name, email, password, phone, and at least one tenant_id" 
      });
    }

    const profilePhotoPath = req.file ? req.file.path : null;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sequelize.transaction(async (t) => {
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        profilePhoto: profilePhotoPath
      }, { transaction: t });

      // Validate all tenant IDs
      const tenantChecks = await Promise.all(
        uniqueTenantIds.map(id => Tenant.findByPk(id, { transaction: t }))
      );
      const missingTenants = tenantChecks
        .map((tenant, i) => (!tenant ? uniqueTenantIds[i] : null))
        .filter(id => id !== null);

      if (missingTenants.length > 0) {
        throw new Error(`Tenant(s) not found with IDs: ${missingTenants.join(', ')}`);
      }

      const userTenantRecords = uniqueTenantIds.map(tenant_id => ({
        user_id: newUser.id,
        tenant_id,
        active: true,
        meta: null,
        tenant_unit_id: null // explicitly set if nullable
      }));

      console.log('Records to insert:', userTenantRecords);

      await UserTenantUnit.bulkCreate(userTenantRecords, {
        transaction: t,
        validate: true
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return { newUser, token };
    });

    res.status(201).json({
      message: "User registered successfully",
      token: result.token,
      user: {
        id: result.newUser.id,
        name: result.newUser.name,
        email: result.newUser.email,
        phone: result.newUser.phone,
        profilePhoto: result.newUser.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
