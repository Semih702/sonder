import type { LinkType } from "@sonder/shared";
import { Linking, Pressable, StyleSheet, Text } from "react-native";

const labels: Record<LinkType, string> = {
  youtube: "YouTube link",
  spotify: "Spotify link",
  generic: "Open link"
};

export function LinkPreview({ linkUrl, linkType }: { linkUrl: string; linkType: LinkType }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => {
        Linking.openURL(linkUrl).catch(() => undefined);
      }}
      style={styles.container}
    >
      <Text style={styles.text}>{labels[linkType]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2F1",
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  text: {
    color: "#24443B",
    fontSize: 14,
    fontWeight: "700"
  }
});

