import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StatusBar, StyleSheet, View } from "react-native";
import { ApiClientError } from "@/api/client";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";
import { usePushRegistration } from "@/hooks/usePushRegistration";
import { AgeGateScreen } from "@/screens/AgeGateScreen";
import { CreateNoteScreen } from "@/screens/CreateNoteScreen";
import { InviteCodeScreen } from "@/screens/InviteCodeScreen";
import { LocationPermissionScreen } from "@/screens/LocationPermissionScreen";
import { BasicBlockedOrMaintenanceScreen } from "@/screens/MaintenanceScreen";
import { NearbyFeedScreen } from "@/screens/NearbyFeedScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { TermsPrivacyScreen } from "@/screens/TermsPrivacyScreen";
import { WelcomeScreen } from "@/screens/WelcomeScreen";

type AppScreen =
  | "loading"
  | "welcome"
  | "age"
  | "terms"
  | "invite"
  | "location"
  | "feed"
  | "create"
  | "settings"
  | "maintenance"
  | "blocked";

const inviteOnly = process.env.EXPO_PUBLIC_INVITE_ONLY_MODE !== "false";

export default function App() {
  const bootstrap = useAppBootstrap();
  const [screen, setScreen] = useState<AppScreen>("loading");
  const [authLoading, setAuthLoading] = useState(false);

  usePushRegistration(bootstrap.accessToken);

  useEffect(() => {
    if (bootstrap.step !== "loading") {
      setScreen(bootstrap.step);
    }
  }, [bootstrap.step]);

  async function completeAnonymousAuth(inviteCode?: string) {
    setAuthLoading(true);
    try {
      await bootstrap.createSession({
        acceptedTerms: true,
        acceptedPrivacy: true,
        ageConfirmed: true,
        inviteCode
      });
      setScreen("location");
    } catch (caught) {
      if (caught instanceof ApiClientError && caught.code === "maintenance") {
        setScreen("maintenance");
        return;
      }

      if (caught instanceof ApiClientError && caught.status === 403) {
        setScreen("blocked");
        return;
      }

      Alert.alert("Could not start Sonder", caught instanceof Error ? caught.message : "Try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  if (screen === "loading" || authLoading) {
    return (
      <ScreenContainer>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loading}>
          <ActivityIndicator color="#2D2A26" />
        </View>
      </ScreenContainer>
    );
  }

  if (screen === "welcome") {
    return <WelcomeScreen onContinue={() => setScreen("age")} />;
  }

  if (screen === "age") {
    return (
      <AgeGateScreen
        onConfirm={() => {
          bootstrap.markAgeConfirmed().catch(() => undefined);
          setScreen("terms");
        }}
      />
    );
  }

  if (screen === "terms") {
    return (
      <TermsPrivacyScreen
        onAccept={() => {
          bootstrap.markTermsPrivacyAccepted().catch(() => undefined);
          if (inviteOnly) {
            setScreen("invite");
            return;
          }
          void completeAnonymousAuth();
        }}
      />
    );
  }

  if (screen === "invite") {
    return <InviteCodeScreen onInviteAccepted={(code) => void completeAnonymousAuth(code)} />;
  }

  if (screen === "location") {
    return <LocationPermissionScreen onGranted={() => setScreen("feed")} />;
  }

  if (screen === "create" && bootstrap.accessToken) {
    return (
      <CreateNoteScreen
        accessToken={bootstrap.accessToken}
        onCancel={() => setScreen("feed")}
        onCreated={() => setScreen("feed")}
      />
    );
  }

  if (screen === "settings") {
    return <SettingsScreen onBack={() => setScreen("feed")} />;
  }

  if (screen === "maintenance" || screen === "blocked") {
    return (
      <BasicBlockedOrMaintenanceScreen
        mode={screen}
        onRetry={() => setScreen(bootstrap.accessToken ? "feed" : "welcome")}
      />
    );
  }

  if (!bootstrap.accessToken) {
    return <WelcomeScreen onContinue={() => setScreen("age")} />;
  }

  return (
    <NearbyFeedScreen
      accessToken={bootstrap.accessToken}
      onCreate={() => setScreen("create")}
      onMaintenance={() => setScreen("maintenance")}
      onSettings={() => setScreen("settings")}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  }
});

