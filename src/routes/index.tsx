import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MapView from '../pages/MapView';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAppSelector((state) => state.user);
  
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { authenticated } = useAppSelector((state) => state.user);

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          authenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapView />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;