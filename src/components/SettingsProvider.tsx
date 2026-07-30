"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { SiteSettings } from "@/lib/settings-api";
import { defaultSettings } from "@/lib/settings-api";

interface SettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings(),
  loading: true,
});

export function useSettings() {
  return useContext(SettingsContext);
}

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          setSettings(await res.json());
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}
