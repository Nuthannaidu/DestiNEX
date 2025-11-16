<div align="center">

  <h1>🌍 Destinexx – Travel & Itinerary MERN Application</h1>
  <p>A complete travel listings and itinerary planning platform built using the MERN Stack.</p>

  <a href="https://destinexx.onrender.com/"><b>🚀 Live Demo</b></a>

  <br /><br />

  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Auth-Passport.js-yellow?style=flat-square&logo=passport" />
  <img src="https://img.shields.io/badge/Cloud-Cloudinary-lightblue?style=flat-square&logo=cloudinary" />

</div>

---

## 📌 About the Project

**Destinexx** is a full-stack MERN travel and itinerary platform where users can:

-   Browse listings
-   Upload images
-   Write reviews
-   Build multi-day itineraries
-   Authenticate using Email/Password or Google OAuth

It uses secure session-based authentication, Cloudinary image hosting, and a clean RESTful API backend.

---

## ✨ Features

### 🔐 Authentication & Authorization

-   Email & Password login
-   Google OAuth 2.0
-   Sessions + `connect-mongo`
-   Protected routes
-   Ownership-based authorization

### 🏝️ Travel Listings

-   Create, edit, delete listings
-   Cloudinary file uploads
-   Listing details page

### ⭐ Reviews System

-   Add, edit, delete reviews
-   Linked to users & listings

### 🗓️ Itinerary Builder

-   Create multi-day itineraries
-   Add or remove listing items

---

## 🛠️ Tech Stack

-   **Frontend:** React, React Router, Axios
-   **Backend:** Node.js, Express.js, Passport.js, Multer, Cloudinary
-   **Database:** MongoDB (Mongoose)
-   **Deployment:** Render + MongoDB Atlas

---

## 📂 Project Structure

```text
📦 DestiNEX
├── controllers/    # Business logic
├── frontend/       # React app
├── init/           # DB setup
├── middleware/     # Auth middleware
├── models/         # Mongoose schemas
├── public/         # Static files
├── routes/         # API routes
├── utils/          # Utility functions
├── app.js          # Main server file
└── cloudConfig.js  # Cloudinary config
🧪 REST API Endpoints
🟦 Listings
Method	Route	Description
GET	/api/listings	Get all listings
POST	/api/listings	Create listing
GET	/api/listings/:id	Get single listing
PUT	/api/listings/:id	Update listing
DELETE	/api/listings/:id	Delete listing

Export to Sheets

🟩 Reviews
Method	Route
POST	/api/listings/:id/reviews
PUT	/api/listings/:listingId/reviews/:reviewId
DELETE	/api/listings/:listingId/reviews/:reviewId

Export to Sheets

🟥 Itineraries
Method	Route
POST	/api/itineraries
GET	/api/itineraries
GET	/api/itineraries/:id
PUT	/api/itineraries/:id
DELETE	/api/itineraries/:id

Export to Sheets

⚙️ Installation & Setup
1️⃣ Clone the repository
Bash

git clone [https://github.com/Nuthannaidu/DestiNEX.git](https://github.com/Nuthannaidu/DestiNEX.git)
cd DestiNEX
2️⃣ Install dependencies
Bash

cd backend && npm install
cd ../frontend && npm install
3️⃣ Add environment variables
Create a .env file inside /backend:

Code snippet

MONGO_URI=YOUR_MONGO_ATLAS_URI
SESSION_SECRET=YOUR_SECRET
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
4️⃣ Run the servers
Bash

# Backend
npm run dev
Bash

# Frontend
npm start
📸 Screenshots
(Add images in a /screenshots folder for better presentation)

Plaintext

screenshots/
├── home.png
├── listing.png
├── itinerary.png
└── login.png
🤝 Contributing
Pull requests are welcome! Open an issue to discuss major changes.

⭐ Support
If you found this project helpful, please consider giving it a ⭐ star on GitHub!

👨‍💻 Developer
Nuthannaidu Full-Stack MERN Developer 🔥 Passionate about building real-world web applications
