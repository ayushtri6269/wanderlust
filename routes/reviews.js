const {
  express,
  ExpressError,
  wrapAsync,
  Listing,
  Review,
  reviewSchema,
} = require("../utils/imports.js");

const { isLoggedIn, isReviewAuthor } = require("../utils/middleware.js");
const reviewController = require("../controllers/reviews.js"); // Controller functions for reviews
const router = express.Router({ mergeParams: true }); // mergeParams allows access to :id from parent route (/listings/:id/reviews)

// ----------------------------
// Middleware: validateReviews
// ----------------------------

// Validates review data (rating and comment) using Joi schema (reviewSchema).
// Throws an ExpressError if validation fails.

const validateReviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// ----------------------------
// ROUTES
// ----------------------------

// CREATE REVIEW: Add a new review to a listing
// POST /listings/:id/reviews
// Only logged-in users can create reviews
// Request body validated with validateReviews middleware

router.post(
  "/",
  isLoggedIn,
  validateReviews,
  wrapAsync(reviewController.createReview)
);

// DELETE REVIEW: Delete a review from a listing
// DELETE /listings/:id/reviews/:reviewId
// Only the author of the review can delete it (checked via isReviewAuthor middleware)

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destoryReview)
);

// ----------------------------
// EXPORT ROUTER
// ----------------------------
module.exports = router;
