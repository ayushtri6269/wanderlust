require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.js");

const ATLASDB_URL = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

async function createAdminUser() {
    try {
        await mongoose.connect(ATLASDB_URL);
        console.log("Connected to MongoDB");

        const adminEmail = process.env.ADMIN_EMAIL || "adnmin@wonderlust.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin@2326";
        const username = "admin";

        // Check if admin user already exists
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            console.log("Admin user already exists. Updating...");
            await User.findByIdAndDelete(existingUser._id);
        }

        // Create new admin user
        const adminUser = new User({
            email: adminEmail,
            username: username
        });

        // Register with password
        await User.register(adminUser, adminPassword);

        console.log("✅ Admin user created successfully!");
        console.log(`   Username: ${username}`);
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

createAdminUser();
