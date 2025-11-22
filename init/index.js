require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const ATLASDB_URL = process.env.ATLASDB_URL;

async function main() {
  try {
    await mongoose.connect(ATLASDB_URL);
    console.log("Connected to DB");

    // Run DB initialization only after connection
    await initDB();

    console.log("Database initialized successfully");
    process.exit(); // exit after finishing
  } catch (err) {
    console.error("Error connecting to DB:", err);
    process.exit(1);
  }
}

async function initDB() {
  // Clear old listings
  await Listing.deleteMany({});

  // Add owner ID to data
  const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "68ebc845e88a09a7daefcc97"
  }));

  await Listing.insertMany(dataWithOwner);
  console.log("Data was reinitialized");
}

main();
