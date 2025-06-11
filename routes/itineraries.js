const express = require("express");
const router = express.Router();
const Itinerary = require("../models/itinerary");
const { isLoggedIn } = require("../middleware");

// Create itinerary
router.post("/", isLoggedIn, async (req, res) => {
  const { title, startDate, endDate, days, isPublic } = req.body;
  const it = new Itinerary({
    title, user: req.user._id, startDate, endDate, days, isPublic
  });
  await it.save();
  res.status(201).json(it);
});

// Get all for current user
router.get("/", isLoggedIn, async (req, res) => {
  const its = await Itinerary.find({ user: req.user._id }).populate("days.activities.listing");
  res.json(its);
});
// Get all itineraries for current user
router.get("/api/itineraries", isLoggedIn, async (req, res) => {
  const itineraries = await Itinerary.find({ user: req.user._id }).populate("user");
  res.json(itineraries);
});

// Get one (public or own)
router.get("/:id", async (req, res) => {
  const it = await Itinerary.findById(req.params.id).populate("days.activities.listing");
  if (!it) return res.sendStatus(404);
  if (!it.isPublic && (!req.user || !it.user.equals(req.user._id))) {
    return res.sendStatus(403);
  }
  res.json(it);
});

// Update (only own)
router.put("/:id", isLoggedIn, async (req, res) => {
  const it = await Itinerary.findById(req.params.id);
  if (!it || !it.user.equals(req.user._id)) return res.sendStatus(403);
  Object.assign(it, req.body);
  await it.save();
  res.json(it);
});

// Delete
router.delete("/:id", isLoggedIn, async (req, res) => {
  const it = await Itinerary.findById(req.params.id);
  if (!it || !it.user.equals(req.user._id)) return res.sendStatus(403);
  await it.remove();
  res.json({ message: "Deleted" });
});

module.exports = router;
