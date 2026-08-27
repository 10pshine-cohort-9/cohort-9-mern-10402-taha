import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NoteEditor from './pages/NoteEditor.jsx';
import Profile from './pages/Profile.jsx';
import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

/* ---- App Router ---- */

function App() {
  return (
    <Routes>
      {/* Auth Routes — AuthLayout renders Login/Signup internally */}
      <Route path="/login" element={<PublicRoute><AuthLayout /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><AuthLayout /></PublicRoute>} />

      {/* App Routes — uses sidebar/header AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes/new" element={<NoteEditor />} />
          <Route path="/notes/:id/edit" element={<NoteEditor />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
