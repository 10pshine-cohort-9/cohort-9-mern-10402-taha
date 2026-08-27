import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Button from '../components/Button/Button.jsx';
import Loader from '../components/Loader/Loader.jsx';
import EditorToolbar from '../components/EditorToolbar/EditorToolbar.jsx';
import { getNoteApi, createNoteApi, updateNoteApi, deleteNoteApi } from '../utils/api.js';
import './NoteEditor.css';

/* ---- Note Editor Page ---- */

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    let isMounted = true;
    if (isEditMode && editor) {
      const fetchNote = async () => {
        try {
          const note = await getNoteApi(id);
          if (isMounted && note) {
            setTitle(note.title || '');
            editor.commands.setContent(note.content || '');
          }
        } catch (error) {
          console.error('Failed to load note', error);
          if (isMounted) navigate('/dashboard');
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchNote();
    }
    return () => {
      isMounted = false;
    };
  }, [id, isEditMode, editor, navigate]);

  /* ---- Handlers ---- */

  const handleSave = useCallback(async () => {
    if (!editor) return;

    setSaving(true);
    const titleVal = title.trim() || 'Untitled';
    const contentVal = editor.getHTML();

    try {
      if (isEditMode) {
        await updateNoteApi(id, titleVal, contentVal);
      } else {
        await createNoteApi(titleVal, contentVal);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save note', error);
      alert('Error saving note: ' + error.message);
      setSaving(false);
    }
  }, [editor, title, id, isEditMode, navigate]);

  const handleDelete = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setDeleting(true);
      try {
        await deleteNoteApi(id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to delete note', error);
        alert('Error deleting note: ' + error.message);
        setDeleting(false);
      }
    }
  }, [id, navigate]);

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
          {isEditMode && (
            <Button
              variant="outline"
              size="md"
              onClick={handleDelete}
              disabled={saving || deleting}
              id="noteEditorDelete"
              style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          )}
          <Button
            variant="ghost"
            size="md"
            onClick={handleCancel}
            disabled={saving || deleting}
            id="noteEditorCancel"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={saving || deleting}
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
