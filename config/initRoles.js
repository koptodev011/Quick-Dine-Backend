// config/initRoles.js
import Role from "../models/roleModel.js";

const initRoles = async () => {
  try {
    // Default roles
    const defaultRoles = [
      { name: "admin", description: "Administrator with full access" },
      { name: "user", description: "Regular user with limited access" },
      { name: "manager", description: "Restaurant manager with moderate access" },
      { name: "staff", description: "Restaurant staff with basic access" }
    ];

    // Create roles if they don't exist
    for (const role of defaultRoles) {
      const [createdRole] = await Role.findOrCreate({
        where: { name: role.name },
        defaults: role
      });
      console.log(`Role ${createdRole.name} is ready`);
    }

    console.log("✅ Roles initialization completed");
  } catch (error) {
    console.error("❌ Error initializing roles:", error);
  }
};

export default initRoles;
