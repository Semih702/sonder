import type { NearbyNoteDto } from "@sonder/shared";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { reportNote } from "@/api/notesApi";
import { useNotesStore } from "@/store/useNotesStore";
import { relativeTime } from "@/utils/time";
import { LinkPreview } from "./LinkPreview";
import { PresenceDot } from "./PresenceDot";

export function NoteCard({ note, accessToken }: { note: NearbyNoteDto; accessToken: string }) {
  const removeNote = useNotesStore((state) => state.removeNote);

  async function onReport() {
    Alert.alert("Report note", "This note will be hidden from your feed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Report",
        style: "destructive",
        onPress: () => {
          reportNote(accessToken, note.id)
            .then(() => removeNote(note.id))
            .catch(() => removeNote(note.id));
        }
      }
    ]);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <Text style={styles.author}>{note.authorLabel}</Text>
          <PresenceDot active={note.isOwnerNearby} />
        </View>
        <Pressable accessibilityRole="button" hitSlop={10} onPress={onReport}>
          <Text style={styles.report}>Report</Text>
        </Pressable>
      </View>

      {note.text ? <Text style={styles.noteText}>{note.text}</Text> : null}
      {note.linkUrl && note.linkType ? (
        <LinkPreview linkUrl={note.linkUrl} linkType={note.linkType} />
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.meta}>{relativeTime(note.createdAt)}</Text>
        <Text style={styles.meta}>{note.distanceMeters}m away</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  authorRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  author: {
    color: "#2D2A26",
    fontSize: 14,
    fontWeight: "800"
  },
  report: {
    color: "#8C5148",
    fontSize: 13,
    fontWeight: "700"
  },
  noteText: {
    color: "#2D2A26",
    fontSize: 18,
    lineHeight: 25
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14
  },
  meta: {
    color: "#716B63",
    fontSize: 13
  }
});

