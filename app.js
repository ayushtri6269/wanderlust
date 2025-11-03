require("dotenv").config();
const express = require("express");
const app = express();
// Ensure templates always have these locals to avoid ReferenceError when rendering
app.locals.currentUser = null;
app.locals.success = [];
app.locals.error = [];
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
require("dotenv").config();

// Import routes
const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");
const userRouter = require("./routes/user");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// Database URL: prefer ATLASDB_URL, fall back to local Mongo for development
const ATLASDB_URL = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

// Connect to MongoDB with error handling
(async function main() {
  try {
    await mongoose.connect(ATLASDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    // Do not crash the process here; depending on your preference you may want to exit.
  }
})();

// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs',ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Ensure res.locals defaults exist for templates to avoid ReferenceError
app.use((req, res, next) => {
  res.locals.currentUser = res.locals.currentUser ?? null;
  res.locals.success = res.locals.success ?? req.flash ? req.flash('success') : [];
  res.locals.error = res.locals.error ?? req.flash ? req.flash('error') : [];
  next();
});

const store = MongoStore.create({
  mongoUrl: ATLASDB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24* 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
      maxAge: 1000 * 60 * 60 * 24 * 7
  },
};

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Health-check endpoint for load balancers / CI
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});



// Session + Flash
app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash message middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});


// Mount Routers
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// 404 handler
app.all("*",(req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});


// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error.ejs", { err });
});

// Start server
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful handling for uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});
