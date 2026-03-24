import './config/env.js';
import connectDB from './config/db.js';
import User from './models/User.js';

// Connect to Database
const startSeeding = async () => {
    await connectDB();
    await importData();
};

const importData = async () => {
    try {
        const adminUser = {
            name: 'Admin User',
            email: 'admin@bharatmart.com',
            password: 'adminpassword123',
            role: 'admin',
        };

        await User.create(adminUser);

        console.log('Admin User Seeded!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

startSeeding();
