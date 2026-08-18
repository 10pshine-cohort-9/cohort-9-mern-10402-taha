import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

/* ---- Placeholder Pages ---- */
/* These will be replaced with actual page components in future PRs */

function DashboardPage() {
  return (
    <div>
      <h1>All Notes</h1>
      <p style={{ marginTop: 'var(--space-lg)' }}>
        Dashboard with note cards will be implemented in a future PR.
      </p>
    </div>
  );
}

function NewNotePage() {
  return (
    <div>
      <h1>New Note</h1>
      <p style={{ marginTop: 'var(--space-lg)' }}>
        Note editor will be implemented in a future PR.
      </p>
    </div>
  );
}

function EditNotePage() {
  return (
    <div>
      <h1>Edit Note</h1>
      <p style={{ marginTop: 'var(--space-lg)' }}>
        Note editor will be implemented in a future PR.
      </p>
    </div>
  );
}

function ProfilePage() {
  return (
    <div>
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
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/notes/new" element={<NewNotePage />} />
        <Route path="/notes/:id/edit" element={<EditNotePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
