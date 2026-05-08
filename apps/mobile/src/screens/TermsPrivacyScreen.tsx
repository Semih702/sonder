import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";

export function TermsPrivacyScreen({ onAccept }: { onAccept: () => void }) {
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Before you enter</Text>
        <Text style={styles.copy}>
          Sonder uses your location to show nearby notes. Your exact location is never shown to
          other users.
        </Text>
        <Text style={styles.copy}>
          Anonymous posts are anonymous to other users, not to the platform. Abusive content can be
          reported and moderated.
        </Text>
        <Text style={styles.copy}>
          Sonder can remove content and restrict abusive accounts or devices to keep local spaces
          safer.
        </Text>

        <View style={styles.row}>
          <Text style={styles.rowText}>I accept the Terms of Use.</Text>
          <Switch value={terms} onValueChange={setTerms} />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>I accept the Privacy Policy.</Text>
          <Switch value={privacy} onValueChange={setPrivacy} />
        </View>
      </ScrollView>

      <PrimaryButton disabled={!terms || !privacy} onPress={onAccept}>
        Accept and continue
      </PrimaryButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 24
  },
  title: {
    color: "#2D2A26",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 14
  },
  copy: {
    color: "#625D55",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12
  },
  row: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    padding: 16
  },
  rowText: {
    color: "#2D2A26",
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    paddingRight: 12
  }
});

