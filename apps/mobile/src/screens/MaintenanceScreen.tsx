import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";

type Props = {
  onRetry: () => void;
  mode?: "maintenance" | "blocked";
};

export function BasicBlockedOrMaintenanceScreen({ onRetry, mode = "maintenance" }: Props) {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>{mode === "blocked" ? "Access paused" : "Sonder is paused"}</Text>
        <Text style={styles.body}>
          {mode === "blocked"
            ? "This account or device cannot currently use Sonder."
            : "Sonder is temporarily unavailable. Please try again soon."}
        </Text>
      </View>
      <PrimaryButton onPress={onRetry}>Try again</PrimaryButton>
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
    fontSize: 17,
    lineHeight: 25
  }
});

