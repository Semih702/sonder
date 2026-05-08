import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export function PermissionCard({
  title,
  body,
  children
}: {
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  title: {
    color: "#2D2A26",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8
  },
  body: {
    color: "#625D55",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 18
  }
});

