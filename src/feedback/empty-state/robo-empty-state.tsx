'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: '[&_.robo-empty-state-svg]:w-24',
        md: '[&_.robo-empty-state-svg]:w-32',
        lg: '[&_.robo-empty-state-svg]:w-48',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

// ---------------------------------------------------------------------------
// Galaxy SVG — a spiral galaxy in empty space (the "nothing here" illustration).
// Unified light/dark via CSS variables.
// ---------------------------------------------------------------------------

function GalaxyIcon() {
  const core = `robo-empty-galaxy-core-${React.useId().replace(/:/g, '')}`;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" fill="none">
      <defs>
        <radialGradient id={core}>
          <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="var(--primary)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Faint galactic disc */}
      <ellipse cx="100" cy="75" rx="64" ry="26" fill="var(--primary)" opacity="0.12" transform="rotate(-24 100 75)" />
      {/* Two spiral arms as dotted curves */}
      <path
        d="M100 75 C 130 62, 150 66, 158 82"
        fill="none" stroke="var(--muted-foreground)" strokeWidth="2"
        strokeDasharray="1.5 5" strokeLinecap="round" opacity="0.7" transform="rotate(-24 100 75)"
      />
      <path
        d="M100 75 C 70 88, 50 84, 42 68"
        fill="none" stroke="var(--muted-foreground)" strokeWidth="2"
        strokeDasharray="1.5 5" strokeLinecap="round" opacity="0.7" transform="rotate(-24 100 75)"
      />
      {/* Glowing core */}
      <circle cx="100" cy="75" r="20" fill={`url(#${core})`} />
      <circle cx="100" cy="75" r="4" fill="var(--foreground)" />

      {/* Scattered stars across empty space */}
      <g fill="var(--muted-foreground)">
        <circle cx="34" cy="28" r="1.8" />
        <circle cx="168" cy="34" r="1.4" />
        <circle cx="150" cy="120" r="1.8" />
        <circle cx="52" cy="118" r="1.4" />
        <circle cx="24" cy="86" r="1.2" />
        <circle cx="182" cy="96" r="1.2" />
        <circle cx="118" cy="20" r="1.2" />
      </g>
      {/* A couple of brighter 4-point stars */}
      <g fill="var(--foreground)" opacity="0.85">
        <path d="M60 40 l1.4 4 4 1.4 -4 1.4 -1.4 4 -1.4 -4 -4 -1.4 4 -1.4 z" />
        <path d="M158 60 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1 z" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface RoboEmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof emptyStateVariants> {
  /** Accessible label. Default: "No data available". */
  label?: string;
  ref?: React.Ref<HTMLDivElement>;
}

// ---------------------------------------------------------------------------
// RoboEmptyState
// ---------------------------------------------------------------------------

/**
 * RoboEmptyState — branded empty state illustration.
 *
 * A spiral galaxy in empty space, used as the default empty state
 * indicator for tables, lists, and search results. Colors adapt automatically
 * to the active theme via CSS variables.
 *
 * @example
 * ```tsx
 * <RoboEmptyState />
 * <RoboEmptyState size="lg" label="No missions found" />
 * ```
 */
function RoboEmptyState({ className, size, label, ref, ...props }: RoboEmptyStateProps) {
  return (
    <div
      ref={ref}
      role="img"
      aria-label={label ?? 'No data available'}
      className={cn(emptyStateVariants({ size }), className)}
      {...props}
    >
      <div className="robo-empty-state-svg" aria-hidden="true">
        <GalaxyIcon />
      </div>
    </div>
  );
}
RoboEmptyState.displayName = 'RoboEmptyState';

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { RoboEmptyState, emptyStateVariants };
