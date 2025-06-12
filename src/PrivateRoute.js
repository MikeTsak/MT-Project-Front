// src/PrivateRoute.js
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('🚫 Δεν υπάρχει token, ανακατεύθυνση στη σύνδεση...');
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;
