import * as React from 'react';

import {
  RoboDescriptionList,
  formatKey,
  formatValue,
} from '@/core/description-list/robo-description-list';

// Re-exported for back-compat — these helpers originated here before being
// promoted into the RoboDescriptionList primitive.
export { formatKey, formatValue };

export interface RoboDossierPropertyGridProps {
  properties: Record<string, unknown>;
  className?: string;
  ref?: React.Ref<HTMLDListElement>;
}

/**
 * RoboDossierPropertyGrid — a 2-column key/value grid for rendering
 * arbitrary entity properties inside the RoboEntityDossier.
 *
 * A thin wrapper around the RoboDescriptionList primitive (grid layout) that
 * adds the dossier's empty state. snake_case and kebab-case keys are
 * automatically converted to Title Case.
 *
 * @example
 * ```tsx
 * <RoboDossierPropertyGrid properties={entity.properties} />
 * ```
 */
function RoboDossierPropertyGrid({ properties, className, ref }: RoboDossierPropertyGridProps) {
  if (Object.keys(properties).length === 0) {
    return (
      <p className='text-xs text-[var(--muted-foreground)] italic'>
        No properties available.
      </p>
    );
  }

  return (
    <RoboDescriptionList
      ref={ref}
      data-slot='property-grid'
      layout='grid'
      items={properties}
      className={className}
    />
  );
}
RoboDossierPropertyGrid.displayName = 'RoboDossierPropertyGrid';

export { RoboDossierPropertyGrid };
