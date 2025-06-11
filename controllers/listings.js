const mongoose = require("mongoose");
const Listing = require("../models/listings");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");

// 🌐 Geocoding function using Nominatim
async function getCoordinates(location) {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "WanderlustApp",
      },
    });

    if (res.data.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lng: parseFloat(res.data[0].lon),
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.json(allListings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

module.exports.showListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username" },
      })
      .populate("owner", "username");

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
};

module.exports.createListing = async (req, res) => {
  const { title, description, price, location, City, country, category, lat, lng } = req.body.listing;

  if (!req.file) {
    return res.status(400).json({ error: "Image is required." });
  }

  try {
    let coords = null;
    if (!lat || !lng) {
      coords = await getCoordinates(location);
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "wanderlust_dev", allowed_formats: ["jpg", "png", "jpeg"] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      City,
      category,
      lat: lat ? parseFloat(lat) : coords?.lat,
      lng: lng ? parseFloat(lng) : coords?.lng,
      owner: req.user._id,
      image: { url: uploadResult.secure_url },
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading image or creating listing" });
  }
};

module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, lat, lng } = req.body.listing;

    const updateData = { ...req.body.listing };

    if (!lat || !lng) {
      const coords = await getCoordinates(location);
      if (coords) {
        updateData.lat = coords.lat;
        updateData.lng = coords.lng;
      }
    } else {
      updateData.lat = parseFloat(lat);
      updateData.lng = parseFloat(lng);
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });

    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "wanderlust_dev",
            allowed_formats: ["jpg", "png", "jpeg"],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      listing.image = { url: uploadResult.secure_url };
      await listing.save();
    }

    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating listing" });
  }
};

module.exports.destroyListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.json({ message: "Listing deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting listing" });
  }
};

module.exports.searchListings = async (req, res) => {
  const { search, category } = req.query;
  const query = {};

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { title: regex },
      { location: regex },
      { category: regex },
      { city: regex },
    ];
  }

  if (category) {
    query.category = category;
  }

  try {
    const listings = await Listing.find(query).populate("owner");
    res.json(listings);
  } catch (err) {
    console.error("Error searching listings:", err);
    res.status(500).json({ error: "Server error" });
  }
};
