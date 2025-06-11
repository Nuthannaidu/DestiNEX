const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cloudinaryStorage = require('multer-storage-cloudinary'); 


cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:  process.env.CLOUD_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_dev", 
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });
module.exports = { upload };
