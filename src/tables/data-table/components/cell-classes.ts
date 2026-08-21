// ---------------------------------------------------------------------------
// Shared cell class helpers for data-table header and body cells.
// Header and row cells share the same alignment and density scale, so these
// live in one place instead of being copy-pasted into table-header/table-row.
// ---------------------------------------------------------------------------

export function getAlignClass(align?: 'left' | 'center' | 'right'): string {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
}

/** Cell padding/font-size for each density level. Comfortable is the historical baseline. */
export function getDensityCellClass(
  density?: 'compact' | 'comfortable' | 'spacious'
): string {
  switch (density) {
    case 'compact':
      return 'px-2 py-1.5 text-xs';
    case 'spacious':
      return 'px-5 py-4 text-base';
    default:
      return 'px-4 py-3 text-sm';
  }
}
