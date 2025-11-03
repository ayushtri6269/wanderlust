const {
  express,
  ExpressError,
  wrapAsync,
  validateSchema,
  Listing,
  listingSchema,
} = require("../utils/imports.js");

const { isLoggedIn, isOwner } = require("../utils/middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const router = express.Router();

// ----------------------------
// Middleware: validateListing
// ----------------------------
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// ----------------------------
// ROUTES USING router.route()
// ----------------------------


router
  .route("/")
  .get(wrapAsync(listingController.index)) // INDEX: GET /listings
  .post(
    isLoggedIn,
    upload.single("listing[image]"),    // multer middleware
    validateListing,
    wrapAsync(listingController.createListing));

// Favorite / Unfavorite routes
router.post('/:id/favorite', isLoggedIn, wrapAsync(listingController.addFavorite));
router.delete('/:id/favorite', isLoggedIn, wrapAsync(listingController.removeFavorite));

// NEW FORM
router.get("/new", isLoggedIn, listingController.renderNewForm);// NEW: GET /listings/new

// SHOW, UPDATE, DELETE, EDIT using router.route("/:id")

router
  .route("/:id")

  // SHOW: GET /listings/:id
  .get(wrapAsync(listingController.showListing))

  // UPDATE: PUT /listings/:id
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), // ✅ ADD THIS for image update
    validateListing,
    wrapAsync(listingController.updateListing))

    // DELETE: DELETE /listings/:id
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// EDIT: GET /listings/:id/edit (cannot combine with :id route in router.route)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// ----------------------------
// EXPORT ROUTER
// ----------------------------
module.exports = router;
