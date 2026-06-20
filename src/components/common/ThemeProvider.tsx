"use client";

import { useEffect } from "react";

import { useUIStore } from "@/store/useUIStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useUIStore((state) => state.themeMode);
  const systemThemeColors = useUIStore((state) => state.systemThemeColors);
  const branding = useUIStore((state) => state.branding);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = themeMode;

    if (themeMode === "system") {
      root.style.setProperty("--system-primary", systemThemeColors.primary);
      root.style.setProperty("--system-secondary", systemThemeColors.secondary);
      root.style.setProperty("--system-accent", systemThemeColors.accent);
    } else {
      root.style.removeProperty("--system-primary");
      root.style.removeProperty("--system-secondary");
      root.style.removeProperty("--system-accent");
    }

    // Apply branding font family if set
    if (branding.brandingFontFamily) {
      root.style.setProperty("--branding-font", branding.brandingFontFamily);
    } else {
      root.style.removeProperty("--branding-font");
    }
  }, [themeMode, systemThemeColors, branding.brandingFontFamily]);

  return children;
}
