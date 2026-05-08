import { ApiError } from "@/lib/errors";
import { noteRepository } from "@/repositories/noteRepository";
import { reportRepository } from "@/repositories/reportRepository";
import { userRepository } from "@/repositories/userRepository";

export const adminService = {
  listNotes(filter?: string) {
    const allowed = ["reported", "hidden", "deleted", "active"] as const;
    const normalized = allowed.includes(filter as (typeof allowed)[number])
      ? (filter as (typeof allowed)[number])
      : undefined;

    return noteRepository.listRecent({ filter: normalized });
  },

  listReports() {
    return reportRepository.listRecent();
  },

  async hideNote(noteId: string) {
    const note = await noteRepository.findById(noteId);
    if (!note) {
      throw new ApiError(404, "not_found", "Note not found.");
    }
    return noteRepository.hideNote(noteId);
  },

  async deleteNote(noteId: string) {
    const note = await noteRepository.findById(noteId);
    if (!note) {
      throw new ApiError(404, "not_found", "Note not found.");
    }
    return noteRepository.deleteNote(noteId);
  },

  async banUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "not_found", "User not found.");
    }
    return userRepository.banUser(userId);
  }
};

