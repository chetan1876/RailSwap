import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — guards pages that require authentication.
 *
 * If the user has no valid session (no user object + JWT token in state),
 * they are redirected to /login. The `replace` prop prevents the login page
 * from being pushed onto the history stack, so the Back button works correctly.
 */
const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;