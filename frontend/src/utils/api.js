const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      // Clear token on unauthorized (e.g., token expired)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-error'));
    }
    const errorMessage = data?.message || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }

  return data;
};

export const loginApi = (email, password) => 
  request('/auth/login', { method: 'POST', body: { email, password } });

export const signupApi = (name, email, password) => 
  request('/auth/signup', { method: 'POST', body: { name, email, password } });

export const getNotesApi = () => 
  request('/notes', { method: 'GET' });

export const getNoteApi = (id) => 
  request(`/notes/${id}`, { method: 'GET' });

export const createNoteApi = (title, content) => 
  request('/notes', { method: 'POST', body: { title, content } });

export const updateNoteApi = (id, title, content) => 
  request(`/notes/${id}`, { method: 'PUT', body: { title, content } });

export const deleteNoteApi = (id) => 
  request(`/notes/${id}`, { method: 'DELETE' });
