import { useEffect, useState } from "react";
import { hasForegroundLocationPermission } from "@/utils/permissions";
import { useAuthSession } from "./useAuthSession";

export type BootstrapStep = "loading" | "welcome" | "location" | "feed";

export function useAppBootstrap() {
  const auth = useAuthSession();
  const [step, setStep] = useState<BootstrapStep>("loading");

  useEffect(() => {
    let mounted = true;

    async function run() {
      const hasSession = await auth.restoreSession();
      if (!mounted) {
        return;
      }

      if (!hasSession) {
        setStep("welcome");
        return;
      }

      setStep((await hasForegroundLocationPermission()) ? "feed" : "location");
    }

    run().catch(() => {
      if (mounted) {
        setStep("welcome");
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    ...auth,
    step,
    setStep
  };
}

