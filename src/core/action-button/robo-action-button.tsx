'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { RoboButton, type RoboButtonProps } from '@/core/button/robo-button';
import { RoboIconButton } from '@/core/button/robo-icon-button';
import {
  RoboTooltip,
  RoboTooltipContent,
  RoboTooltipProvider,
  RoboTooltipTrigger,
} from '@/feedback/tooltip/robo-tooltip';

export interface RoboActionButtonProps
  extends Omit<RoboButtonProps, 'children' | 'onClick'> {
  /** The icon rendered inside the button. */
  icon: React.ReactNode;
  /** Button label — used as visible text (non-iconOnly) and tooltip. */
  label: string;
  /** Override tooltip text when it should differ from `label`. */
  tooltipText?: string;
  /** Icon-only square button — no visible text label. Default: false */
  iconOnly?: boolean;
  /** Click handler. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Semantic slot identifier for testing/styling hooks. */
  'data-slot'?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

function RoboActionButton({
  icon,
  label,
  tooltipText,
  iconOnly = false,
  onClick,
  className,
  size = 'sm',
  variant = 'ghost',
  'data-slot': dataSlot,
  ref,
  ...props
}: RoboActionButtonProps) {
  const tooltip = tooltipText ?? label;

  return (
      <RoboTooltipProvider>
        <RoboTooltip>
          <RoboTooltipTrigger asChild>
            {iconOnly ? (
              <RoboIconButton
                ref={ref}
                size={size}
                variant={variant}
                aria-label={tooltip}
                onClick={onClick}
                data-slot={dataSlot}
                className={cn(className)}
                {...props}
              >
                {icon}
              </RoboIconButton>
            ) : (
              <RoboButton
                ref={ref}
                size={size}
                variant={variant}
                onClick={onClick}
                data-slot={dataSlot}
                className={cn(className)}
                {...props}
              >
                {icon}
                {label}
              </RoboButton>
            )}
          </RoboTooltipTrigger>
          <RoboTooltipContent>{tooltip}</RoboTooltipContent>
        </RoboTooltip>
      </RoboTooltipProvider>
  );
}
RoboActionButton.displayName = 'RoboActionButton';

export { RoboActionButton };
