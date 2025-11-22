require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const ATLASDB_URL = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

// Category mapping based on listing titles/descriptions
const categoryMap = {
    beach: 'Amazing Pools',
    mountain: 'Mountains',
    castle: 'Castles',
    city: 'Iconic Cities',
    cabin: 'Camping',
    treehouse: 'Farms',
    chalet: 'Arctic',
    yacht: 'Boats',
    boat: 'Boats',
    apartment: 'Rooms',
    loft: 'Rooms',
    dome: 'Domes',
};

async function addCategoriesToListings() {
    try {
        await mongoose.connect(ATLASDB_URL);
        console.log("Connected to MongoDB");

        const listings = await Listing.find({});
        console.log(`Found ${listings.length} listings to update`);

        for (const listing of listings) {
            if (!listing.category) {
                // Try to assign category based on title
                const title = listing.title.toLowerCase();
                const description = (listing.description || '').toLowerCase();

                let assignedCategory = 'Trending'; // default

                // Check for keywords in title or description
                for (const [keyword, category] of Object.entries(categoryMap)) {
                    if (title.includes(keyword) || description.includes(keyword)) {
                        assignedCategory = category;
                        break;
                    }
                }

                listing.category = assignedCategory;
                await listing.save();
                console.log(`Updated "${listing.title}" with category: ${assignedCategory}`);
            }
        }

        console.log("\nAll listings updated successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

addCategoriesToListings();
