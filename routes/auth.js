// const express = require('express');
// const passport = require('passport');
// const router = express.Router();

// // Start Google OAuth login
// router.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // Google OAuth callback URL
// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     // After success, redirect to frontend with user info (you can also set cookie or token)
//     res.redirect('http://localhost:3000/listings');
//   }
// );

// // Optional: logout route
// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect(process.env.FRONTEND_URL);
// });

// module.exports = router;
