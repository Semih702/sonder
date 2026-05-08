import type { ReactNode } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

export function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F6F2"
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16
  }
});

