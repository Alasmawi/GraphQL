import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundVideo from '../assets/background.mp4';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!identifier || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const credentials = btoa(`${identifier}:${password}`);
      const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid credentials, please try again.');
      }

      const data = await response.json();
      localStorage.setItem('token', data);
      localStorage.setItem('animateFromLogin', 'true');
      
      // Trigger slide-up animation and navigate immediately
      const loginContainer = document.querySelector('.login-form-container');
      if (loginContainer) {
        loginContainer.classList.add('slide-up');
        
        // Navigate immediately so profile appears as login starts leaving
        setTimeout(() => {
          navigate('/profile');
        }, 100); // Small delay to ensure animation starts
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  return (
    <div className="login-page-bg">
      <video 
        className="login-bg-video" 
        autoPlay 
        loop 
        muted 
        playsInline
        src={backgroundVideo}
      >
        Your browser does not support the video tag.
      </video>
      <div className="login-form-container">
        <div className="login-form-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="identifier" className="form-label">Email or Username</label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="form-input"
                placeholder="Enter email or username"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </form>
          
            <div className="login-info-section">
            <p className="login-info-text">Use your Reboot credentials:</p>
             <p className="login-info-subtext">
             Enter your Reboot email or username and password
            </p>
         </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
