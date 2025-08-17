import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../utils/jwtUtils';

// Immediate reactive protection: re-validates on token mutation, tab focus, storage events
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(() => isTokenValid(localStorage.getItem('token')));

  useEffect(() => {
    const validate = () => {
      const token = localStorage.getItem('token');
      if (!isTokenValid(token)) {
        if (token) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.log('Token changed/expired -> logging out');
        }
        setIsValid(false);
        navigate('/login', { replace: true });
      } else {
        setIsValid(true);
      }
    };

    // Fast polling (1s) to catch manual devtools edits (they don't fire events)
    const interval = setInterval(validate, 1000);

    // Events for quicker reaction
    window.addEventListener('storage', validate);                // other tabs
    window.addEventListener('focus', validate);                  // returning to tab
    window.addEventListener('local-storage-changed', validate);  // our patched setItem

    // Initial check
    validate();

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', validate);
      window.removeEventListener('focus', validate);
      window.removeEventListener('local-storage-changed', validate);
    };
  }, [navigate]);

  // While redirecting, render nothing
  if (!isValid) return null;

  return children;
}

export default ProtectedRoute;