require("dotenv").config();
const express = require("express");
const app = express();
app.set('trust proxy', 1); // Trust proxy for correct HTTPS behavior on Render

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

// ===== Connect to MongoDB =====
const dburl = process.env.ATLAS_DB;
mongoose.connect(dburl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(console.error);

// ===== CORS =====
const allowedOrigins = [
  "http://localhost:3000",
  "https://destinexx.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ===== View engine =====
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

// ===== Session Store =====
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600
});
store.on("error", err => console.log("❌ Session store error", err));

app.use(session({
  store,
  name: "session-id",
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    domain: ".onrender.com", // or just remove if not using subdomains
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ===== Flash & Passport =====
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

// ===== Google OAuth =====
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://destinexx.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        username: profile.displayName,
        googleId: profile.id,
        email: profile.emails[0].value,
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    console.error("❌ Google Auth Error:", err);
    return done(err, null);
  }
}));

// ===== Set user and flash messages to res.locals =====
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

// ===== Auth Routes =====
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || "https://destinexx.onrender.com"}/listings`);
  }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL || "https://destinexx.onrender.com"}/listings`);
  });
});

// ===== Routes =====
const listingsRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const itineraryRoutes = require("./routes/itineraries.js");

app.use("/api/listings", listingsRoutes);
app.use("/api/listings", reviewRoutes);
app.use("/", userRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api", reviewRoutes);

// ===== Debug Routes =====
app.get("/debug-session", (req, res) => {
  res.json({ cookie: req.headers.cookie, session: req.session, user: req.user });
});

app.get("/api/currentUser", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// ===== Health Checks =====
app.get("/test", (req, res) => res.send("✅ Backend is working!"));
app.get("/check", (req, res) => res.json({ status: "✅ Backend is up and running" }));

// ===== Serve React Build (optional, only if hosting React in same app) =====
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
