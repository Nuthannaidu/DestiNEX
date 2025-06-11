const User = require("../models/user");

// SIGNUP
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.status(200).json({
        message: "User registered successfully",
        user: {
          _id: registeredUser._id, // ✅ changed from `id` to `_id`
          username: registeredUser.username,
          email: registeredUser.email,
        },
      });
    });
  } catch (err) {
    res.status(400).json({
      error: err.message || "Failed to register user",
    });
  }
};

// LOGIN
module.exports.login = (req, res) => {
  res.status(200).json({
    message: "Welcome back!",
    user: {
      _id: req.user._id, // ✅ changed from `id` to `_id`
      username: req.user.username,
      email: req.user.email,
    },
  });
};

// LOGOUT
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "You are logged out" });
  });
};

// GET CURRENT USER (Optional)
module.exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      authenticated: true,
      user: {
        _id: req.user._id, // ✅ changed from `id` to `_id`
        username: req.user.username,
        email: req.user.email,
      },
    });
  } else {
    res.status(200).json({ authenticated: false });
  }
};
