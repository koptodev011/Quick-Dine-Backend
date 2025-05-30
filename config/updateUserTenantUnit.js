// config/updateUserTenantUnit.js
import sequelize from './database.js';

const updateUserTenantUnit = async () => {
  try {
    // Get the QueryInterface
    const queryInterface = sequelize.getQueryInterface();

    // Drop the existing foreign key constraint
    await queryInterface.removeConstraint('UserTenantUnits', 'UserTenantUnits_tenant_unit_id_fkey');

    // Rename the column
    await queryInterface.renameColumn('UserTenantUnits', 'tenant_unit_id', 'tenant_id');

    // Add the new foreign key constraint
    await queryInterface.addConstraint('UserTenantUnits', {
      fields: ['tenant_id'],
      type: 'foreign key',
      name: 'UserTenantUnits_tenant_id_fkey',
      references: {
        table: 'Tenants',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    console.log('✅ Successfully updated UserTenantUnits table');
  } catch (error) {
    console.error('❌ Error updating UserTenantUnits table:', error);
    throw error;
  }
};

export default updateUserTenantUnit;
