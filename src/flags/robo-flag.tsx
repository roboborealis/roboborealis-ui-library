import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { FLAG_MAP } from './flag-data';
import { FLAG_URLS } from './flag-urls';

/* ------------------------------------------------------------------ */
/* Variants                                                             */
/* ------------------------------------------------------------------ */

export const flagVariants = cva('inline-block object-cover flex-shrink-0', {
  variants: {
    size: {
      xs: 'h-4 w-6',
      sm: 'h-5 w-7',
      md: 'h-6 w-9',
      lg: 'h-8 w-12',
    },
    rounded: {
      true: 'rounded-sm',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    rounded: true,
  },
});

/* ------------------------------------------------------------------ */
/* Props                                                                */
/* ------------------------------------------------------------------ */

export interface RoboFlagProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'children'>,
    VariantProps<typeof flagVariants> {
  /** ISO 3166-1 alpha-2 country code (e.g. 'us', 'gb'). Case-insensitive. */
  code: string;
  /** Show rounded corners. Default: true. */
  rounded?: boolean;
  ref?: React.Ref<HTMLImageElement>;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

/**
 * RoboFlag — Renders a country flag icon by ISO alpha-2 code.
 *
 * @example
 * <RoboFlag code="us" size="md" />
 * <RoboFlag code="gb" size="lg" rounded={false} />
 */
function RoboFlag({ code, size, rounded, className, alt, ref, ...props }: RoboFlagProps) {
  const normalized = (code ?? '').toLowerCase();
  const entry = FLAG_MAP[normalized];
  const src = FLAG_URLS[normalized];

  if (!src) {
    // Render an empty placeholder when the code is unknown
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        aria-label={alt ?? `Unknown flag: ${code}`}
        role="img"
        className={cn(
          flagVariants({ size, rounded }),
          'bg-[var(--muted)] border border-[var(--border)]',
          className
        )}
      />
    );
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt ?? (entry?.label ?? normalized)}
      role="img"
      className={cn(flagVariants({ size, rounded }), className)}
      {...props}
    />
  );
}
RoboFlag.displayName = 'RoboFlag';

export { RoboFlag };
