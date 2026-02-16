import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(({ auth }) => auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="protected-route-spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
