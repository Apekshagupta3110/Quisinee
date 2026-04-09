import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function ProtectedRoute({ children }) {
  const auth = useStore((s) => s.auth);
  if (auth.role !== 'Admin') {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}
