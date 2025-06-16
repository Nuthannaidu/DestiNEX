import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";

// ✅ Force all axios requests to include cookies
axios.defaults.withCredentials = true;

const ReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `https://destinexx.onrender.com/api/listings/${id}/reviews`, // use full URL if needed
        {
          review: {
            rating,
            comment: comment.trim(),
          },
        },
        {
          withCredentials: true, // ✅ ESSENTIAL
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Review submitted:", response.data);
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error("❌ Review submission error:", err);

      if (err.response?.status === 401) {
        setError("You must be logged in to write a review.");
      } else if (err.response?.status === 404) {
        setError("Listing not found.");
      } else {
        setError(err.response?.data?.error || "Failed to submit review. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-5" style={{ maxWidth: 500, width: "100%" }}>
        <h2 className="mb-4 text-primary fw-bold text-center">
          <FaStar className="me-2" />
          Write a Review
        </h2>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-center">
            <label className="form-label fw-medium mb-3">Your Rating</label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="btn p-1"
                  onClick={() => setRating(star)}
                  style={{
                    color: star <= rating ? "#ffc107" : "#e4e5e9",
                    fontSize: 32,
                  }}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <small className="text-muted">
                You rated: {rating} star{rating > 1 ? "s" : ""}
              </small>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">Your Review</label>
            <textarea
              className="form-control"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              minLength={10}
              placeholder="Share your experience with this place..."
            />
            <small className="text-muted">{comment.length}/10 characters minimum</small>
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(`/listings/${id}`)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={loading || rating === 0 || comment.trim().length < 10}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
