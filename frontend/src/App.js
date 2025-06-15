import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

import ListingsPage from './pages/ListingsPage';
import ShowListing from './pages/showListing';
import NewListing from './pages/newListing';
import EditListing from './pages/editListing';
import Login from './pages/login';
import Signup from './pages/signup';
import ReviewForm from './pages/ReviewForm';
import SearchResults from './pages/SearchResults';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import ItineraryPlanner from "./pages/ItineraryPlanner";
import ItineraryDetail from "./pages/ItineraryDetail";
import ItineraryList from "./pages/ItineraryList";

axios.defaults.withCredentials = true;

const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://destinex-1.onrender.com";

function App() {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);
    axios.get(`${API_BASE}/api/currentUser`)
      .then((res) => {
        if (res.data.user) {
          setCurrUser(res.data.user);
        }
      })
      .catch((err) => {
        console.log("Not logged in:", err.response?.data || err.message);
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
        {/* Optional route to auto-fetch user after Google login redirect */}
        <Route path="/oauth/success" element={<OAuthSuccessHandler setCurrUser={setCurrUser} />} />
      </Routes>

      <Footer />
    </Router>
  );
}

// Optional component if you're using a special redirect route after Google login
function OAuthSuccessHandler({ setCurrUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/currentUser`)
      .then((res) => {
        if (res.data.user) {
          setCurrUser(res.data.user);
          navigate("/listings");
        }
      })
      .catch(() => {
        navigate("/login");
      });
  }, [setCurrUser, navigate]);

  return <p>Logging in...</p>;
}

export default App;
