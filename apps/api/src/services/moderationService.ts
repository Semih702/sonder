import { APP_CONFIG, type ReportNoteInput } from "@sonder/shared";
import { ApiError } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rateLimit";
import { noteRepository } from "@/repositories/noteRepository";
import { reportRepository } from "@/repositories/reportRepository";

export function shouldAutoHideReportCount(reportCount: number): boolean {
  return reportCount >= APP_CONFIG.REPORT_AUTO_HIDE_THRESHOLD;
}

export const moderationService = {
  async reportNote(userId: string, noteId: string, input: ReportNoteInput) {
    await enforceRateLimit({
      userId,
      action: "report_note",
      maxEvents: APP_CONFIG.MAX_REPORTS_PER_USER_PER_HOUR
    });

    const note = await noteRepository.findById(noteId);
    if (!note || note.deletedAt) {
      throw new ApiError(404, "not_found", "Note not found.");
    }

    const result = await reportRepository.createIfAbsent({
      noteId,
      reporterUserId: userId,
      reason: input.reason
    });

    if (!result.created) {
      return { success: true, hiddenForUser: true, autoHidden: Boolean(note.hiddenAt) };
    }

    const updated = await noteRepository.incrementReportCount(noteId);
    let autoHidden = Boolean(updated.hiddenAt);

    if (!updated.hiddenAt && shouldAutoHideReportCount(updated.reportCount)) {
      await noteRepository.hideNote(noteId);
      autoHidden = true;
    }

    return {
      success: true,
      hiddenForUser: true,
      autoHidden
    };
  }
};

