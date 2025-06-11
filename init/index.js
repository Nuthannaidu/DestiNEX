const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.set('debug', true); // Enable Mongoose debugging

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
  await initDB();  // Call initDB after connecting
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Existing data deleted");
     initData.data=initData.data.map((obj)=>({
      ...obj,owner:"67374d00a3844baf993633ac"
     }))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

main().catch(err => console.error("Error connecting to DB:", err));
