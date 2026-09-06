'use client';

import * as React from 'react';

import { RoboThemeProvider } from '@/core/providers/robo-theme-provider';
import type { RoboThemeConfig } from '@/core/providers/robo-theme-shared';
import { RoboDensityProvider } from '@/core/providers/robo-density-provider';
import { RoboDateFormatProvider } from '@/core/providers/robo-date-format-provider';
import { RoboFontFamilyProvider } from '@/core/providers/robo-font-family-provider';

// ---------------------------------------------------------------------------
// RoboAppProviders
// ---------------------------------------------------------------------------

export interface RoboAppProvidersProps {
  children: React.ReactNode;
  /**
   * Theme config (storageKey, defaultTheme, defaultMode) spread into
   * RoboThemeProvider. Pass the SAME object to getRoboThemeScript in your root
   * layout so the pre-paint script and this provider cannot disagree.
   */
  theme?: RoboThemeConfig;
}

/**
 * The default provider stack every app built on this library needs: color theme
 * + light/dark mode, density, date format, and font family. Each persists to
 * localStorage by default, so a choice made in `RoboSettingsView` survives a
 * reload. Mount this once near the root, then render `RoboSettingsView` anywhere
 * beneath it.
 *
 * Heavier, opt-in providers (glass/surface style, keybinds, product tours) are
 * intentionally NOT included here - add them yourself only if the app uses them.
 */
export function RoboAppProviders({ children, theme }: RoboAppProvidersProps) {
  return (
    <RoboThemeProvider {...theme}>
      <RoboDensityProvider>
        <RoboDateFormatProvider>
          <RoboFontFamilyProvider>{children}</RoboFontFamilyProvider>
        </RoboDateFormatProvider>
      </RoboDensityProvider>
    </RoboThemeProvider>
  );
}

RoboAppProviders.displayName = 'RoboAppProviders';
