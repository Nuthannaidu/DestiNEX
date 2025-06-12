const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");
const reviewController = require("../controllers/reviews");
const { isLoggedIn, isOwner, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const wrapAsync = require("../utils/wrap");

// All listings
router.get("/", wrapAsync(listingController.index));
router.get("/", async (req, res) => {
  res.json({ message: "✅ Listings route is working" });
});

// Search by category
router.get("/search", wrapAsync(listingController.searchListings));

// Show single listing
router.get("/:id", wrapAsync(listingController.showListing));

// Create listing
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  wrapAsync(listingController.createListing)
);

// Update listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  wrapAsync(listingController.updateListing)
);

// Delete listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

/* ----------- ✅ REVIEW ROUTES MOUNTED UNDER LISTING ----------- */

// Create a review
router.post("/:id/reviews", isLoggedIn, wrapAsync(reviewController.createReview));

// Update a review
router.put("/:listingId/reviews/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.updateReview));

// Delete a review
router.delete("/:listingId/reviews/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
