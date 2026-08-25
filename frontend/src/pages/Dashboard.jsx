import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNotes } from '../utils/storage.js';
import './Dashboard.css';

/* ---- Note Card Component ---- */
/* Ready to receive real note objects from backend API */

function NoteCard({ note, onClick }) {
  const formattedDate = note.updatedAt
    ? new Date(note.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article
      className="note-card"
      onClick={() => onClick(note._id || note.id)}
      tabIndex={0}
      role="button"
      aria-label={`Open note: ${note.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(note._id || note.id);
        }
      }}
    >
      {/* Date */}
      {formattedDate && (
        <span className="note-card-date">{formattedDate}</span>
      )}

      {/* Title */}
      <h3 className="note-card-title">{note.title || 'Untitled'}</h3>

      {/* Content preview */}
      {note.content && (
        <p className="note-card-excerpt">{note.content}</p>
      )}
    </article>
  );
}

/* ---- Create Note Card ---- */

function CreateNoteCard() {
  return (
    <Link to="/notes/new" className="note-card note-card--create" id="createNoteCard">
      <div className="note-create-plus">+</div>
      <div className="note-create-text">
        <span className="note-create-label">New Note</span>
      </div>
    </Link>
  );
}

/* ---- Empty State ---- */

function EmptyState() {
  return (
    <div className="dashboard-empty" id="dashboardEmpty">
      <div className="dashboard-empty-glyph">
        <span className="empty-line" />
        <span className="empty-line empty-line--short" />
        <span className="empty-line empty-line--medium" />
      </div>
      <h3 className="dashboard-empty-title">No notes yet</h3>
      <p className="dashboard-empty-desc">
        Your workspace is empty. Create your first note to begin.
      </p>
      <Link to="/notes/new" className="dashboard-empty-action">
        + Create Note
      </Link>
    </div>
  );
}

/* ---- Dashboard Page ---- */

function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        (note.title && note.title.toLowerCase().includes(q)) ||
        (note.content && note.content.toLowerCase().includes(q))
    );
  }, [searchQuery, notes]);

  const handleNoteClick = (id) => {
    navigate(`/notes/${id}/edit`);
  };

  const hasNotes = filteredNotes.length > 0;

  return (
    <div className="dashboard" id="dashboardPage">
      {/* Page Header */}
      <div className="dashboard-header">
        <span className="dashboard-breadcrumb">Workspace</span>
        <h1 className="dashboard-title">All Notes</h1>
      </div>

      {/* Search — only show when there are notes to search */}
      {notes.length > 0 && (
        <div className="dashboard-search-bar">
          <input
            type="text"
            className="dashboard-search-input"
            placeholder="Search notes..."
            aria-label="Search notes"
            id="dashboardSearchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Notes Content */}
      {hasNotes ? (
        <div className="notes-grid" id="notesGrid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id || note.id}
              note={note}
              onClick={handleNoteClick}
            />
          ))}
          <CreateNoteCard />
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export default Dashboard;
