const mongoose = require("mongoose");
const reviews = require("./reviews");
const user=require("./user")
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
    image: {url: String},
  price: Number,
  location: String,
    City: {
  type: String,
  required: true
},
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  category: {
    type: String,
    enum: ['hills', 'beaches', 'city', 'desert', 'forest','snowy'], 
    required: true,
  },

 lat:Number,
lng: Number,
});

listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
  await reviews.deleteMany({_id:{$in: listing.reviews}});
  }
})

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;