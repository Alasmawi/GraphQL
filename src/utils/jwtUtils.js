/**
 * JWT Utility Functions
 * Handles JWT token decoding, validation, and expiration checking
 */

/**
 * Decodes a JWT token payload without verification
 * @param {string} token - The JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (base64url)
    const payload = parts[1];
    
    // Add padding if needed for proper base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode from base64url to base64, then parse JSON
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param {string} token - The JWT token
 * @returns {boolean} - True if expired, false if valid
 */
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  // Convert exp from seconds to milliseconds and compare with current time
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  
  return currentTime >= expirationTime;
};

/**
 * Gets the expiration date from a JWT token
 * @param {string} token - The JWT token
 * @returns {Date|null} - Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return null;
  
  return new Date(payload.exp * 1000);
};

/**
 * Gets the time remaining until token expiration
 * @param {string} token - The JWT token
 * @returns {number|null} - Milliseconds until expiration, null if invalid/expired
 */
export const getTimeUntilExpiration = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return null;
  
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const timeRemaining = expirationTime - currentTime;
  
  return timeRemaining > 0 ? timeRemaining : null;
};

/**
 * Validates if a token exists and is not expired
 * @param {string} token - The JWT token
 * @returns {boolean} - True if token is valid and not expired
 */
export const isTokenValid = (token) => {
  return token && !isTokenExpired(token);
};

/**
 * Removes expired token from localStorage and redirects to login
 * @param {function} navigate - React Router navigate function
 */
export const handleExpiredToken = (navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Token expired, redirecting to login');
  if (navigate) {
    navigate('/login');
  } else {
    window.location.href = '/login';
  }
};
