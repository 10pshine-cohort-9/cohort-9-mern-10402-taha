import { useState, useCallback, useEffect } from 'react';
import Button from '../components/Button/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getNotesApi } from '../utils/api.js';
import './Profile.css';

/* ---- Profile Info Row ---- */

function ProfileField({ label, value }) {
  return (
    <div className="profile-field">
      <span className="profile-field-label">{label}</span>
      <span className="profile-field-value">{value}</span>
    </div>
  );
}

/* ---- Stat Card ---- */

function StatCard({ label, value }) {
  return (
    <div className="profile-stat-card">
      <span className="profile-stat-value">{value}</span>
      <span className="profile-stat-label">{label}</span>
    </div>
  );
}

/* ---- Profile Page ---- */

function Profile() {
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
    getNotesApi().then(notes => setNotesCount(notes ? notes.length : 0)).catch(() => setNotesCount(0));
  }, []);

  /* ---- Logout Handler ---- */

  const handleLogout = useCallback(() => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
    }, 800);
  }, [logout]);

  /* ---- Render ---- */

  if (!user) return null;

  // Assume user created recently if no joinedAt in new schema
  const joinedDate = user.createdAt ? new Date(user.createdAt) : new Date();
  
  const formattedJoinDate = joinedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="profile" id="profilePage">
      {/* Page Header */}
      <div className="profile-page-header">
        <div className="profile-page-header-left">
          <span className="profile-breadcrumb">Account</span>
          <h1 className="profile-page-title">Your Profile</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card" id="profileCard">
        {/* Avatar & Identity */}
        <div className="profile-identity">
          <div className="profile-avatar" aria-hidden="true">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-identity-info">
            <h2 className="profile-name">{user.name}</h2>
            <span className="profile-role-badge">Member</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="profile-divider" />

        {/* User Details */}
        <div className="profile-details" id="profileDetails">
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Role" value="Member" />
          <ProfileField label="Member Since" value={formattedJoinDate} />
        </div>

        {/* Divider */}
        <hr className="profile-divider" />

        {/* Stats */}
        <div className="profile-stats">
          <StatCard label="Notes Created" value={notesCount} />
          <StatCard label="Member Since" value={joinedDate.getFullYear()} />
        </div>
      </div>

      {/* Actions Section */}
      <div className="profile-actions-section" id="profileActions">
        <div className="profile-actions-card">
          <div className="profile-actions-info">
            <h3 className="profile-actions-title">Sign Out</h3>
            <p className="profile-actions-desc">
              End your current session and return to the login page.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={handleLogout}
            disabled={loggingOut}
            id="profileLogoutBtn"
            className="profile-logout-btn"
          >
            {loggingOut ? 'Signing Out…' : 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
