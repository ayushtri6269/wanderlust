const { Listing, Review  } = require("./imports.js");

// Middleware to check login status
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log(req.path, "..", req.originalUrl);
        // Save the URL the user was trying to access
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

// Middleware to save redirect URL in locals for later use
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// ✅ Check if the logged-in user is the owner of the listing
module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not owner of this list");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async(req, res, next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};





// const { Listing } = require("../utils/imports.js");

// // Middleware: Check if user is logged in
// module.exports.isLoggedIn = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     console.log(req.path, "..", req.originalUrl);
//     req.session.redirectUrl = req.originalUrl;
//     req.flash("error", "You must be logged in to perform this action!");
//     return res.redirect("/login");
//   }
//   next();
// };

// // Middleware: Save redirect URL (for after login)
// module.exports.saveRedirectUrl = (req, res, next) => {
//   if (req.session.redirectUrl) {
//     res.locals.redirectUrl = req.session.redirectUrl;
//   }
//   next();
// };

// // ✅ Unified Owner Check — Works for Edit, Update, Delete
// module.exports.isOwner = async (req, res, next) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);

//   if (!listing) {
//     req.flash("error", "Listing not found!");
//     return res.redirect("/listings");
//   }

//   // Ensure user and owner exist, and match
//   if (!listing.owner || !res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id)) {
//     req.flash("error", "You don't have permission to modify this listing!");
//     return res.redirect(`/listings/${id}`);
//   }

//   // Attach listing to request so next middleware doesn’t need to re-fetch it
//   req.listing = listing;
//   next();
// };
