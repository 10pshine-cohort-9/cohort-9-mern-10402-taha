import { useState } from 'react';
import Input from '../components/Input/Input.jsx';
import Button from '../components/Button/Button.jsx';

function Signup({ mode, switchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Must be at least 8 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      // Mock API call — will connect to POST /api/auth/signup later
      setTimeout(() => {
        setLoading(false);
        console.log('Signup submitted:', { email });
      }, 1500);
    }
  };

  return (
    <div
      className="pane pane__signup"
      id="paneSignup"
      inert={mode === 'signin' ? '' : undefined}
    >
      <h2 className="form-title">Create Account</h2>
      <p className="form-subtitle">Start organizing your thoughts.</p>

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
