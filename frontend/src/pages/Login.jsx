import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input/Input.jsx';
import Button from '../components/Button/Button.jsx';
import { loginApi } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function Login({ mode, switchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setApiError('');
      try {
        const data = await loginApi(email, password);
        login({ _id: data._id, name: data.name, email: data.email }, data.token);
        navigate('/dashboard');
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
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

      {apiError && <div className="api-error" style={{ color: 'var(--color-danger)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{apiError}</div>}

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
