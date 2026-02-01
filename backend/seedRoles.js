const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Role = require('./models/roleSchema');
const User = require('./models/userSchema');

const connectDatabase = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/kfc').then(con => {
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
    });
};

const seedRoles = async () => {
    try {
        await connectDatabase();

        const allPermissions = [
            'dashboard', 'orders', 'kitchen', 'products', 'categories',
            'ingredients', 'users', 'roles', 'promotions', 'reports', 'stores'
        ].flatMap(res => [`${res}.view`, `${res}.edit`]);

        const roles = [
            {
                name: 'admin',
                description: 'Administrator with full access',
                permissions: allPermissions,
                isDefault: true
            },
            {
                name: 'staff',
                description: 'Staff member',
                permissions: [
                    'dashboard.view',
                    'orders.view', 'orders.edit',
                    'products.view', 'categories.view', 'ingredients.view',
                    'kitchen.view',
                ],
                isDefault: true
            },
            {
                name: 'customer',
                description: 'Regular customer',
                permissions: ['products.view', 'orders.view'], // Basic view permissions
                isDefault: true
            },
            {
                name: 'cashier',
                description: 'Store cashier',
                permissions: ['orders.view', 'orders.edit', 'products.view'],
                isDefault: true
            },
            {
                name: 'kitchen',
                description: 'Kitchen staff',
                permissions: ['kitchen.view', 'orders.view', 'orders.edit'],
                isDefault: true
            },
            {
                name: 'delivery',
                description: 'Delivery staff',
                permissions: ['orders.view', 'orders.edit'],
                isDefault: true
            }
        ];

        for (const roleData of roles) {
            let role = await Role.findOne({ name: roleData.name });
            if (!role) {
                role = await Role.create(roleData);
                console.log(`Created role: ${role.name}`);
            } else {
                if (role.isDefault) {
                    role.permissions = roleData.permissions;
                    role.description = roleData.description;
                    await role.save();
                    console.log(`Updated default role: ${role.name}`);
                } else {
                    console.log(`Role already exists (skipped update): ${role.name}`);
                }
            }
        }

        console.log('Roles seeded successfully');

        // Migrate Users
        console.log('Starting user migration...');
        // Migrate Users
        console.log('Starting user migration...');

        // Use native collection to avoid schema casting errors (String vs ObjectId)
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users to check for migration.`);

        for (const user of users) {
            let roleIdToSet = null;
            let needUpdate = false;

            // Check if already migrated
            if (user.role && typeof user.role === 'object' && user.role.toString().length === 24) {
                // already ObjectId
                // continue;
            }

            // If 'roleId' exists, use it
            if (user.roleId) {
                roleIdToSet = user.roleId;
                needUpdate = true;
            }
            // If 'role' is string (legacy)
            else if (user.role && typeof user.role === 'string') {
                let roleName = user.role;
                if (roleName === 'receptionist') roleName = 'staff';
                if (roleName === 'chef') roleName = 'kitchen';
                if (roleName === 'warehouse') roleName = 'staff';

                // Fix for 'admin' string if it exists
                if (roleName === 'admin') roleName = 'admin';

                const roleObj = await Role.findOne({ name: roleName });
                if (roleObj) {
                    roleIdToSet = roleObj._id;
                    needUpdate = true;
                } else {
                    console.log(`Warning: Could not find role for string '${roleName}' (User: ${user.email})`);
                }
            }
            else if (!user.role) {
                // No role at all
                const customerRole = await Role.findOne({ name: 'customer' });
                if (customerRole) {
                    roleIdToSet = customerRole._id;
                    needUpdate = true;
                }
            }

            if (needUpdate && roleIdToSet) {
                await mongoose.connection.db.collection('users').updateOne(
                    { _id: user._id },
                    {
                        $set: { role: roleIdToSet },
                        $unset: { roleId: "" }
                    }
                );
                console.log(`Migrated user ${user.email}: Set role to ${roleIdToSet}`);
            }
        }

        console.log('User migration completed successfully.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedRoles();
