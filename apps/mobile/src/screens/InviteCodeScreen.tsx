import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ApiClientError } from "@/api/client";
import { verifyInviteCode } from "@/api/inviteApi";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";

export function InviteCodeScreen({ onInviteAccepted }: { onInviteAccepted: (code: string) => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function submit() {
    setLoading(true);
    setError(undefined);

    try {
      const result = await verifyInviteCode(code.trim());
      if (!result.usable) {
        setError("That invite code is not available.");
        return;
      }

      onInviteAccepted(code.trim());
    } catch (caught) {
      setError(caught instanceof ApiClientError ? caught.message : "Could not verify invite code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Invite-only beta</Text>
        <Text style={styles.body}>
          Sonder is starting small so moderation, safety, and reliability can be checked before a
          wider launch.
        </Text>
        <TextInput
          autoCapitalize="characters"
          autoCorrect={false}
          onChangeText={setCode}
          placeholder="Invite code"
          placeholderTextColor="#9D968B"
          style={styles.input}
          value={code}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <PrimaryButton disabled={!code.trim()} loading={loading} onPress={submit}>
        Verify invite
      </PrimaryButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center"
  },
  title: {
    color: "#2D2A26",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12
  },
  body: {
    color: "#625D55",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DED8CE",
    borderRadius: 8,
    borderWidth: 1,
    color: "#2D2A26",
    fontSize: 18,
    minHeight: 52,
    paddingHorizontal: 14
  },
  error: {
    color: "#A64032",
    fontSize: 14,
    marginTop: 12
  }
});

