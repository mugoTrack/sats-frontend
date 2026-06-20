"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

export interface SystemThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface BrandingCache {
  brandingOrgId: string | null;
  brandingPrimaryColor: string;
  brandingSecondaryColor: string;
  brandingAccentColor: string;
  brandingFontFamily: string;
  brandingLogoUrl: string | null;
}

const defaultSystemThemeColors: SystemThemeColors = {
  primary: "#0f4c5c",
  secondary: "#f7f3e8",
  accent: "#d17a22",
};

const defaultBrandingCache: BrandingCache = {
  brandingOrgId: null,
  brandingPrimaryColor: "",
  brandingSecondaryColor: "",
  brandingAccentColor: "",
  brandingFontFamily: "",
  brandingLogoUrl: null,
};

interface UIState {
  themeMode: ThemeMode;
  systemThemeColors: SystemThemeColors;
  mobileSidebarOpen: boolean;
  branding: BrandingCache;
  /** Session-only blob URL for the logo (not persisted — blob URLs are ephemeral) */
  brandingLogoBlobUrl: string | null;
  setThemeMode: (mode: ThemeMode) => void;
  setSystemThemeColors: (colors: SystemThemeColors) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setBrandingCache: (cache: BrandingCache) => void;
  clearBrandingCache: () => void;
  setBrandingLogoBlobUrl: (url: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      themeMode: "system",
      systemThemeColors: defaultSystemThemeColors,
      mobileSidebarOpen: false,
      branding: defaultBrandingCache,
      brandingLogoBlobUrl: null,
      setThemeMode: (themeMode) => set({ themeMode }),
      setSystemThemeColors: (systemThemeColors) => set({ systemThemeColors }),
      setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
      setBrandingCache: (branding) => set({ branding }),
      clearBrandingCache: () => set({ branding: defaultBrandingCache }),
      setBrandingLogoBlobUrl: (brandingLogoBlobUrl) =>
        set({ brandingLogoBlobUrl }),
    }),
    {
      name: "sats-ui-preferences",
      partialize: (state) => ({
        themeMode: state.themeMode,
        systemThemeColors: state.systemThemeColors,
        branding: state.branding,
      }),
    },
  ),
);
