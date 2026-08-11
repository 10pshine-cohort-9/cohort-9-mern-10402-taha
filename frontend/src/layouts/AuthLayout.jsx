import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

function AuthLayout() {
  return (
    <div className="auth-layout">
      {/* Brand Panel */}
      <div className="auth-brand">
        <span className="auth-brand-label">Notes App</span>
        <h1 className="auth-brand-heading">
          YOUR
          <br />
          NOTES.
          <br />
          YOUR WAY.
        </h1>
        <p className="auth-brand-description">
          A modern note-taking application for creating, editing, and organizing
          your thoughts. Simple, fast, and always accessible.
        </p>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
