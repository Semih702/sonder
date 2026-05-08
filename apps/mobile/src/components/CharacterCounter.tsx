import { APP_CONFIG } from "@sonder/shared";
import { StyleSheet, Text } from "react-native";

export function CharacterCounter({ value }: { value: string }) {
  const remaining = APP_CONFIG.MAX_NOTE_LENGTH - value.length;
  return <Text style={[styles.text, remaining < 0 && styles.over]}>{remaining}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "#716B63",
    fontSize: 13,
    textAlign: "right"
  },
  over: {
    color: "#A64032"
  }
});

