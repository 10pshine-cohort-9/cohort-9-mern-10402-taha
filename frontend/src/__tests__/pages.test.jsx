import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx';
import NoteEditor from '../pages/NoteEditor.jsx';
import Profile from '../pages/Profile.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import * as api from '../utils/api.js';

jest.mock('../utils/api.js');

// Mock Tiptap editor since it relies on DOM APIs not fully supported in jsdom
jest.mock('@tiptap/react', () => ({
  useEditor: () => ({
    getHTML: () => '<p>Mock Content</p>',
    commands: {
      setContent: jest.fn(),
    },
    isActive: jest.fn().mockReturnValue(false),
    chain: () => ({
      focus: () => ({
        toggleBold: () => ({ run: jest.fn() }),
        toggleItalic: () => ({ run: jest.fn() }),
        // add other mocks as needed
      }),
    }),
    can: () => ({
      undo: () => false,
      redo: () => false,
    }),
  }),
  EditorContent: () => <div data-testid="editor-content"></div>,
}));

const renderWithContext = (ui, { route = '/' } = {}) => {
  // Pre-login for protected routes
  localStorage.setItem('token', 'fake-token');
  localStorage.setItem('user', JSON.stringify({ _id: '1', name: 'Test User', email: 'test@example.com' }));
  
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ui} />
          <Route path="/notes/new" element={ui} />
          <Route path="/notes/:id/edit" element={ui} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Route</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loader while fetching notes', async () => {
    api.getNotesApi.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));
    renderWithContext(<Dashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays notes when API returns data', async () => {
    const mockNotes = [
      { _id: '1', title: 'Note 1', content: 'Content 1' },
      { _id: '2', title: 'Note 2', content: 'Content 2' },
    ];
    api.getNotesApi.mockResolvedValueOnce(mockNotes);
    
    renderWithContext(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.getByText('Note 2')).toBeInTheDocument();
    });
  });

  it('shows empty state when no notes', async () => {
    api.getNotesApi.mockResolvedValueOnce([]);
    renderWithContext(<Dashboard />);
    
    expect(await screen.findByText('No notes yet')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    api.getNotesApi.mockRejectedValueOnce(new Error('API Error'));
    renderWithContext(<Dashboard />);
    
    expect(await screen.findByText('Failed to load notes')).toBeInTheDocument();
    expect(screen.getByText('API Error')).toBeInTheDocument();
  });
});

describe('NoteEditor Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn().mockReturnValue(true);
    window.alert = jest.fn();
  });

  it('renders create mode correctly', () => {
    renderWithContext(<NoteEditor />, { route: '/notes/new' });
    expect(screen.getByText('Create a Note')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('saves new note and navigates', async () => {
    api.createNoteApi.mockResolvedValueOnce({});
    renderWithContext(<NoteEditor />, { route: '/notes/new' });
    
    fireEvent.change(screen.getByPlaceholderText('Untitled'), { target: { value: 'New Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Note/i }));
    
    await waitFor(() => {
      expect(api.createNoteApi).toHaveBeenCalledWith('New Title', '<p>Mock Content</p>');
      expect(screen.getByText('Dashboard Route')).toBeInTheDocument();
    });
  });

  it('renders edit mode and loads note', async () => {
    api.getNoteApi.mockResolvedValueOnce({ _id: '1', title: 'Existing Note', content: '<p>Content</p>' });
    
    // Simulate route match for /notes/1/edit
    render(
      <MemoryRouter initialEntries={['/notes/1/edit']}>
        <AuthProvider>
          <Routes>
            <Route path="/notes/:id/edit" element={<NoteEditor />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
    
    expect(await screen.findByText('Edit Your Note')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Note')).toBeInTheDocument();
    });
  });

  it('deletes note after confirmation', async () => {
    api.getNoteApi.mockResolvedValueOnce({ _id: '1', title: 'Note', content: 'Content' });
    api.deleteNoteApi.mockResolvedValueOnce({});
    
    render(
      <MemoryRouter initialEntries={['/notes/1/edit']}>
        <AuthProvider>
          <Routes>
            <Route path="/notes/:id/edit" element={<NoteEditor />} />
            <Route path="/dashboard" element={<div>Dashboard Route</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
    
    // Wait for note to load
    await screen.findByDisplayValue('Note');
    
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    
    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(api.deleteNoteApi).toHaveBeenCalledWith('1');
      expect(screen.getByText('Dashboard Route')).toBeInTheDocument();
    });
  });

  it('handles delete failure gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    api.getNoteApi.mockResolvedValueOnce({ _id: '1', title: 'Note', content: 'Content' });
    api.deleteNoteApi.mockRejectedValueOnce(new Error('API failure'));
    
    render(
      <MemoryRouter initialEntries={['/notes/1/edit']}>
        <AuthProvider>
          <Routes>
            <Route path="/notes/:id/edit" element={<NoteEditor />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
    
    // Wait for note to load
    await screen.findByDisplayValue('Note');
    
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    
    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(api.deleteNoteApi).toHaveBeenCalledWith('1');
      expect(window.alert).toHaveBeenCalledWith('Error deleting note: API failure');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user details from context', async () => {
    api.getNotesApi.mockResolvedValueOnce([{ _id: '1' }]);
    renderWithContext(<Profile />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    await waitFor(() => {
      // 1 note created
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('handles logout', async () => {
    api.getNotesApi.mockResolvedValueOnce([]);
    jest.useFakeTimers();
    
    renderWithContext(<Profile />);
    
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    expect(screen.getByRole('button', { name: /Signing Out…/i })).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });
});
