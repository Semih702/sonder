import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { APP_CONFIG, createNoteSchema } from "@sonder/shared";
import { ApiClientError } from "@/api/client";
import { createNote } from "@/api/notesApi";
import { CharacterCounter } from "@/components/CharacterCounter";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useNotesStore } from "@/store/useNotesStore";

type Props = {
  accessToken: string;
  onCancel: () => void;
  onCreated: () => void;
};

export function CreateNoteScreen({ accessToken, onCancel, onCreated }: Props) {
  const { requestLocation } = useCurrentLocation();
  const addOrReplaceNote = useNotesStore((state) => state.addOrReplaceNote);
  const [text, setText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const canSubmit = useMemo(() => Boolean(text.trim() || linkUrl.trim()), [linkUrl, text]);

  async function submit() {
    setLoading(true);
    setError(undefined);

    try {
      const location = await requestLocation();
      if (!location) {
        setError("Location permission is needed to leave a note.");
        return;
      }

      const parsed = createNoteSchema.parse({
        text,
        linkUrl,
        isAnonymous,
        latitude: location.latitude,
        longitude: location.longitude
      });

      const result = await createNote(accessToken, parsed);
      addOrReplaceNote(result.note);
      onCreated();
    } catch (caught) {
      if (caught instanceof ApiClientError) {
        setError(caught.message);
        return;
      }

      setError("Check your note and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Leave a note</Text>
          <Text style={styles.subtitle}>Visible within {APP_CONFIG.VISIBILITY_RADIUS_METERS}m</Text>

          <TextInput
            maxLength={APP_CONFIG.MAX_NOTE_LENGTH}
            multiline
            onChangeText={setText}
            placeholder="What would you leave here?"
            placeholderTextColor="#9D968B"
            style={styles.textArea}
            value={text}
          />
          <CharacterCounter value={text} />

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            onChangeText={setLinkUrl}
            placeholder="Optional link"
            placeholderTextColor="#9D968B"
            style={styles.input}
            value={linkUrl}
          />

          <View style={styles.row}>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Post anonymously</Text>
              <Text style={styles.rowBody}>Anonymous to other users, not to the platform.</Text>
            </View>
            <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>

        <View style={styles.actions}>
          <PrimaryButton variant="secondary" onPress={onCancel}>
            Cancel
          </PrimaryButton>
          <PrimaryButton disabled={!canSubmit} loading={loading} onPress={submit}>
            Post
          </PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    paddingBottom: 24
  },
  title: {
    color: "#2D2A26",
    fontSize: 30,
    fontWeight: "900"
  },
  subtitle: {
    color: "#716B63",
    fontSize: 15,
    marginBottom: 18,
    marginTop: 4
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DED8CE",
    borderRadius: 8,
    borderWidth: 1,
    color: "#2D2A26",
    fontSize: 20,
    minHeight: 140,
    padding: 14,
    textAlignVertical: "top"
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DED8CE",
    borderRadius: 8,
    borderWidth: 1,
    color: "#2D2A26",
    fontSize: 16,
    marginTop: 16,
    minHeight: 52,
    paddingHorizontal: 14
  },
  row: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    padding: 16
  },
  rowCopy: {
    flex: 1,
    paddingRight: 12
  },
  rowTitle: {
    color: "#2D2A26",
    fontSize: 16,
    fontWeight: "800"
  },
  rowBody: {
    color: "#716B63",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4
  },
  error: {
    color: "#A64032",
    fontSize: 14,
    marginTop: 12
  },
  actions: {
    gap: 10
  }
});

