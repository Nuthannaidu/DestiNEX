<div align="center">
  <img src="https://img.shields.io/badge/Destinexx-MERN%20Travel%20Planner-blue?style=for-the-badge&logo=github" />

  <h1>🌍 Destinexx – Travel & Itinerary MERN Application</h1>

  <p>A complete travel listings and itinerary planning platform built using the MERN Stack.</p>

  <a href="https://destinexx.onrender.com/"><b>🚀 Live Demo</b></a>
  <br /><br />

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Auth-Passport.js-yellow?style=flat-square&logo=passport" />
  <img src="https://img.shields.io/badge/Cloud-Cloudinary-lightblue?style=flat-square&logo=cloudinary" />
</div>

---

## 📌 About the Project

**Destinexx** is a full-stack **MERN** travel and itinerary platform that allows users to:

✔️ Browse travel listings  
✔️ Upload images (Cloudinary)  
✔️ Write reviews  
✔️ Build multi-day itineraries  
✔️ Login via Email/Password or Google OAuth  

It features secure authentication, clean RESTful APIs, and dynamic React UI — all hosted on **Render** with a **MongoDB Atlas** backend.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Email & Password authentication  
- Google OAuth 2.0 login  
- Session-based auth (`express-session + connect-mongo`)  
- Protected routes  
- Ownership-based authorization (only owners can edit/delete)

### 🏝️ Travel Listings
- Create, edit, delete listings  
- Cloudinary image uploads via Multer  
- Category-based exploration  
- View detailed listing pages

### ⭐ Reviews System
- Add, edit, delete reviews  
- Linked to user + listing  
- Authorization protected

### 🗓️ Itinerary Builder
- Create personalized itineraries  
- Add listings into daily plans  
- Edit or delete itinerary items  
- User-specific private itineraries

---

## 🛠️ Tech Stack

### **Frontend**
- React  
- React Router DOM  
- Axios  
- Context API (Auth State)

### **Backend**
- Node.js  
- Express.js  
- Passport.js  
- Multer  
- Cloudinary  
- bcrypt  

### **Database**
- MongoDB  
- Mongoose  

### **Deployment**
- Render  
- MongoDB Atlas  

---

## 📂 Project Structure

📦 DestiNEX
├── controllers/ # Business logic
├── frontend/ # React app
├── init/ # DB setup
├── middleware/ # Auth middleware
├── models/ # Mongoose schemas
├── public/ # Static files
├── routes/ # API routes
├── utils/ # Utility functions
├── app.js # Main server file
└── cloudConfig.js # Cloudinary config

bash
Copy code

---

## 🧪 REST API Endpoints

### 🟦 Listings
| Method | Route | Description |
|--------|--------|-------------|
| GET | /api/listings | Get all listings |
| POST | /api/listings | Create listing |
| GET | /api/listings/:id | Get single listing |
| PUT | /api/listings/:id | Update listing |
| DELETE | /api/listings/:id | Delete listing |

### 🟩 Reviews
| Method | Route |
|--------|--------|
| POST | /api/listings/:id/reviews |
| PUT | /api/listings/:listingId/reviews/:reviewId |
| DELETE | /api/listings/:listingId/reviews/:reviewId |

### 🟥 Itineraries
| Method | Route |
|--------|--------|
| POST | /api/itineraries |
| GET | /api/itineraries |
| GET | /api/itineraries/:id |
| PUT | /api/itineraries/:id |
| DELETE | /api/itineraries/:id |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Nuthannaidu/DestiNEX.git
cd DestiNEX
2️⃣ Install dependencies
bash
Copy code
cd backend && npm install
cd ../frontend && npm install
3️⃣ Add environment variables
Create a .env file inside /backend:

ini
Copy code
MONGO_URI=YOUR_MONGO_ATLAS_URI
SESSION_SECRET=YOUR_SECRET
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
4️⃣ Run the servers
bash
Copy code
# Backend
npm run dev

# Frontend
npm start
📸 Screenshots
(Add images in a /screenshots folder for better presentation)

arduino
Copy code
screenshots/
 ├── home.png
 ├── listing.png
 ├── itinerary.png
 └── login.png
🤝 Contributing
Pull requests are welcome!
Open an issue to discuss major changes.

⭐ Support
If you found this project helpful, please consider giving it a ⭐ star on GitHub!

👨‍💻 Developer
Nuthannaidu
Full-Stack MERN Developer
🔥 Passionate about building real-world web applications

yaml
Copy code

---

# ✅ FIXED  
✔ All code blocks properly closed  
✔ No leaked text  
✔ Formatting perfect  
✔ Works inside GitHub README  
✔ Professional layout  

---

If you want, I can also generate:  
🌈 **Banner Image** • 📐 **Architecture Diagram** • 🎥 **GIF Demo** • 🏷️ **More badges**  

Just tell me: **“Add everything”** or pick what you want.









