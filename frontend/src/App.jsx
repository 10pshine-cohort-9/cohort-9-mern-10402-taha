import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NoteEditor from './pages/NoteEditor.jsx';

/* ---- Placeholder Pages ---- */
/* These will be replaced with actual page components in future PRs */

function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => navigate('/')}
      style={{ marginBottom: 'var(--space-xl)' }}
    >
      ← Back to Notes
    </button>
  );
}

function ProfilePage() {
  return (
    <div>
      <BackButton />
      <h1>Profile</h1>
      <p style={{ marginTop: 'var(--space-lg)' }}>
        User profile will be implemented in a future PR.
      </p>
    </div>
  );
}

/* ---- App Router ---- */

function App() {
  return (
    <Routes>
      {/* Auth Routes — AuthLayout renders Login/Signup internally */}
      <Route path="/login" element={<AuthLayout />} />
      <Route path="/signup" element={<AuthLayout />} />

      {/* App Routes — uses sidebar/header AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes/new" element={<NoteEditor />} />
        <Route path="/notes/:id/edit" element={<NoteEditor />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
