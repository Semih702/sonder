import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";

export function AgeGateScreen({ onConfirm }: { onConfirm: () => void }) {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Age confirmation</Text>
        <Text style={styles.body}>
          Sonder is not for children. By continuing, you confirm you are old enough to use this app
          in your region.
        </Text>
      </View>
      <PrimaryButton onPress={onConfirm}>I confirm</PrimaryButton>
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

