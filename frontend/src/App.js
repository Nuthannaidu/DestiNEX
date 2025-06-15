import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import ListingsPage from './pages/ListingsPage';
import ShowListing from './pages/showListing';
import NewListing from './pages/newListing';
import EditListing from './pages/editListing';
import Login from './pages/login';
import Signup from './pages/signup';
import ReviewForm from './pages/ReviewForm';
import SearchResults from './pages/SearchResults';
import ItineraryPlanner from './pages/ItineraryPlanner';
import ItineraryDetail from './pages/ItineraryDetail';
import ItineraryList from './pages/ItineraryList';

// Components
import Navbar from './components/navbar';
import Footer from './components/Footer';

// Enable cookies in Axios
axios.defaults.withCredentials = true;

// Use env variable or fallback to production URL
const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://destinex.onrender.com";

function App() {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    // Fetch the current user from the backend (session-based)
    axios.get(`${API_BASE}/api/currentUser`)
      .then((res) => {
        if (res.data.user) {
          setCurrUser(res.data.user);
        }
      })
      .catch((err) => {
        console.log("User not logged in:", err?.response?.data || err.message);
      });
  }, []);

  return (
    <Router>
      <Navbar currUser={currUser} setCurrUser={setCurrUser} />

      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/new" element={<NewListing />} />
        <Route path="/listings/:id" element={<ShowListing curruser={currUser} />} />
        <Route path="/listings/:id/edit" element={<EditListing />} />
        <Route path="/listings/:id/review" element={<ReviewForm />} />
        <Route path="/listings/:id/reviews/new" element={<ReviewForm />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login setCurrUser={setCurrUser} />} />
        <Route path="/signup" element={<Signup setCurrUser={setCurrUser} />} />
        <Route path="/itinerary/new" element={<ItineraryPlanner currUser={currUser} />} />
        <Route path="/itineraries/:id" element={<ItineraryDetail />} />
        <Route path="/itineraries" element={<ItineraryList />} />

        {/* Google OAuth callback route */}
        <Route path="/oauth/success" element={<OAuthSuccessHandler setCurrUser={setCurrUser} />} />
      </Routes>

      <Footer />
    </Router>
  );
}

// Google OAuth callback handler
function OAuthSuccessHandler({ setCurrUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/currentUser`)
      .then((res) => {
        if (res.data.user) {
          setCurrUser(res.data.user);
          navigate("/listings");
        } else {
          navigate("/login");
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, [setCurrUser, navigate]);

  return <p>Logging in...</p>;
}

export default App;
