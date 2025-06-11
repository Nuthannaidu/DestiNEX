import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ItineraryList = () => {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    axios
      .get("/api/itineraries", { withCredentials: true })
      .then((res) => setItineraries(res.data))
      .catch(console.error);
  }, []);

  if (!itineraries.length) {
    return <p className="text-center mt-5">No itineraries found.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>My Itineraries</h2>
      <div className="row">
        {itineraries.map((it) => (
          <div key={it._id} className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{it.title}</h5>
                <p className="card-text">
                  <strong>From:</strong> {new Date(it.startDate).toLocaleDateString()}<br />
                  <strong>To:</strong> {new Date(it.endDate).toLocaleDateString()}
                </p>
                <p className="card-text">
                  <strong>Status:</strong>{" "}
                  {it.isPublic ? (
                    <span className="badge bg-success">Public</span>
                  ) : (
                    <span className="badge bg-secondary">Private</span>
                  )}
                </p>
                <Link to={`/itineraries/${it._id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryList;
