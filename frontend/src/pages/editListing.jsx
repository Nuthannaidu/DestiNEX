import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    City: "",
    category: "",
    image: null,
    lat: "",
    lng: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Fetch listing and populate form
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`/api/listings/${id}`);
        const { title, description, price, location, country, City, category, lat, lng } = res.data;
        setFormData({
          title,
          description,
          price,
          location,
          country,
          City,
          category,
          image: null,
          lat,
          lng,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch listing", err);
        setErrors({ fetch: "Failed to load listing data" });
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.City.trim()) newErrors.City = "City is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.lat || isNaN(formData.lat)) newErrors.lat = "Valid latitude is required";
    if (!formData.lng || isNaN(formData.lng)) newErrors.lng = "Valid longitude is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const data = new FormData();
    for (let key in formData) {
      if (key === "image" && formData.image) {
        data.append(`listing[${key}]`, formData[key]);
      } else {
        data.append(`listing[${key}]`, formData[key]);
      }
    }

    try {
      setIsLoading(true);
      await axios.put(`/api/listings/${id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error("Failed to update listing", err);
      setErrors({ submit: "Failed to update listing. Please try again." });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading listing data...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {/* Header Section */}
            <div className="text-center mb-5">
              <h1 className="display-6 fw-bold text-dark mb-2">Edit Property Listing</h1>
              <p className="lead text-muted">Update your property information and details</p>
              <div className="mx-auto" style={{ width: "60px", height: "4px", backgroundColor: "#0d6efd", borderRadius: "2px" }}></div>
            </div>

            {/* Main Form Card */}
            <div className="card border-0 shadow-lg">
              <div className="card-header bg-gradient" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <div className="d-flex align-items-center justify-content-between text-white p-2">
                  <div>
                    <h4 className="mb-0 fw-semibold">Property Details</h4>
                    <small className="opacity-75">ID: {id}</small>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-circle p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                {errors.fetch && (
                  <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {errors.fetch}
                  </div>
                )}

                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    <strong>Update Failed:</strong> {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Basic Information Section */}
                  <div className="mb-5">
                    <h5 className="fw-semibold text-dark mb-3 pb-2 border-bottom">
                      <span className="badge bg-primary me-2">1</span>
                      Basic Information
                    </h5>
                    
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-medium text-dark">
                          Property Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter property title"
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-medium text-dark">
                          Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                          name="description"
                          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your property in detail"
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          Price <span className="text-danger">*</span>
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light">$</span>
                          <input
                            type="number"
                            name="price"
                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          name="category"
                          className={`form-select form-select-lg ${errors.category ? 'is-invalid' : ''}`}
                          value={formData.category}
                          onChange={handleChange}
                        >
                          <option value="">Select a category</option>
                          <option value="hills">🏔️ Hills</option>
                          <option value="beaches">🏖️ Beaches</option>
                          <option value="city">🏙️ City</option>
                          <option value="desert">🏜️ Desert</option>
                          <option value="forest">🌲 Forest</option>
                          <option value="snowy">❄️ Snowy</option>
                        </select>
                        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="mb-5">
                    <h5 className="fw-semibold text-dark mb-3 pb-2 border-bottom">
                      <span className="badge bg-success me-2">2</span>
                      Location Details
                    </h5>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          Location/Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          className={`form-control form-control-lg ${errors.location ? 'is-invalid' : ''}`}
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Street address or area"
                        />
                        {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          City <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="City"
                          className={`form-control form-control-lg ${errors.City ? 'is-invalid' : ''}`}
                          value={formData.City}
                          onChange={handleChange}
                          placeholder="City name"
                        />
                        {errors.City && <div className="invalid-feedback">{errors.City}</div>}
                      </div>

                      <div className="col-md-12">
                        <label className="form-label fw-medium text-dark">
                          Country <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="country"
                          className={`form-control form-control-lg ${errors.country ? 'is-invalid' : ''}`}
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Country name"
                        />
                        {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Coordinates Section */}
                  <div className="mb-5">
                    <h5 className="fw-semibold text-dark mb-3 pb-2 border-bottom">
                      <span className="badge bg-info me-2">3</span>
                      Geographic Coordinates
                    </h5>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          Latitude <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          name="lat"
                          className={`form-control form-control-lg ${errors.lat ? 'is-invalid' : ''}`}
                          value={formData.lat}
                          onChange={handleChange}
                          step="any"
                          placeholder="e.g., 40.7128"
                        />
                        {errors.lat && <div className="invalid-feedback">{errors.lat}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-medium text-dark">
                          Longitude <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          name="lng"
                          className={`form-control form-control-lg ${errors.lng ? 'is-invalid' : ''}`}
                          value={formData.lng}
                          onChange={handleChange}
                          step="any"
                          placeholder="e.g., -74.0060"
                        />
                        {errors.lng && <div className="invalid-feedback">{errors.lng}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="mb-5">
                    <h5 className="fw-semibold text-dark mb-3 pb-2 border-bottom">
                      <span className="badge bg-warning me-2">4</span>
                      Property Image
                    </h5>
                    
                    <div className="row">
                      <div className="col-12">
                        <label className="form-label fw-medium text-dark">
                          Upload New Image (Optional)
                        </label>
                        <input
                          type="file"
                          name="image"
                          className="form-control form-control-lg"
                          onChange={handleChange}
                          accept="image/*"
                        />
                        <div className="form-text">
                          Leave empty to keep the current image. Supported formats: JPG, PNG, GIF (Max 5MB)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg py-3 fw-semibold"
                      disabled={isLoading}
                      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none" }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating Listing...
                        </>
                      ) : (
                        <>
                          <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Update Property Listing
                        </>
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-lg py-3"
                      onClick={() => navigate(`/listings/${id}`)}
                      disabled={isLoading}
                    >
                      Cancel Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-4">
              <small className="text-muted">
                <span className="text-danger">*</span> Required fields must be completed
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListing;