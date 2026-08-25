import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Button from '../components/Button/Button.jsx';
import Loader from '../components/Loader/Loader.jsx';
import EditorToolbar from '../components/EditorToolbar/EditorToolbar.jsx';
import './NoteEditor.css';

/* ---- Mock Data for Edit Mode ---- */
/* Will be replaced with API fetch in a future PR */

const MOCK_NOTES = {
  '1': {
    title: 'Getting Started with Aesthete Notes',
    content: '<h2>Welcome to Aesthete Notes</h2><p>This is your personal thought space. Use the toolbar above to format your content with <strong>bold</strong>, <em>italic</em>, <u>underline</u>, and more.</p><ul><li>Create structured notes with headings</li><li>Organize ideas with bullet lists</li><li>Add code snippets and blockquotes</li></ul><blockquote><p>The best ideas deserve a beautiful space to live in.</p></blockquote>',
  },
  '2': {
    title: 'Project Planning Notes',
    content: '<h2>Sprint Goals</h2><p>Focus areas for this iteration:</p><ol><li>Complete the Note Editor UI</li><li>Integrate rich text formatting</li><li>Add responsive design support</li></ol><h3>Technical Notes</h3><p>Using <strong>Tiptap</strong> as the rich-text engine for its clean API and extensibility.</p>',
  },
};

/* ---- Note Editor Page ---- */

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  /* ---- Tiptap Editor ---- */

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your note…',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'note-editor-content',
      },
    },
  });

  /* ---- Load Note Data (Edit Mode) ---- */

  useEffect(() => {
    if (isEditMode && editor) {
      // Simulate API fetch — will be replaced with real API call
      const timer = setTimeout(() => {
        const note = MOCK_NOTES[id];
        if (note) {
          setTitle(note.title);
          editor.commands.setContent(note.content);
        }
        setLoading(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [id, isEditMode, editor]);

  /* ---- Handlers ---- */

  const handleSave = useCallback(() => {
    if (!editor) return;

    setSaving(true);

    const noteData = {
      title: title.trim() || 'Untitled',
      content: editor.getHTML(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditMode) {
      noteData.id = id;
    }

    // Frontend-only: log to console. API integration in a future PR.
    console.log(`[NoteEditor] ${isEditMode ? 'Update' : 'Create'} note:`, noteData);

    // Simulate save delay then navigate back
    setTimeout(() => {
      setSaving(false);
      navigate('/dashboard');
    }, 800);
  }, [editor, title, id, isEditMode, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  /* ---- Loading State ---- */

  if (loading) {
    return (
      <div className="note-editor-loading" id="noteEditorLoading">
        <Loader size="lg" />
        <p className="note-editor-loading-text">Loading note…</p>
      </div>
    );
  }

  /* ---- Render ---- */

  return (
    <div className="note-editor" id="noteEditorPage">
      {/* Page Header */}
      <div className="note-editor-header">
        <div className="note-editor-header-left">
          <span className="note-editor-breadcrumb">
            {isEditMode ? 'Edit Note' : 'New Note'}
          </span>
          <h1 className="note-editor-page-title">
            {isEditMode ? 'Edit Your Note' : 'Create a Note'}
          </h1>
        </div>
        <div className="note-editor-actions">
          <Button
            variant="ghost"
            size="md"
            onClick={handleCancel}
            disabled={saving}
            id="noteEditorCancel"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={saving}
            id="noteEditorSave"
          >
            {saving ? 'Saving…' : 'Save Note'}
          </Button>
        </div>
      </div>

      {/* Title Input */}
      <div className="note-editor-title-wrapper">
        <input
          type="text"
          className="note-editor-title-input"
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Note title"
          id="noteEditorTitleInput"
          autoFocus={!isEditMode}
        />
      </div>

      {/* Editor Area */}
      <div className="note-editor-wrapper" id="noteEditorWrapper">
        <EditorToolbar editor={editor} />
        <div className="note-editor-body">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;
