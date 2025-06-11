import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ listings }) => {
  return (
    <>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Search Results</h1>
      </header>

      <main className="mb-3 mt-4 d-flex flex-wrap justify-content-center gap-4">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <Link
              to={`/listings/${listing._id}`}
              className="text-decoration-none text-dark"
              key={listing._id}
              style={{ width: '300px' }}
            >
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  height: '500px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={listing.image.url}
                  alt={listing.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '16px' }}>
                  <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>{listing.title}</h2>
                  <p style={{ color: '#555' }}>{listing.description}</p>
                  <p>
                    <strong>Location:</strong> {listing.location}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{listing.price.toLocaleString('en-IN')}/night
                  </p>
                  <p>
                    <strong>Category:</strong> {listing.category}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center">No listings found for this category.</p>
        )}
      </main>
    </>
  );
};

export default SearchResults;
