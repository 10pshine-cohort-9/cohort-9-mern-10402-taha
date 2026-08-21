import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AppLayout.css';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay-visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand" onClick={() => { navigate('/'); closeSidebar(); }} role="button" tabIndex={0}>
          <div className="sidebar-brand-title">Aesthete</div>
          <div className="sidebar-brand-subtitle">Your Thought Space</div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
            }
            onClick={closeSidebar}
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
            }
            onClick={closeSidebar}
          >
            Profile
          </NavLink>
        </nav>

        {/* Spacer pushes footer to bottom */}
        <div className="sidebar-spacer" />

        <div className="sidebar-footer">
          <button
            className="sidebar-new-note-btn"
            type="button"
            onClick={() => { navigate('/notes/new'); closeSidebar(); }}
          >
            + New Note
          </button>
          <div
            className="sidebar-user"
            onClick={() => { navigate('/profile'); closeSidebar(); }}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-avatar">A</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Admin User</span>
              <span className="sidebar-user-role">Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="app-main">
        {/* Header */}
        <header className="app-header">
          <button
            className="mobile-menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className="header-spacer" />

          <div className="header-actions">
            <button
              className="header-action-btn header-action-btn--create"
              aria-label="Create new note"
              onClick={() => navigate('/notes/new')}
            >
              +
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
