import * as SecureStore from "expo-secure-store";
import type { AnonymousAuthInput } from "@sonder/shared";
import { createAnonymousSession } from "@/api/authApi";
import { useSessionStore } from "@/store/useSessionStore";

const TOKEN_KEY = "sonder.accessToken";
const USER_ID_KEY = "sonder.userId";
const DISPLAY_NAME_KEY = "sonder.displayName";
const AGE_KEY = "sonder.ageConfirmed";
const TERMS_KEY = "sonder.termsAccepted";
const PRIVACY_KEY = "sonder.privacyAccepted";

export function useAuthSession() {
  const { accessToken, userId, displayName, setSession, clearSession } = useSessionStore();

  async function restoreSession() {
    const [storedToken, storedUserId, storedDisplayName] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(USER_ID_KEY),
      SecureStore.getItemAsync(DISPLAY_NAME_KEY)
    ]);

    if (storedToken && storedUserId) {
      setSession({
        accessToken: storedToken,
        userId: storedUserId,
        displayName: storedDisplayName ?? "User"
      });
      return true;
    }

    return false;
  }

  async function createSession(input: AnonymousAuthInput) {
    const session = await createAnonymousSession(input);

    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, session.accessToken),
      SecureStore.setItemAsync(USER_ID_KEY, session.userId),
      SecureStore.setItemAsync(DISPLAY_NAME_KEY, session.displayName)
    ]);

    setSession(session);
    return session;
  }

  async function markAgeConfirmed() {
    await SecureStore.setItemAsync(AGE_KEY, "true");
  }

  async function markTermsPrivacyAccepted() {
    await Promise.all([
      SecureStore.setItemAsync(TERMS_KEY, "true"),
      SecureStore.setItemAsync(PRIVACY_KEY, "true")
    ]);
  }

  async function getOnboardingState() {
    const [ageConfirmed, termsAccepted, privacyAccepted] = await Promise.all([
      SecureStore.getItemAsync(AGE_KEY),
      SecureStore.getItemAsync(TERMS_KEY),
      SecureStore.getItemAsync(PRIVACY_KEY)
    ]);

    return {
      ageConfirmed: ageConfirmed === "true",
      termsAccepted: termsAccepted === "true",
      privacyAccepted: privacyAccepted === "true"
    };
  }

  async function signOut() {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_ID_KEY),
      SecureStore.deleteItemAsync(DISPLAY_NAME_KEY)
    ]);
    clearSession();
  }

  return {
    accessToken,
    userId,
    displayName,
    restoreSession,
    createSession,
    getOnboardingState,
    markAgeConfirmed,
    markTermsPrivacyAccepted,
    signOut
  };
}

