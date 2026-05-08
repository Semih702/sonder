import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";

export function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.logo}>Sonder</Text>
        <Text style={styles.title}>Notes around you</Text>
        <Text style={styles.body}>
          Leave short temporary notes for people physically nearby. Your exact location is never
          shown to other users.
        </Text>
      </View>
      <PrimaryButton onPress={onContinue}>Continue</PrimaryButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center"
  },
  logo: {
    color: "#2D2A26",
    fontSize: 42,
    fontWeight: "900",
    marginBottom: 10
  },
  title: {
    color: "#2D2A26",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10
  },
  body: {
    color: "#625D55",
    fontSize: 17,
    lineHeight: 25
  }
});

