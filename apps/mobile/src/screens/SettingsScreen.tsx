import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { APP_CONFIG } from "@sonder/shared";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";

const supportEmail = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? "support@example.com";

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.item}>Notes expire after {APP_CONFIG.NOTE_TTL_HOURS} hours</Text>
          <Text style={styles.item}>Visible within {APP_CONFIG.VISIBILITY_RADIUS_METERS} meters</Text>
          <Text style={styles.item}>Your exact location is never shown to other users.</Text>
          <Text style={styles.item}>
            Presence only shows whether a note owner is still nearby. It never shows exact location.
          </Text>
        </View>

        <View style={styles.section}>
          <Pressable
            onPress={() => Alert.alert("Terms of Use", "Add the production Terms of Use URL before store submission.")}
            style={styles.linkRow}
          >
            <Text style={styles.linkText}>Terms of Use</Text>
          </Pressable>
          <Pressable
            onPress={() => Alert.alert("Privacy Policy", "Add the production Privacy Policy URL before store submission.")}
            style={styles.linkRow}
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL(`mailto:${supportEmail}`).catch(() => undefined)}
            style={styles.linkRow}
          >
            <Text style={styles.linkText}>Contact support</Text>
          </Pressable>
        </View>
      </ScrollView>

      <PrimaryButton onPress={onBack}>Done</PrimaryButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24
  },
  title: {
    color: "#2D2A26",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 14,
    padding: 16
  },
  item: {
    color: "#3F3A34",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 12
  },
  linkRow: {
    minHeight: 46,
    justifyContent: "center"
  },
  linkText: {
    color: "#24443B",
    fontSize: 16,
    fontWeight: "800"
  }
});

