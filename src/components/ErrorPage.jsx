import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className="error-page-container">
      <div className="error-content">
        <div className="error-header">
          <h1 className="error-404">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-description">
            The page you're looking for doesn't exist.
          </p>
        </div>
        
        <div className="error-actions">
          <Link to="/login" className="error-btn-primary">
            Go to Login
          </Link>
          
          <div className="error-link-container">
            <Link to="/profile" className="error-link-secondary">
              Or go to Profile
            </Link>
          </div>
        </div>
        
        <div className="error-footer">
          <p>Lost? Try one of the links above to get back on track.</p>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;