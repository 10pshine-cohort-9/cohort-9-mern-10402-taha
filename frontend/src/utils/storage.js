const DEFAULT_USER = {
  name: 'Admin User',
  email: 'admin@aesthete.io',
  role: 'Admin',
  // Set joinedAt to 30 days ago to make "Member Since" look realistic
  joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  avatar: 'A',
};

export const getUser = () => {
  const userStr = localStorage.getItem('aesthete_user');
  if (!userStr) {
    localStorage.setItem('aesthete_user', JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }
  return JSON.parse(userStr);
};

export const getNotes = () => {
  const notesStr = localStorage.getItem('aesthete_notes');
  if (!notesStr) {
    return [];
  }
  return JSON.parse(notesStr);
};

export const getNote = (id) => {
  const notes = getNotes();
  return notes.find((n) => n.id === id || n._id === id);
};

export const saveNote = (noteData) => {
  const notes = getNotes();
  const existingIndex = notes.findIndex((n) => n.id === noteData.id || n._id === noteData.id);
  
  if (existingIndex >= 0) {
    notes[existingIndex] = { ...notes[existingIndex], ...noteData };
  } else {
    noteData.id = noteData.id || Date.now().toString();
    notes.push(noteData);
  }
  
  localStorage.setItem('aesthete_notes', JSON.stringify(notes));
};
