const { Listing } = require("../utils/imports.js");
const { storage, uploadToCloudinary, cloudinary } = require("../cloudConfig.js");

// 🗺️ Mapbox Geocoding Setup
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index =  async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// 👀 SHOW - Display one listing (with populated reviews & owner)
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// 🆕 NEW - Render form to create a new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// ➕ CREATE - Create a new listing and save to DB
module.exports.createListing = async (req, res) => {

  // 1️⃣ Get geocoded data
  const geoResponse = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

    if (!geoResponse.body.features.length) {
      req.flash("error", "Location could not be geocoded");
      return res.redirect("/listings/new");
    }

  // 2️⃣ Upload file to Cloudinary
  const result = await uploadToCloudinary(req.file.buffer, "wanderlust_DEV");

  // 3️⃣ Create new listing
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {
    url: result.secure_url,
    filename: result.public_id
  };

  newListing.geometry = geoResponse.body.features[0].geometry;

  // 4️⃣ Save Save and redirect
  let savedListing = await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
};

// ✏️ EDIT - Render edit form for an existing listing
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  // Safely compute originalImageUrl if image exists
  let originalImageUrl = listing.image?.url || "/images/default.jpg";
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  // Pass originalImageUrl to EJS
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};


// 🔄 UPDATE - Update an existing listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

    // 1️⃣ Update text fields first
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // 2️⃣ Check if a new image was uploaded
  if (typeof req.file !== "undefined") {
    // Optional: delete old image from Cloudinary
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // 3️⃣ Replace old image details with the new Cloudinary upload
    const result = await uploadToCloudinary(req.file.buffer, "wanderlust_DEV");
    listing.image = {
      url: result.secure_url,
      filename: result.public_id
    };
    await listing.save(); // save the updated image field
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
};

// ❌ DELETE - Delete a listing
module.exports.destoryListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
