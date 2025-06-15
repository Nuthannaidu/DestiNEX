require("dotenv").config();
const express = require("express");
app.set('trust proxy', 1);
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cors = require("cors");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("./models/user");

// ✅ Connect to MongoDB
const dburl = process.env.ATLAS_DB;
mongoose.connect(dburl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(console.error);

// ✅ CORS for React frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://destinex-1.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, Postman) or from allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin"));
    }
  },
  credentials: true
}));


// ✅ Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Static files and view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

// ✅ Session store in MongoDB
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => console.log("❌ Session store error:", err));

app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
     domain: ".onrender.com",
    httpOnly: true,
    secure: true, // set to true if using HTTPS in production
     sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

// ✅ Flash and Passport setup
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// ---------- Passport Local Strategy ----------
passport.use(new LocalStrategy(
  { usernameField: 'email' }, // 👈 Tells it to use 'email'
  User.authenticate()
));

passport.serializeUser((user, done) => {
   console.log("Serializing user object:", user); 
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
   console.log("Deserializing ID:",id);
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

// ---------- Passport Google OAuth Strategy ----------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},async (accessToken, refreshToken, profile, done) => {
   console.log("GOOGLE PROFILE", profile); // Debug
  try {
    // Find user by Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // If user doesn't exist, create one
      user = new User({
        username: profile.displayName,
        googleId: profile.id,
        email: profile.emails[0].value,
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
     console.error("GOOGLE AUTH ERROR", err);
    return done(err, null);
  }
}));

// ✅ Add current user to locals for views and flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

// ---------- Auth Routes for Google OAuth ----------
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  (req, res) => {
    // Redirect to frontend after successful login
  res.redirect(`${process.env.FRONTEND_URL}/listings`);
  }
);


app.get('/debug-session', (req, res) => {
  res.json({ cookie: req.headers.cookie, session: req.session, user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
   res.redirect(`${process.env.FRONTEND_URL}/listings`);
  });
});

// ✅ Routes
console.log("✅ Mounting listings routes");
const listingsRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const itineraryRoutes = require("./routes/itineraries.js");

app.use("/api/listings", listingsRoutes);
app.use("/api/listings", reviewRoutes);
app.use("/", userRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api", reviewRoutes); // so /api/listings/:listingId/reviews/:reviewId works

// ✅ Root route redirect
app.get("/", (req, res) => res.redirect(`${process.env.FRONTEND_URL}/listings`));

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.stack);
  if (res.headersSent) return next(err);
  if (req.originalUrl.startsWith("/api/")) {
    res.status(500).json({ error: "Server error" });
  } else {
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
app.get('/api/currentUser', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});
app.get("/test", (req, res) => {
  res.send("✅ Backend is working!");
});
app.get("/check", (req, res) => {
  res.json({ status: "✅ backend deployed correctly" });
});
