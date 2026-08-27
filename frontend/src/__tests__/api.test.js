import { request, loginApi, signupApi, getNotesApi, createNoteApi, updateNoteApi, deleteNoteApi } from '../utils/api.js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('request() adds Authorization header when token exists', async () => {
    localStorage.setItem('token', 'test-token');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    await request('/test');

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/test', expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      })
    }));
  });

  it('request() strings body for POST requests', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    await request('/test', { method: 'POST', body: { foo: 'bar' } });

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/test', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' })
    }));
  });

  it('request() throws error on non-ok response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad Request' })
    });

    await expect(request('/test')).rejects.toThrow('Bad Request');
  });

  it('request() clears token and dispatches auth-error on 401', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', '{}');
    
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' })
    });

    await expect(request('/test')).rejects.toThrow('Unauthorized');
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchSpy.mock.calls[0][0].type).toBe('auth-error');
  });

  it('API wrapper functions call correct endpoints', () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    
    loginApi('test@test.com', 'password');
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/login', expect.objectContaining({ method: 'POST' }));

    signupApi('Name', 'test@test.com', 'password');
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/signup', expect.objectContaining({ method: 'POST' }));

    getNotesApi();
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/notes', expect.objectContaining({ method: 'GET' }));

    createNoteApi('Title', 'Content');
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/notes', expect.objectContaining({ method: 'POST' }));

    updateNoteApi('123', 'New Title', 'New Content');
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/notes/123', expect.objectContaining({ method: 'PUT' }));

    deleteNoteApi('123');
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/notes/123', expect.objectContaining({ method: 'DELETE' }));
  });
});

describe('Protected Routes', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderApp = (initialRoute) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('redirects unauthenticated users to /login when accessing protected routes', async () => {
    renderApp('/dashboard');
    // Login form title should be present since we got redirected
    expect(await screen.findByText('Welcome Back')).toBeInTheDocument();
  });

  it('allows authenticated users to access protected routes', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ _id: '1', name: 'Test' }));
    
    // Mock getNotesApi for Dashboard mount
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    renderApp('/dashboard');
    // Dashboard header should be present
    expect(await screen.findByText('All Notes')).toBeInTheDocument();
  });

  it('redirects authenticated users away from /login to /dashboard', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ _id: '1', name: 'Test' }));
    
    // Mock getNotesApi for Dashboard mount
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    renderApp('/login');
    // Should end up on Dashboard
    expect(await screen.findByText('All Notes')).toBeInTheDocument();
  });
});

