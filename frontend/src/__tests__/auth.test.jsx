import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import * as api from '../utils/api.js';

jest.mock('../utils/api.js');

const renderAuth = (initialEntries = ['/login']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/signup" element={<AuthLayout />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password fields', () => {
    renderAuth();
    expect(screen.getAllByLabelText('Email Address')[1]).toBeInTheDocument();
    expect(screen.getAllByLabelText('Password')[1]).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    renderAuth();
    fireEvent.click(screen.getByRole('button', { name: /Login →/i }));
    
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Passphrase is required')).toBeInTheDocument();
  });

  it('shows validation error for invalid email format', async () => {
    renderAuth();
    fireEvent.change(screen.getAllByLabelText('Email Address')[1], { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Login →/i }));
    
    expect(await screen.findByText('Email address is invalid')).toBeInTheDocument();
  });

  it('calls loginApi and navigates to dashboard on success', async () => {
    api.loginApi.mockResolvedValueOnce({ _id: '1', name: 'Test User', email: 'test@example.com', token: 'test-token' });
    
    renderAuth();
    
    fireEvent.change(screen.getAllByLabelText('Email Address')[1], { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByLabelText('Password')[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login →/i }));
    
    expect(screen.getByRole('button', { name: /Login…/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(api.loginApi).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('shows API error message on failure', async () => {
    api.loginApi.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    renderAuth();
    
    fireEvent.change(screen.getAllByLabelText('Email Address')[1], { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByLabelText('Password')[1], { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login →/i }));
    
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
});

describe('Signup Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders signup fields', () => {
    renderAuth(['/signup']);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Email Address')[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText('Password')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields on submit', async () => {
    renderAuth(['/signup']);
    fireEvent.click(screen.getByRole('button', { name: /Create Account →/i }));
    
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
  });

  it('shows validation error for mismatched passwords', async () => {
    renderAuth(['/signup']);
    
    const nameInputs = screen.getAllByLabelText('Full Name');
    fireEvent.change(nameInputs[0], { target: { value: 'Test User' } });
    
    const emailInputs = screen.getAllByLabelText('Email Address');
    fireEvent.change(emailInputs[0], { target: { value: 'test@example.com' } }); // Signup email (index 0)
    
    const passwordInputs = screen.getAllByLabelText('Password');
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } }); // Signup password (index 0)
    
    const confirmInputs = screen.getAllByLabelText('Confirm Password');
    fireEvent.change(confirmInputs[0], { target: { value: 'password456' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account →/i }));
    
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('calls signupApi and navigates to dashboard on success', async () => {
    api.signupApi.mockResolvedValueOnce({ _id: '1', name: 'Test User', email: 'test@example.com', token: 'test-token' });
    
    renderAuth(['/signup']);
    
    fireEvent.change(screen.getAllByLabelText('Full Name')[0], { target: { value: 'Test User' } });
    fireEvent.change(screen.getAllByLabelText('Email Address')[0], { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByLabelText('Password')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByLabelText('Confirm Password')[0], { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Account →/i }));
    
    await waitFor(() => {
      expect(api.signupApi).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
