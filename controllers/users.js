const User = require("../models/user.js");

// ----------------------------
// RENDER SIGNUP FORM
// ----------------------------
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// ----------------------------
// HANDLE SIGNUP
// ----------------------------
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// ----------------------------
// RENDER LOGIN FORM
// ----------------------------
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// ----------------------------
// HANDLE LOGIN
// ----------------------------
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

// ----------------------------
// HANDLE LOGOUT
// ----------------------------
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

// ----------------------------
// RENDER FAVORITES PAGE
// ----------------------------
module.exports.renderFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.render("users/favorites.ejs", { favorites: user.favorites || [] });
};
