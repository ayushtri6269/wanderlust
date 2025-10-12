const { Listing, Review } = require("../utils/imports.js");

// ----------------------------
// CREATE REVIEW
// ----------------------------

// Adds a new review to a listing.
// Expects `req.body.review` to contain `rating` and `comment`.
// The logged-in user (`req.user._id`) is set as the review author.

module.exports.createReview = async (req, res) => {
  const { id } = req.params; // Listing ID from URL
  const listing = await Listing.findById(id); // Find the listing
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review); // Create new review
  newReview.author = req.user._id; // Set author
  listing.reviews.push(newReview); // Add reference to listing

  await newReview.save(); // Save review to DB
  await listing.save(); // Save listing with updated reviews array

  req.flash("success", "New Review Added!"); // Success message
  res.redirect(`/listings/${listing._id}`); // Redirect to listing page
};

// ----------------------------
// DELETE REVIEW
// ----------------------------

// Deletes a review from a listing.
// Only the author of the review is allowed (checked by isReviewAuthor middleware)

module.exports.destoryReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove the review reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the review document itself
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!"); // Success message
  res.redirect(`/listings/${id}`); // Redirect to listing page
};
