import { create } from "zustand";

type SessionState = {
  accessToken?: string;
  userId?: string;
  displayName: string;
  setSession: (session: { accessToken: string; userId: string; displayName: string }) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  displayName: "User",
  setSession: (session) => set(session),
  clearSession: () => set({ accessToken: undefined, userId: undefined, displayName: "User" })
}));

