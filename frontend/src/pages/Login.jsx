import { useState } from 'react';
import Input from '../components/Input/Input.jsx';
import Button from '../components/Button/Button.jsx';

function Login({ mode, switchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!password) {
      newErrors.password = 'Passphrase is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      // Mock API call — will connect to POST /api/auth/login later
      setTimeout(() => {
        setLoading(false);
        console.log('Login submitted:', { email });
      }, 1500);
    }
  };

  return (
    <div
      className="pane pane__signin"
      id="paneSignin"
      inert={mode === 'signup' ? '' : undefined}
    >
      <h2 className="form-title">Welcome Back</h2>
      <p className="form-subtitle">Sign in to continue to your notes.</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email Address"
          type="email"
          placeholder="identity@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="form-actions">
          <label className="checkbox-label">
            <input type="checkbox" defaultChecked /> Keep me signed in
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Login…' : 'Login →'}
        </Button>
      </form>

      <p className="switch-text">
        Don’t have an account?
        <button
          type="button"
          className="switch-btn"
          onClick={() => switchMode('signup')}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

export default Login;
