import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaHome, 
  FaFileAlt, 
  FaImage, 
  FaRupeeSign, 
  FaMapMarkerAlt, 
  FaGlobe, 
  FaTags, 
  FaCity,
  FaCloudUploadAlt 
} from 'react-icons/fa';

const NewListingForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    price: '',
    country: '',
    location: '',
    category: '',
    City: '',
  });

  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, image: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Geocode location using OpenStreetMap Nominatim
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.location
        )}`
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        toast.error('Location not found');
        setIsSubmitting(false);
        return;
      }

      const lat = geoData[0].lat;
      const lng = geoData[0].lon;

      // Step 2: Build FormData for multipart/form-data POST request
      const data = new FormData();
      for (const key in formData) {
        if (key === 'image' && formData[key]) {
          data.append('listing[image]', formData.image);
        } else {
          data.append(`listing[${key}]`, formData[key]);
        }
      }
      data.append('listing[lat]', lat);
      data.append('listing[lng]', lng);

      // Step 3: POST to your backend API
      const res = await fetch('/api/listings', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (res.ok) {
        const created = await res.json();
        toast.success('Listing created successfully!');
        setTimeout(() => navigate(`/listings/${created._id}`), 2000);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create listing');
      }
    } catch (err) {
      console.error('Form submit error:', err);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'hills', label: '🏔️ Hills', description: 'Mountain and hill stations' },
    { value: 'beaches', label: '🏖️ Beaches', description: 'Coastal destinations' },
    { value: 'desert', label: '🏜️ Desert', description: 'Desert landscapes' },
    { value: 'forest', label: '🌲 Forest', description: 'Forest retreats' },
    { value: 'city', label: '🏙️ City', description: 'Urban experiences' },
    { value: 'snowy', label: '❄️ Snowy', description: 'Winter wonderlands' },
  ];

  return (
    <div className="container mt-4 mb-5">
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          {/* Header Section */}
          <div className="text-center mb-4">
            <div className="mb-3">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                   style={{width: '80px', height: '80px'}}>
                <FaHome className="text-white" size={35} />
              </div>
            </div>
            <h2 className="fw-bold text-dark mb-2">Create New Listing</h2>
            <p className="text-muted">Share your amazing place with travelers around the world</p>
          </div>

          <div className="card shadow-lg border-0 overflow-hidden">
            <div className="card-header text-white text-center py-4" 
                 style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <h4 className="mb-0 fw-bold">Listing Details</h4>
              <small className="opacity-75">Fill in the information below</small>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
                {/* Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-bold d-flex align-items-center">
                    <FaHome className="me-2 text-primary" />
                    Property Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control form-control-lg border-2"
                    placeholder="e.g., Cozy Mountain Cabin with Stunning Views"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text">Make it catchy and descriptive</div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold d-flex align-items-center">
                    <FaFileAlt className="me-2 text-primary" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="5"
                    className="form-control border-2"
                    placeholder="Describe your property, amenities, nearby attractions, and what makes it special..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="form-text">Tell guests what makes your place unique</div>
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-bold d-flex align-items-center">
                    <FaImage className="me-2 text-primary" />
                    Property Image
                  </label>
                  <div className="position-relative">
                    <input
                      type="file"
                      name="image"
                      className="form-control border-2"
                      onChange={handleChange}
                      accept="image/*"
                      required
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                      <FaCloudUploadAlt className="text-muted" />
                    </div>
                  </div>
                  
                  {preview && (
                    <div className="mt-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaImage className="me-2 text-success" />
                        <span className="fw-bold text-success">Image Preview</span>
                      </div>
                      <div className="text-center">
                        <img
                          src={preview}
                          alt="Preview"
                          className="img-fluid rounded-3 shadow-sm"
                          style={{ maxHeight: '250px', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="form-text">Upload a high-quality image that showcases your property</div>
                </div>

                {/* Price and City Row */}
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label htmlFor="price" className="form-label fw-bold d-flex align-items-center">
                      <FaRupeeSign className="me-2 text-primary" />
                      Price per night
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-2">₹</span>
                      <input
                        type="number"
                        name="price"
                        className="form-control border-2"
                        placeholder="2000"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <label htmlFor="City" className="form-label fw-bold d-flex align-items-center">
                      <FaCity className="me-2 text-primary" />
                      City
                    </label>
                    <input
                      type="text"
                      name="City"
                      className="form-control border-2"
                      placeholder="e.g., Mumbai, Delhi, Bangalore"
                      value={formData.City}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Location and Country Row */}
                <div className="row g-3 mb-4">
                  <div className="col-md-8">
                    <label htmlFor="location" className="form-label fw-bold d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      Detailed Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      className="form-control border-2"
                      placeholder="e.g., Marine Drive, Mumbai, Maharashtra"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                    <div className="form-text">Include area, landmarks, or full address</div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="country" className="form-label fw-bold d-flex align-items-center">
                      <FaGlobe className="me-2 text-primary" />
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      className="form-control border-2"
                      placeholder="India"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label htmlFor="category" className="form-label fw-bold d-flex align-items-center">
                    <FaTags className="me-2 text-primary" />
                    Property Category
                  </label>
                  <select
                    name="category"
                    className="form-select form-select-lg border-2"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Choose the best category for your property
                    </option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                  <div className="form-text">This helps travelers find your property more easily</div>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg py-3 fw-bold"
                    disabled={isSubmitting}
                    style={{
                      background: isSubmitting ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <FaHome className="me-2" />
                        Create Listing
                      </>
                    )}
                  </button>
                </div>

                {/* Help Text */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    By creating a listing, you agree to our terms of service and privacy policy.
                  </small>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="card border-0 bg-light mt-4">
            <div className="card-body text-center p-4">
              <h6 className="text-primary fw-bold mb-2">💡 Pro Tips</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <small className="text-muted">
                    <strong>Great Photos:</strong> Use high-quality, well-lit images
                  </small>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">
                    <strong>Detailed Description:</strong> Mention unique features and amenities
                  </small>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">
                    <strong>Accurate Location:</strong> Help guests find you easily
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewListingForm;