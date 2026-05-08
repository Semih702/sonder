import { StyleSheet, View } from "react-native";

export function PresenceDot({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }

  return <View accessibilityLabel="Presence nearby" style={styles.dot} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#32A852"
  }
});

