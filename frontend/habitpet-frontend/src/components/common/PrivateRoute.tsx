import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
