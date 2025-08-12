import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white opacity-20">404</h1>
          <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-purple-100 mb-8">
            The page you're looking for doesn't exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/login"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-300"
          >
            Go to Login
          </Link>
          
          <div className="block">
            <Link
              to="/profile"
              className="text-white hover:text-purple-200 underline"
            >
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
