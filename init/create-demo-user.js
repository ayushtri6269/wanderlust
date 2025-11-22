require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.js");

const ATLASDB_URL = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

async function createDemoUser() {
    try {
        await mongoose.connect(ATLASDB_URL);
        console.log("Connected to MongoDB");

        // Check if demo user already exists
        const existingUser = await User.findOne({ username: "demo" });

        if (existingUser) {
            console.log("Demo user already exists. Deleting old user...");
            await User.findByIdAndDelete(existingUser._id);
        }

        // Create new demo user
        const demoUser = new User({
            email: "demo@wanderlust.com",
            username: "demo"
        });

        // Register with password
        await User.register(demoUser, "123456");

        console.log("✅ Demo user created successfully!");
        console.log("   Username: demo");
        console.log("   Password: 123456");
        console.log("   Email: demo@wanderlust.com");

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

createDemoUser();
