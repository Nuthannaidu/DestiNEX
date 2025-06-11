const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  note: String
});

const daySchema = new Schema({
  date: Date,
  activities: [activitySchema]
});

const itinerarySchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startDate: Date,
  endDate: Date,
  days: [daySchema],
  isPublic: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Itinerary", itinerarySchema);
