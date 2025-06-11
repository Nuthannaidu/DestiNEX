const Listing = require("../models/listings");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
  try {
    console.log("POST /reviews body:", req.body);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const { comment, rating } = req.body.review || {};
    if (!comment || !rating) {
      return res.status(400).json({ error: "Both comment and rating are required" });
    }

    const review = new Review({
      comment,
      rating,
      author: req.user._id,
    });

    await review.save();

    // Instead of listing.save(), update only reviews array to avoid validation errors
    await Listing.findByIdAndUpdate(req.params.id, { $push: { reviews: review._id } });

    res.status(201).json({
      message: "Review posted successfully",
      review,
    });
  } catch (err) {
    console.error("❌ Error creating review:", err);
    res.status(500).json({ error: "Server error while creating review" });
  }
};


module.exports.updateReview = async (req, res) => {
  const { comment, rating } = req.body.review || {};
  const { reviewId } = req.params;

  if (!comment || !rating) {
    return res.status(400).json({ error: "Both comment and rating are required" });
  }

  try {
    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { comment, rating },
      { new: true }
    );

    res.status(200).json({ message: "Review updated", review: updated });
  } catch (err) {
    console.error("❌ Error updating review:", err.message);
    res.status(500).json({ error: "Failed to update review" });
  }
};

module.exports.destroyReview = async (req, res) => {
  const { listingId, reviewId } = req.params;

  try {
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(listingId, {
      $pull: { reviews: reviewId },
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting review:", err.message);
    res.status(500).json({ error: "Failed to delete review" });
  }
};
