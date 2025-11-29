import { Navigate } from 'react-router-dom';
import { getCurrentUser, isFinalMatchActive } from '../utils';

const ProtectedRoute = ({ children, allowFinal = false }) => {
  const user = getCurrentUser();
  const finalActive = isFinalMatchActive();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (finalActive && !allowFinal) {
    return <Navigate to="/final" replace />;
  }

  return children;
};

export default ProtectedRoute;
