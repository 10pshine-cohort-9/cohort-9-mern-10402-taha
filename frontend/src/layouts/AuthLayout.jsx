import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import './AuthLayout.css';

function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const SLIDE_MS = 800;

  /* Derive initial mode from URL */
  const getMode = (pathname) => pathname.includes('/signup') ? 'signup' : 'signin';
  const [mode, setMode] = useState(() => getMode(location.pathname));
  const [isSliding, setIsSliding] = useState(false);

  /* Sync mode when URL changes */
  useEffect(() => {
    const newMode = getMode(location.pathname);
    if (newMode !== mode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSliding(true);
      setMode(newMode);
      const timer = setTimeout(() => setIsSliding(false), SLIDE_MS);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Navigate and trigger slide */
  const switchMode = useCallback((newMode) => {
    if (isSliding || mode === newMode) return;
    navigate(newMode === 'signin' ? '/login' : '/signup');
  }, [isSliding, mode, navigate]);

  return (
    <div className="blade-auth-container">
      <div
        className={`auth_card${isSliding ? ' is_sliding' : ''}`}
        id="authCard"
        data-mode={mode}
      >
        {/* ---- Form Panes ---- */}
        <Signup mode={mode} switchMode={switchMode} />
        <Login mode={mode} switchMode={switchMode} />

        {/* ---- Sliding Band ---- */}
        <div className="auth_band" aria-hidden="true">
          <div className="band_edge left"></div>
          <div className="band_edge right"></div>

          <div className="band_inner">


            {/* Branding shown when signin (band on left) */}
            <div className="band_page band_page__signin">
              <div className="brand_tag">Aesthete Notes</div>
              <h3 className="welcome-title">
                CAPTURE<br />YOUR<br />THOUGHTS.
              </h3>
              <p className="welcome-desc">
                A simple space for your thoughts, ideas, and everything worth remembering.
              </p>
            </div>

            {/* Branding shown when signup (band on right) */}
            <div className="band_page band_page__signup">
              <div className="brand_tag">Aesthete Notes</div>
              <h3 className="welcome-title">
                CAPTURE<br />YOUR<br />THOUGHTS.
              </h3>
              <p className="welcome-desc">
                A simple space for your thoughts, ideas, and everything worth remembering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
