import { StyleSheet, Text, View } from "react-native";

export function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No notes around you yet.</Text>
      <Text style={styles.body}>Be the first to leave one.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  title: {
    color: "#2D2A26",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6
  },
  body: {
    color: "#716B63",
    fontSize: 15
  }
});

