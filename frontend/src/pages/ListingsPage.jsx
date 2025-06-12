import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "./ListingsPage.css";
const baseURL = process.env.REACT_APP_API_BASE_URL;

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    console.log("📡 Fetching from:", `${process.env.REACT_APP_API_BASE_URL}/api/listings`);
    const fetchListings = async () => {
      setLoading(true);
      try {
        let res;
       if (category) {
        res = await axios.get(`${baseURL}/api/listings/search?category=${category}`, { withCredentials: true });
      } else if (searchQuery) {
        res = await axios.get(`${baseURL}/api/listings/search?search=${searchQuery}`, { withCredentials: true });
      } else {
        res = await axios.get(`${baseURL}/api/listings`, { withCredentials: true });
      }
        let sortedListings = res.data;

        if (sortBy === "price-low") {
          sortedListings = [...sortedListings].sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
          sortedListings = [...sortedListings].sort((a, b) => b.price - a.price);
        } else if (sortBy === "name") {
          sortedListings = [...sortedListings].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === "rating") {
          sortedListings = [...sortedListings].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        }

        setListings(sortedListings);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category, searchQuery, sortBy]);

  const clearFilters = () => {
    setSortBy("default");
    navigate("/listings");
  };

  const getPageTitle = () => {
    if (category) return `${category} Destinations`;
    if (searchQuery) return `Search Results`;
    return "Discover Amazing Destinations";
  };

  const getPageSubtitle = () => {
    if (category) return `Explore the best ${category.toLowerCase()} experiences`;
    if (searchQuery) return `Results for "${searchQuery}"`;
    return "Find your next adventure from our curated collection";
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="page-header">
          <h1 className="page-title">Loading...</h1>
          <p className="page-subtitle">Discovering amazing destinations for you</p>
        </div>
        <div className="row g-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card listing-card skeleton-card h-100">
                <div className="skeleton-image"></div>
                <div className="card-body">
                  <div className="skeleton-text skeleton-title"></div>
                  <div className="skeleton-text skeleton-price"></div>
                  <div className="skeleton-text skeleton-location"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="listings-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="header-content text-center">
            <h1 className="page-title">{getPageTitle()}</h1>
            <p className="page-subtitle">{getPageSubtitle()}</p>
          </div>
        </div>
      </div>

      {/* Sort Dropdown (outside banner) */}
      <div className="container mb-4 d-flex justify-content-end align-items-center">
        <div className="d-flex gap-2 align-items-center">
          <label htmlFor="sortSelect" className="me-2 mb-0 text-muted">Sort By:</label>
          <select
            id="sortSelect"
            className="form-select w-auto shadow-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="rating">Highest Rated</option>
          </select>
          {sortBy !== "default" && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={clearFilters}
              title="Clear sort"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="container">
        {Array.isArray(listings) && listings.length > 0 ? (
          <>
            <div className="results-info d-flex justify-content-between align-items-center mb-3">
              <span className="results-count">
                <strong>{listings.length}</strong> destination{listings.length !== 1 ? "s" : ""} found
              </span>
            </div>

            <div className="row g-4 listings-grid">
              {listings.map((listing, index) => (
                <div
                  key={listing._id}
                  className="col-lg-3 col-md-4 col-sm-6"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link to={`/listings/${listing._id}`} className="listing-card-link">
                    <div className="card listing-card h-100">
                      <div className="image-container">
                        <img
                          src={listing.image?.url}
                          className="card-img-top listing-image"
                          alt={listing.title}
                          loading="lazy"
                        />
                        <div className="image-overlay">
                          <div className="overlay-content">
                            <i className="fas fa-eye"></i>
                            <span>View Details</span>
                          </div>
                        </div>
                        <div className="price-badge">
                          ₹{Number(listing.price).toLocaleString("en-IN")}
                        </div>
                        {listing.featured && (
                          <div className="featured-badge">
                            <i className="fas fa-star"></i>
                            Featured
                          </div>
                        )}
                      </div>

                      <div className="card-body">
                        <div className="listing-header">
                          <h5 className="card-title">{listing.title}</h5>
                          <div className="rating">
                            <i className="fas fa-star"></i>
                            <span>{listing.rating || "4.5"}</span>
                          </div>
                        </div>

                        <div className="location-info">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{listing.location}, {listing.country}</span>
                        </div>

                        {listing.category && (
                          <div className="category-tag">
                            <i className="fas fa-tag"></i>
                            {listing.category}
                          </div>
                        )}

                        <div className="card-footer-info">
                          <div className="price-per-night">
                            <span className="price-label">Starting from</span>
                            <span className="price-value">
                              ₹{Number(listing.price).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="action-hint">
                            <i className="fas fa-arrow-right"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Optional Load More Button */}
            {listings.length >= 12 && (
              <div className="text-center mt-5">
                <button className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-plus me-2"></i>
                  Load More Destinations
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-results text-center py-5">
            <i className="fas fa-map-marked-alt fa-2x mb-3"></i>
            <h3>No destinations found</h3>
            <p>No destinations are currently available</p>
            <Link to="/listings/new" className="btn btn-primary mt-3">
              <i className="fas fa-plus me-2"></i>
              Add New Destination
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListingsPage;
