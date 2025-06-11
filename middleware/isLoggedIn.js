module.exports = (req, res, next) => {
  console.log("Authenticated?", req.isAuthenticated?.());
  console.log("User:", req.user);

  if (!req.isAuthenticated || !req.isAuthenticated()) {
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(401).json({ error: "You must be logged in" });
    }
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};
