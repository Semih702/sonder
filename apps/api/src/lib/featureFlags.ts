import { getEnv } from "./env";

export function getFeatureFlags() {
  const env = getEnv();

  return {
    inviteOnlyMode: env.INVITE_ONLY_MODE,
    postingEnabled: env.POSTING_ENABLED,
    pushNotificationsEnabled: env.PUSH_NOTIFICATIONS_ENABLED,
    maintenanceMode: env.MAINTENANCE_MODE,
    adminDashboardEnabled: env.ADMIN_DASHBOARD_ENABLED
  };
}

