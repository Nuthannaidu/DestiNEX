const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrap");
const reviewController = require("../controllers/reviews");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAuthor = require("../middleware/isAuthor");

router.post("/:id/reviews", isLoggedIn, wrapAsync(reviewController.createReview));
router.put("/:listingId/reviews/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.updateReview));
router.delete("/listings/:listingId/reviews/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;