import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({route='', children, adminRoute = false, userRoute = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role;
  
  if (!token) {
    toast.error('Please login first');
    return <Navigate to="/auth" replace />;
  }

  if(route=='/blog' && (userRoute || adminRoute))
  {
    return children;
  }

  // Check for admin routes
  if (adminRoute && userRole !== 'admin') {
    toast.error('Unauthorized access - Admin only');
    return <Navigate to="/dashboard" replace />;
  }

  // Check for user routes
  if (userRoute && userRole !== 'user') {
    toast.error('Unauthorized access - Users only');
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;