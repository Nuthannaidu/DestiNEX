const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrap.js");
const userController = require("../controllers/users.js");

// Signup
router.post("/signup", wrapAsync(userController.signup));

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid username or password" });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        message: "Welcome back!",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

// Logout
router.post("/logout", userController.logout);

// Get Current User (Optional for persistence)
router.get("/currentUser", userController.getCurrentUser);

module.exports = router;
