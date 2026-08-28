import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input/Input.jsx';
import Button from '../components/Button/Button.jsx';
import { signupApi } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function Signup({ mode, switchMode }) {
  const [name, setName] = useState(''); // Add a state for name since backend requires it
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = 'Name is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Must be at least 6 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        const data = await signupApi(name, email, password);
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
      className="pane pane__signup"
      id="paneSignup"
      inert={mode === 'signin' ? true : undefined}
    >
      <h2 className="form-title">Create Account</h2>
      <p className="form-subtitle">Start organizing your thoughts.</p>

      {apiError && <div className="api-error" style={{ color: 'var(--color-danger)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{apiError}</div>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Input
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="identity@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />
          <div className="input-hint">Use 8 characters or more</div>
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Creating…' : 'Create Account →'}
        </Button>
      </form>

      <p className="switch-text">
        Already have an account?
        <button
          type="button"
          className="switch-btn"
          onClick={() => switchMode('signin')}
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

export default Signup;
