import { useState, useEffect, useCallback } from 'react';
import type { Note } from '../data';

const STORAGE_KEY = 'notes-app-notes';
const COLORS = ['#FDB2FF', '#FF9E9E', '#91F48F', '#FFF599', '#9EFFFF', '#B69CFF'];

function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function loadNotes(): Note[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore corrupted data
  }
  return [];
}

function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // storage full or unavailable
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function useNotes(seedNotes: Note[]) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const loaded = loadNotes();
    if (loaded.length === 0) {
      // First visit: seed with initial data and save
      saveNotes(seedNotes);
      return seedNotes;
    }
    return loaded;
  });

  // Persist to localStorage on every change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const createNote = useCallback((title: string, content: string, category?: string) => {
    const now = new Date().toISOString();
    const note: Note = {
      id: generateId(),
      title,
      content,
      color: getRandomColor(),
      category: category || 'General',
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNote = useCallback(
    (id: string): Note | undefined => notes.find((n) => n.id === id),
    [notes]
  );

  return { notes, createNote, updateNote, deleteNote, getNote };
}
