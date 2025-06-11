import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar, FaMapMarkerAlt, FaUser, FaEdit, FaTrash, FaRupeeSign, FaHeart, FaShare } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ShowListing = ({ curruser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Failed to fetch listing:", err);
      }
    };
    fetchListing();
  }, [id]);

  const isOwner = curruser && listing?.owner && curruser._id === listing.owner._id;

  const handleDeleteListing = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`/api/listings/${id}`);
      navigate("/listings");
    } catch (err) {
      console.error("Failed to delete listing:", err);
    }
  };
const handleDeleteReview = async (reviewId) => {
  const confirm = window.confirm("Are you sure you want to delete this review?");
  if (!confirm) return;

  try {
    await axios.delete(`/api/listings/${id}/reviews/${reviewId}`);
    // Refresh listing to remove deleted review
    const res = await axios.get(`/api/listings/${id}`);
    setListing(res.data);
  } catch (err) {
    console.error("Failed to delete review:", err);
    alert("Could not delete the review.");
  }
};

  if (!listing) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <h5>Loading listing...</h5>
        </div>
      </div>
    );
  }

  const avgRating = listing.reviews.length
    ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
    : 0;

  return (
    <div className="container-fluid py-4 bg-light">
      <div className="row justify-content-center">
        <div className="col-xl-10">
          {/* Header image */}
          <div className="card border-0 shadow mb-4">
            <div className="position-relative">
              <img
                src={listing.image?.url}
                alt="Listing"
                className="img-fluid w-100"
                style={{ height: "400px", objectFit: "cover" }}
              />
              <div className="position-absolute bottom-0 start-0 p-4 text-white bg-dark bg-opacity-50 w-100">
                <h2 className="fw-bold">{listing.title}</h2>
                <p className="mb-1">
                  <FaMapMarkerAlt className="me-2" />
                  {listing.location}, {listing.country}
                </p>
                <p className="mb-0">
                  <FaStar className="text-warning me-1" />
                  {avgRating.toFixed(1)} ({listing.reviews.length} reviews)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="position-absolute top-0 end-0 p-3">
                <button className="btn btn-outline-light me-2 rounded-circle">
                  <FaHeart />
                </button>
                <button className="btn btn-outline-light rounded-circle">
                  <FaShare />
                </button>
              </div>

              {/* Price Badge */}
              <div className="position-absolute bottom-0 end-0 m-3">
                <span className="badge bg-success fs-5 px-3 py-2 rounded-pill">
                  <FaRupeeSign className="me-1" />
                  {listing.price?.toLocaleString("en-IN")}/night
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold">About this place</h5>
              <p>{listing.description}</p>

              <div className="my-3">
                <span className="badge bg-primary me-2">{listing.category}</span>
              </div>

              <hr />
              <div className="d-flex align-items-center mb-3">
                <FaUser className="me-2" />
                <strong>Hosted by {listing.owner?.username}</strong>
              </div>

              {isOwner && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate(`/listings/${id}/edit`)}
                  >
                    <FaEdit className="me-1" /> Edit
                  </button>
                  <button className="btn btn-outline-danger" onClick={handleDeleteListing}>
                    <FaTrash className="me-1" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          {listing.lat && listing.lng && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  <FaMapMarkerAlt className="me-2" />
                  Where you'll stay
                </h5>
                <MapContainer
                  center={[listing.lat, listing.lng]}
                  zoom={13}
                  style={{ height: "300px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[listing.lat, listing.lng]}>
                    <Popup>
                      <strong>{listing.title}</strong><br />
                      {listing.location}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h4 className="fw-bold mb-4">
                <FaStar className="text-warning me-2" />
                Reviews
              </h4>
          {listing.reviews.length ? (
  listing.reviews.map((review) => (
    <div key={review._id} className="mb-4 border-bottom pb-3">
      <div className="d-flex align-items-start justify-content-between">
        {/* Left: Avatar & Info */}
        <div className="d-flex">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{ width: "50px", height: "50px" }}
          >
            <FaUser size={20} />
          </div>
          <div>
            <h6 className="mb-0 fw-bold">@{review.author?.username || "Anonymous"}</h6>
            <small className="text-muted">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recently"}
            </small>
          </div>
        </div>

        {/* Right: Rating */}
       <div className="d-flex align-items-center gap-2">
  <span className="badge bg-warning text-dark">
    <FaStar className="me-1" />
    {review.rating}
  </span>

  {curruser && review.author?._id === curruser._id && (
    <button
      className="btn btn-sm btn-outline-danger ms-2"
      onClick={() => handleDeleteReview(review._id)}
    >
      <FaTrash className="me-1" />
      Delete
    </button>
  )}
</div>

      </div>

      {/* Comment */}
      <p className="mt-2 text-muted">{review.comment}</p>
    </div>
  ))
) : (
  <p className="text-muted">No reviews yet. Be the first to review! If not login,Login first!</p>
)}

              {curruser && (
  <button
    className="btn btn-outline-primary mt-3 rounded-pill"
    onClick={() => navigate(`/listings/${id}/review`)}
  >
    <FaStar className="me-2" />
    Write a Review
  </button>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowListing;
