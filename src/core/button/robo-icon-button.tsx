import * as React from 'react';

import { cn } from '@/lib/utils';
import { RoboButton, type RoboButtonProps } from './robo-button';

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

export interface RoboIconButtonProps extends RoboButtonProps {
  /** Accessible label — required for icon-only buttons */
  'aria-label': string;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * RoboIconButton — Square icon-only button.
 *
 * Wraps RoboButton with forced square dimensions and p-0 to accommodate
 * a single icon. aria-label is required for accessibility (WCAG 2.1 AA).
 *
 * @example
 * ```tsx
 * <RoboIconButton aria-label="Close dialog">
 *   <XIcon size={16} />
 * </RoboIconButton>
 * ```
 */
function RoboIconButton({ className, size = 'md', ref, ...props }: RoboIconButtonProps) {
  return (
    <RoboButton
      ref={ref}
      size={size}
      className={cn('p-0 min-w-0', sizeClasses[size ?? 'md'], className)}
      {...props}
    />
  );
}
RoboIconButton.displayName = 'RoboIconButton';

export { RoboIconButton };
