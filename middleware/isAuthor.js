const Review = require("../models/reviews");

module.exports = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (!req.user || review.author.toString() !== req.user._id.toString()) {
      if (req.originalUrl.startsWith("/api/")) {
        return res.status(403).json({ error: "Not authorized to perform this action" });
      }

      req.flash("error", "You do not have permission to do that.");
      return res.redirect("back");
    }

    next();
  } catch (err) {
    console.error("Authorization error:", err);
    return res.status(500).json({ error: "Server error during authorization." });
  }
};
