import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, children }) {
  if (!user) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectedRoute;