import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, AppState, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { APP_CONFIG } from "@sonder/shared";
import { ApiClientError } from "@/api/client";
import { fetchNearbyNotes } from "@/api/notesApi";
import { sendPresenceHeartbeat } from "@/api/presenceApi";
import { EmptyState } from "@/components/EmptyState";
import { NoteCard } from "@/components/NoteCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useNotesStore } from "@/store/useNotesStore";

type Props = {
  accessToken: string;
  onCreate: () => void;
  onMaintenance: () => void;
  onSettings: () => void;
};

export function NearbyFeedScreen({ accessToken, onCreate, onMaintenance, onSettings }: Props) {
  const { notes, setNotes } = useNotesStore();
  const { requestLocation } = useCurrentLocation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    setError(undefined);
    const location = await requestLocation();
    if (!location) {
      setError("Location permission is needed to show notes around you.");
      return;
    }

    await sendPresenceHeartbeat(accessToken, location);
    const result = await fetchNearbyNotes(accessToken, location);
    setNotes(result.notes);
  }, [accessToken, requestLocation, setNotes]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await refresh();
    } catch (caught) {
      if (caught instanceof ApiClientError && caught.code === "maintenance") {
        onMaintenance();
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not load nearby notes.");
    } finally {
      setLoading(false);
    }
  }, [onMaintenance, refresh]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void load();
      }
    });

    return () => subscription.remove();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not refresh notes.");
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Sonder</Text>
          <Text style={styles.subtitle}>
            Notes around you · Within {APP_CONFIG.VISIBILITY_RADIUS_METERS}m
          </Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onSettings} style={styles.settingsButton}>
          <Text style={styles.settingsText}>Settings</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#2D2A26" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={notes.length === 0 ? styles.emptyList : styles.list}
          data={notes}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyState />}
          ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : null}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => <NoteCard accessToken={accessToken} note={item} />}
        />
      )}

      <View style={styles.footer}>
        <PrimaryButton onPress={onCreate}>Leave a note</PrimaryButton>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18
  },
  logo: {
    color: "#2D2A26",
    fontSize: 30,
    fontWeight: "900"
  },
  subtitle: {
    color: "#716B63",
    fontSize: 14,
    marginTop: 2
  },
  settingsButton: {
    backgroundColor: "#E9E5DD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  settingsText: {
    color: "#2D2A26",
    fontSize: 13,
    fontWeight: "800"
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  list: {
    paddingBottom: 96
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 96
  },
  error: {
    color: "#A64032",
    fontSize: 14,
    marginBottom: 12
  },
  footer: {
    bottom: 16,
    left: 20,
    position: "absolute",
    right: 20
  }
});

