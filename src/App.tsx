import { useState, useCallback, useEffect } from 'react';
import { defaultNotes, categoryOptions, noteColors } from './data';
import type { Note } from './data';
import { useNotes } from './hooks/useNotes';
import './App.css';

type Screen = 'home' | 'detail' | 'edit' | 'search' | 'empty';
type NavDir = 'forward' | 'backward' | 'none';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return `Today, ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function App() {
  const { notes, createNote, updateNote, deleteNote } = useNotes(defaultNotes);

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [navDir, setNavDir] = useState<NavDir>('none');
  const [showIntro, setShowIntro] = useState(true);
  const [introFading, setIntroFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroFading(true);
      setTimeout(() => setShowIntro(false), 600);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('General');
  const [editColor, setEditColor] = useState(noteColors[0]);

  const navigate = useCallback((to: Screen, dir: NavDir) => {
    setNavDir(dir);
    setCurrentScreen(to);
  }, []);

  // --- Navigation ---

  const openNote = useCallback((note: Note) => {
    setSelectedNote(note);
    navigate('detail', 'forward');
  }, [navigate]);

  const goHome = useCallback(() => {
    navigate('home', 'backward');
    // Reset on animation end
    setTimeout(() => {
      setSelectedNote(null);
      setSearchQuery('');
      setShowDeleteConfirm(false);
    }, 300);
  }, [navigate]);

  const openSearch = useCallback(() => {
    navigate('search', 'forward');
  }, [navigate]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // --- Create ---

  const startCreate = useCallback(() => {
    setSelectedNote(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('General');
    setEditColor(noteColors[Math.floor(Math.random() * noteColors.length)]);
    navigate('edit', 'forward');
  }, [navigate]);

  const handleCreate = useCallback(() => {
    const title = editTitle.trim();
    const content = editContent.trim();
    if (!title || !content) return;
    const note = createNote(title, content, editCategory);
    updateNote(note.id, { color: editColor });
    setSelectedNote({ ...note, color: editColor });
    navigate('detail', 'forward');
  }, [editTitle, editContent, editCategory, editColor, createNote, updateNote, navigate]);

  // --- Edit ---

  const startEdit = useCallback((note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category);
    setEditColor(note.color);
    setShowDeleteConfirm(false);
    navigate('edit', 'forward');
  }, [navigate]);

  const handleUpdate = useCallback(() => {
    if (!selectedNote) return;
    const title = editTitle.trim();
    const content = editContent.trim();
    if (!title || !content) return;
    updateNote(selectedNote.id, { title, content, category: editCategory, color: editColor });
    setSelectedNote({ ...selectedNote, title, content, category: editCategory, color: editColor, updatedAt: new Date().toISOString() });
    navigate('detail', 'forward');
  }, [selectedNote, editTitle, editContent, editCategory, editColor, updateNote, navigate]);

  // --- Delete ---

  const handleDelete = useCallback(() => {
    if (!selectedNote) return;
    deleteNote(selectedNote.id);
    goHome();
  }, [selectedNote, deleteNote, goHome]);

  // --- Search ---

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const animClass = navDir === 'forward' ? 'slide-in-right' : navDir === 'backward' ? 'slide-in-left' : '';

  // --- Render ---

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      {/* ===== Intro Splash ===== */}
      {showIntro && (
        <div className={`intro-overlay ${introFading ? 'intro-fade-out' : ''}`}>
          <div className="intro-content">
            <svg className="intro-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path className="intro-path" d="M16 52L20 40L44 16C46.2 13.8 49.8 13.8 52 16C54.2 18.2 54.2 21.8 52 24L28 48L16 52Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
              <path className="intro-path" d="M16 52L20 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path className="intro-path" d="M36 20L44 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle className="intro-dot" cx="16" cy="52" r="3" fill="currentColor"/>
            </svg>
            <h1 className="intro-title">
              {'Notes'.split('').map((letter, i) => (
                <span key={i} className="intro-letter" style={{ animationDelay: `${0.6 + i * 0.12}s` }}>
                  {letter}
                </span>
              ))}
            </h1>
            <p className="intro-tagline">Your thoughts, organized.</p>
          </div>
        </div>
      )}

      {/* ===== Home Screen ===== */}
      {currentScreen === 'home' && (
        <div className={`screen home-screen ${animClass}`}>
          <header className="header">
            <h1 className="header-title">Notes</h1>
            <div className="header-actions">
              <button className="icon-btn" onClick={openSearch} aria-label="Search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 4V2M12 22V20M20 12H22M2 12H4M17.66 6.34L19.07 4.93M4.93 19.07L6.34 17.66M17.66 17.66L19.07 19.07M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </header>

          <div className="notes-scroll">
            {notes.length === 0 ? (
              <div className="home-empty">
                <p className="home-empty-text">No notes yet — tap + to create one</p>
              </div>
            ) : (
              <div className="notes-list">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    className="note-card"
                    style={{ backgroundColor: note.color }}
                    onClick={() => openNote(note)}
                  >
                    <span className="note-card-text">{note.title}</span>
                    <span className="note-card-date">{formatDate(note.updatedAt)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="fab" onClick={startCreate} aria-label="Add note">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}        {/* ===== Detail Screen ===== */}
      {currentScreen === 'detail' && selectedNote && (
        <div className={`screen detail-screen ${animClass}`}>
          <header className="detail-header">
            <button className="icon-btn" onClick={goHome} aria-label="Back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="header-actions">
              <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 4V2M12 22V20M20 12H22M2 12H4M17.66 6.34L19.07 4.93M4.93 19.07L6.34 17.66M17.66 17.66L19.07 19.07M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <button className="icon-btn" onClick={() => startEdit(selectedNote)} aria-label="Edit">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </header>

          <div className="detail-content">
            <div className="detail-color-bar" style={{ backgroundColor: selectedNote.color }} />
            <h2 className="detail-title">{selectedNote.title}</h2>
            <div className="detail-meta">
              <span className="detail-date">{formatDate(selectedNote.updatedAt)}</span>
              <span className="detail-category" style={{ backgroundColor: selectedNote.color }}>
                {selectedNote.category}
              </span>
            </div>
            <p className="detail-body">{selectedNote.content}</p>
          </div>

          {/* Delete button */}
          <div className="detail-footer">
            <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)} aria-label="Delete note">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Delete Note?</h3>
            <p className="confirm-text">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit / Create Screen ===== */}
      {currentScreen === 'edit' && (
        <div className={`screen edit-screen ${animClass}`}>
          <header className="detail-header">
            <button className="icon-btn" onClick={selectedNote ? () => navigate('detail', 'backward') : goHome} aria-label="Cancel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h2 className="edit-header-title">{selectedNote ? 'Edit Note' : 'New Note'}</h2>
            <button className="icon-btn save-btn" onClick={selectedNote ? handleUpdate : handleCreate} aria-label="Save">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </header>

          <div className="edit-content">
            {/* Color picker */}
            <div className="edit-colors">
              <label className="edit-label">Color</label>
              <div className="color-picker">
                {noteColors.map((c) => (
                  <button
                    key={c}
                    className={`color-swatch ${editColor === c ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setEditColor(c)}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="edit-field">
              <label className="edit-label">Category</label>
              <select
                className="edit-select"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="edit-field">
              <label className="edit-label">Title</label>
              <input
                type="text"
                className="edit-input"
                placeholder="Note title..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
              />
            </div>

            {/* Content */}
            <div className="edit-field">
              <label className="edit-label">Content</label>
              <textarea
                className="edit-textarea"
                placeholder="Write your note here..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== Search Screen ===== */}
      {currentScreen === 'search' && (
        <div className={`screen search-screen ${animClass}`}>
          <header className="search-header">
            <button className="icon-btn" onClick={goHome} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="search-input-wrapper">
              <svg className="search-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by the keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </header>

          <div className="search-results">
            {filteredNotes.length === 0 ? (
              <div className="search-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" opacity="0.3">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p>No notes found</p>
              </div>
            ) : (
              <div className="search-notes-list">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    className="search-note-item"
                    onClick={() => openNote(note)}
                  >
                    <div className="search-note-color" style={{ backgroundColor: note.color }} />
                    <div className="search-note-info">
                      <span className="search-note-title">{note.title}</span>
                      <span className="search-note-preview">{note.content.slice(0, 60)}...</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Empty State ===== */}
      {currentScreen === 'empty' && (
        <div className={`screen empty-screen ${animClass}`}>
          <header className="header">
            <h1 className="header-title">Notes</h1>
            <div className="header-actions">
              <button className="icon-btn" onClick={openSearch} aria-label="Search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 4V2M12 22V20M20 12H22M2 12H4M17.66 6.34L19.07 4.93M4.93 19.07L6.34 17.66M17.66 17.66L19.07 19.07M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </header>

          <div className="empty-content">
            <svg className="empty-illustration" width="200" height="200" viewBox="0 0 200 200" fill="none">
              <rect x="40" y="30" width="120" height="140" rx="15" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
              <line x1="60" y1="70" x2="140" y2="70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
              <line x1="60" y1="95" x2="120" y2="95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
              <line x1="60" y1="120" x2="130" y2="120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
              <circle cx="100" cy="155" r="3" fill="currentColor" opacity="0.3"/>
            </svg>
            <h2 className="empty-title">Create your first note!</h2>
            <p className="empty-subtitle">Tap the + button to start writing</p>
            <button className="empty-cta" onClick={startCreate}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              New Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
