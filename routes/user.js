const {
  express,
  wrapAsync
} = require("../utils/imports.js");
const { saveRedirectUrl } = require("../utils/middleware.js");
const User = require("../models/user.js");
const passport = require("passport");
const userController = require("../controllers/users.js")
const router = express.Router();

// SIGNUP
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// LOGIN
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    userController.login
  );

// FAVORITES
const { isLoggedIn } = require("../utils/middleware.js");
router.get("/favorites", isLoggedIn, wrapAsync(userController.renderFavorites));

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;
