import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AppLayout.css';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { to: '/', label: 'All Notes', icon: '📋' },
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay-visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-title">Notes</div>
          <div className="sidebar-brand-subtitle">Your Workspace</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
              }
              onClick={closeSidebar}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">U</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">User</span>
              <span className="sidebar-user-role">Member</span>
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

          <div className="header-search">
            <span className="header-search-icon">🔍</span>
            <input
              type="text"
              className="header-search-input"
              placeholder="Search notes..."
              aria-label="Search notes"
            />
          </div>

          <div className="header-actions">
            <button className="header-action-btn" aria-label="Create new note" onClick={() => navigate('/notes/new')}>
              +
            </button>
            <button className="header-action-btn" aria-label="User menu">
              👤
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
