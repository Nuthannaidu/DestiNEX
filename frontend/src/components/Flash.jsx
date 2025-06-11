import React from 'react';

const FlashMessage = ({ success, error, onClose }) => {
  return (
    <>
      {success && success.length > 0 && (
        <div className="alert alert-success alert-dismissible fade show col-6 offset-3" role="alert">
          {success}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => onClose('success')}
          ></button>
        </div>
      )}
      {error && error.length > 0 && (
        <div className="alert alert-danger alert-dismissible fade show col-6 offset-3" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => onClose('error')}
          ></button>
        </div>
      )}
    </>
  );
};

export default FlashMessage;
