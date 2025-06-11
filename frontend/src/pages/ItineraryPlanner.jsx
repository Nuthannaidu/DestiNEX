import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ItineraryPlanner = ({ currUser }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("2024-06-01");
  const [endDate, setEndDate] = useState("2024-06-03");
  const [days, setDays] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/listings");
        setListings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load destinations. Please try again.');
        // Demo data fallback
        setListings([
          { _id: '1', title: 'Red Fort Delhi', City: 'Delhi', image: { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400' }},
          { _id: '2', title: 'Gateway of India', City: 'Mumbai', image: { url: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400' }},
          { _id: '3', title: 'Hawa Mahal', City: 'Jaipur', image: { url: 'https://images.unsplash.com/photo-1599661046827-dacde1af51b1?w=400' }}
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    if (new Date(startDate) > new Date(endDate)) {
      setEndDate(startDate);
    }
    const d = [];
    for (
      let dt = new Date(startDate);
      dt <= new Date(endDate);
      dt.setDate(dt.getDate() + 1)
    ) {
      d.push({ date: new Date(dt), activities: [] });
    }
    setDays(d);
  }, [startDate, endDate]);

  useEffect(() => {
    const regex = new RegExp(cityInput, "i");
    const filtered = listings.filter((l) => regex.test(l.City));
    setFilteredListings(filtered);
  }, [cityInput, listings]);

  const addActivity = (dayIndex, listing) => {
    const newDays = [...days];
    // Avoid duplicates on the same day
    const alreadyAdded = newDays[dayIndex].activities.some(a => a.listing._id === listing._id);
    if (alreadyAdded) return;
    newDays[dayIndex].activities.push({ listing, note: "" });
    setDays(newDays);
  };

  const updateNote = (dayIndex, actIndex, value) => {
    const newDays = [...days];
    newDays[dayIndex].activities[actIndex].note = value;
    setDays(newDays);
  };

  const removeActivity = (dayIndex, actIndex) => {
    const newDays = [...days];
    newDays[dayIndex].activities.splice(actIndex, 1);
    setDays(newDays);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }
    
    const payload = {
      title,
      startDate,
      endDate,
      days: days.map((d) => ({
        date: d.date,
        activities: d.activities.map((a) => ({
          listing: a.listing._id,
          note: a.note,
        })),
      })),
      isPublic,
    };
    
    try {
      const res = await axios.post("/api/itineraries", payload, { withCredentials: true });
     navigate(`/itineraries/${res.data._id}`);
    } catch (err) {
      console.error('Error saving itinerary:', err);
      alert("Failed to save itinerary. Please try again.");
    }
  };

  const handleDragStart = (e, dayIndex, actIndex) => {
    setDraggedItem({ dayIndex, actIndex });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetDayIndex) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const newDays = [...days];
    const [movedActivity] = newDays[draggedItem.dayIndex].activities.splice(draggedItem.actIndex, 1);
    newDays[targetDayIndex].activities.push(movedActivity);
    setDays(newDays);
    setDraggedItem(null);
  };

  // Helper: Find which days a listing has been added to
  const getAddedDays = (listingId) => {
    return days.reduce((acc, day, idx) => {
      if (day.activities.some(a => a.listing._id === listingId)) acc.push(idx + 1);
      return acc;
    }, []);
  };

  if (!currUser) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="display-1 text-primary mb-4">🧳</div>
          <h2 className="h4 text-muted mb-3">Please log in to start planning your journey</h2>
          <button className="btn btn-primary btn-lg px-4">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header Section */}
      <div className="bg-primary text-white py-5 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">Create Your Perfect Itinerary</h1>
              <p className="lead mb-0">Plan your dream vacation with our professional itinerary builder</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="bg-white bg-opacity-10 rounded-3 p-3 d-inline-block">
                <i className="fas fa-map-marked-alt fa-3x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {/* Itinerary Form */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom-0 py-4">
                <h3 className="card-title h4 mb-0 text-primary">
                  <i className="fas fa-edit me-2"></i>Itinerary Details
                </h3>
              </div>
              <div className="card-body p-4">
                <div>
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark">
                        <i className="fas fa-tag me-2 text-primary"></i>Itinerary Title
                      </label>
                      <input
                        className="form-control form-control-lg border-2"
                        placeholder="Enter your trip title (e.g., Golden Triangle Adventure)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="fas fa-calendar-alt me-2 text-success"></i>Start Date
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-lg border-2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="fas fa-calendar-check me-2 text-danger"></i>End Date
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-lg border-2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark">
                        <i className="fas fa-search-location me-2 text-warning"></i>Filter Destinations by City
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg border-2"
                        placeholder="Search destinations by city (e.g., Delhi, Mumbai, Jaipur)"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark">
                        <i className="fas fa-eye me-2"></i>Visibility
                      </label>
                      <select
                        className="form-select form-select-lg border-2"
                        value={isPublic}
                        onChange={(e) => setIsPublic(e.target.value === "true")}
                      >
                        <option value="false">Private</option>
                        <option value="true">Public</option>
                      </select>
                    </div>
                    
                    <div className="col-12 text-end">
                      <button
                        className="btn btn-primary btn-lg px-5"
                        onClick={handleSubmit}
                        disabled={!title.trim()}
                      >
                        Save Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destinations and Days */}
        <div className="row">
          {/* Left Panel: Available Destinations */}
          <div className="col-md-5 mb-4">
            <h4 className="mb-3">Available Destinations</h4>
            <div
              style={{
                maxHeight: "600px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "white",
              }}
            >
              {loading ? (
                <div className="text-center py-5">Loading destinations...</div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : filteredListings.length === 0 ? (
                <div className="text-center py-5">No destinations found.</div>
              ) : (
                filteredListings.map((listing) => {
                  const addedDays = getAddedDays(listing._id);
                  const isAddedToday = addedDays.length > 0;

                  return (
                    <div
                      key={listing._id}
                      className="d-flex align-items-center mb-3 p-2 border rounded"
                      style={{ backgroundColor: isAddedToday ? "#e6f7ff" : "white" }}
                    >
                      <img
                        src={listing.image.url}
                        alt={listing.title}
                        style={{ width: "70px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{listing.title}</div>
                        <small className="text-muted">{listing.City}</small>
                        {isAddedToday && (
                          <div className="mt-1">
                            {addedDays.map((d) => (
                              <span
                                key={d}
                                className="badge bg-success me-1"
                                title={`Added to Day ${d}`}
                              >
                                Day {d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        {isAddedToday ? (
                          <button className="btn btn-sm btn-outline-success" disabled>
                            Added
                          </button>
                        ) : (
                          // By default add to Day 1 for demo, can extend to select day
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => addActivity(0, listing)}
                          >
                            Add to Day 1
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Days and Activities */}
          <div className="col-md-7">
            <h4 className="mb-3">Your Itinerary</h4>
            {days.length === 0 && (
              <div className="alert alert-info">Please select start and end dates.</div>
            )}
            {days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="mb-4 p-3 border rounded bg-white"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, dayIndex)}
              >
                <h5>
                  Day {dayIndex + 1} -{" "}
                  {day.date.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h5>
                {day.activities.length === 0 ? (
                  <p className="text-muted fst-italic">No activities added yet.</p>
                ) : (
                  day.activities.map((activity, actIndex) => (
                    <div
                      key={actIndex}
                      draggable
                      onDragStart={(e) => handleDragStart(e, dayIndex, actIndex)}
                      className="d-flex align-items-center mb-2 border rounded p-2"
                      style={{ backgroundColor: "#f8f9fa", cursor: "grab" }}
                    >
                      <img
                        src={activity.listing.image.url}
                        alt={activity.listing.title}
                        style={{ width: "50px", height: "40px", objectFit: "cover", borderRadius: "5px" }}
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        <strong>{activity.listing.title}</strong>
                        <textarea
                          placeholder="Add your notes here..."
                          className="form-control form-control-sm mt-1"
                          style={{ resize: "vertical", minHeight: "40px" }}
                          value={activity.note}
                          onChange={(e) => updateNote(dayIndex, actIndex, e.target.value)}
                        />
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={() => removeActivity(dayIndex, actIndex)}
                        title="Remove activity"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlanner;
