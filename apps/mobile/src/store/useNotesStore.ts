import type { NearbyNoteDto } from "@sonder/shared";
import { create } from "zustand";

type NotesState = {
  notes: NearbyNoteDto[];
  setNotes: (notes: NearbyNoteDto[]) => void;
  removeNote: (noteId: string) => void;
  addOrReplaceNote: (note: NearbyNoteDto) => void;
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
  removeNote: (noteId) => set((state) => ({ notes: state.notes.filter((note) => note.id !== noteId) })),
  addOrReplaceNote: (note) =>
    set((state) => ({
      notes: [note, ...state.notes.filter((existing) => existing.id !== note.id)].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }))
}));

