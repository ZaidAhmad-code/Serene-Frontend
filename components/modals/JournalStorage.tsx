"use client";

import { JournalEntry, JournalStore } from "@/types";

const JOURNAL_KEY = "serene_journal_v1";

function getStore(): JournalStore {
  if (typeof window === "undefined") return { entries: [], version: 1 };
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) return { entries: [], version: 1 };
    return JSON.parse(raw) as JournalStore;
  } catch {
    return { entries: [], version: 1 };
  }
}

function saveStore(store: JournalStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(store));
}

export function getAllEntries(): JournalEntry[] {
  return getStore().entries;
}

export function addEntry(entry: Omit<JournalEntry, "id" | "date" | "wordCount">, text: string): JournalEntry {
  const store = getStore();
  const newEntry: JournalEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    mood: entry.mood,
    date: new Date().toISOString(),
    wordCount: text.trim().split(/\s+/).filter(Boolean).length,
  };
  store.entries.unshift(newEntry);
  saveStore(store);
  return newEntry;
}

export function deleteEntry(id: string): void {
  const store = getStore();
  store.entries = store.entries.filter((e) => e.id !== id);
  saveStore(store);
}

export function updateEntry(id: string, text: string, mood: string): void {
  const store = getStore();
  const entry = store.entries.find((e) => e.id === id);
  if (entry) {
    entry.text = text;
    entry.mood = mood;
    entry.wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  }
  saveStore(store);
}