/**
 * Canonical "panel surface" recipe shared by overlay panels (`RoboQuickPanel`,
 * animated panel transitions) so the glass look reads identically everywhere
 * rather than each component inventing its own opacity/blur values.
 *
 * Intentionally excludes border-radius and positioning — those vary per
 * component and stay with each caller.
 */

/** Translucent, blurred glass surface — the "Apple Liquid Glass"-adjacent look. */
export const GLASS_SURFACE_CLASSES =
  'bg-[var(--popover)]/35 backdrop-blur-2xl backdrop-saturate-150 border-[var(--border)]/40 ' +
  'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),inset_0_0_0_1px_rgba(255,255,255,0.04),var(--shadow-lg)] ' +
  'text-[var(--popover-foreground)]';

/** Solid, opaque surface — the default when glass mode is off. */
export const SOLID_SURFACE_CLASSES =
  'bg-[var(--card)] border border-[var(--border)] shadow-[var(--shadow-lg)] text-[var(--card-foreground)]';

/** Returns the glass or solid surface classes for the given effective setting. */
export function getPanelSurfaceClasses(glass: boolean): string {
  return glass ? GLASS_SURFACE_CLASSES : SOLID_SURFACE_CLASSES;
}
