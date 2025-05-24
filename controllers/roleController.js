// controllers/roleController.js
import Role from "../models/roleModel.js";

// Create a new role
export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({ name, description });
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update role
export const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.update({ name, description });
    res.status(200).json({ message: "Role updated successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.destroy();
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
