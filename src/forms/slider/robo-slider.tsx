import * as React from 'react';
import { Slider } from 'radix-ui';

import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* RoboSlider                                                             */
/* ------------------------------------------------------------------ */

export interface RoboSliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Slider.Root>,
    'value' | 'defaultValue' | 'onValueChange' | 'min' | 'max' | 'step' | 'onChange'
  > {
  /** Visible label */
  label?: string;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Controlled value (array for single thumb) */
  value?: number[];
  /** Default value (uncontrolled) */
  defaultValue?: number[];
  /** Change handler */
  onChange?: (value: number[]) => void;
  /** Display current value label above the thumb */
  showValue?: boolean;
  /** Format the displayed value */
  formatValue?: (value: number) => string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Disable the slider */
  disabled?: boolean;
  ref?: React.Ref<React.ComponentRef<typeof Slider.Root>>;
}

/**
 * RoboSlider — Accessible range slider built on Radix UI Slider.
 *
 * Track fills with --primary color up to thumb position.
 * Shows value label above thumb when showValue is true.
 * WCAG 2.1 AA: aria-label/aria-labelledby, focus ring, aria-invalid.
 *
 * @example
 * ```tsx
 * <RoboSlider label="Volume" min={0} max={100} defaultValue={[50]} showValue />
 * <RoboSlider label="Price range" min={0} max={1000} step={10} showValue formatValue={(v) => `$${v}`} />
 * ```
 */
function RoboSlider({
  className,
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [0],
  onChange,
  showValue = false,
  formatValue,
  helperText,
  error,
  disabled,
  id: idProp,
  ref,
  ...props
}: RoboSliderProps) {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const labelId = `${id}-label`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const [internalValue, setInternalValue] = React.useState<number[]>(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleValueChange = (vals: number[]) => {
      if (!isControlled) {
        setInternalValue(vals);
      }
      onChange?.(vals);
    };

    const describedByIds: string[] = [];
    if (helperText && !error) describedByIds.push(helperId);
    if (error) describedByIds.push(errorId);

    const displayValue = (v: number) =>
      formatValue ? formatValue(v) : String(v);

    /* Compute thumb offset for floating label (single thumb only) */
    const thumbPercent =
      currentValue.length > 0
        ? ((currentValue[0] - min) / (max - min)) * 100
        : 0;

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {(label || showValue) && (
          <div className='flex items-center justify-between'>
            {label && (
              <label
                id={labelId}
                htmlFor={id}
                className='text-sm font-medium text-[var(--foreground)]'
              >
                {label}
              </label>
            )}
            {showValue && currentValue.length === 1 && (
              <span
                className='text-sm font-medium tabular-nums text-[var(--foreground)]'
                aria-live='polite'
                aria-atomic='true'
              >
                {displayValue(currentValue[0])}
              </span>
            )}
          </div>
        )}

        <Slider.Root
          ref={ref}
          id={id}
          min={min}
          max={max}
          step={step}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onValueChange={handleValueChange}
          disabled={disabled}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={describedByIds.length > 0 ? describedByIds.join(' ') : undefined}
          aria-invalid={error ? true : undefined}
          className='relative flex w-full touch-none select-none items-center'
          {...props}
        >
          {/* Track */}
          <Slider.Track data-slot='slider-track' className='relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--muted)]'>
            {/* Range fill — a subtle leading highlight makes the filled side read
                clearly against the muted empty track. */}
            <Slider.Range className='absolute h-full bg-[linear-gradient(90deg,var(--primary),color-mix(in_oklch,var(--primary)_82%,white))]' />
          </Slider.Track>

          {/* Thumb(s) */}
          {currentValue.map((_, i) => (
            <Slider.Thumb
              key={i}
              data-glow
              data-slot='slider-thumb'
              className={cn(
                'relative block h-5 w-5 rounded-full',
                'border-2 border-[var(--primary)] bg-[var(--background)]',
                'shadow-[var(--shadow-sm)]',
                'transition-colors duration-[var(--duration-fast)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
                'disabled:pointer-events-none disabled:opacity-50'
              )}
              aria-label={label ? `${label} thumb ${i + 1}` : `Slider thumb ${i + 1}`}
            />
          ))}
        </Slider.Root>

        {/* Min / Max labels */}
        <div className='flex justify-between text-xs text-[var(--muted-foreground)]' aria-hidden='true'>
          <span>{displayValue(min)}</span>
          <span>{displayValue(max)}</span>
        </div>

        {error ? (
          <p id={errorId} role='alert' className='text-xs text-[var(--destructive)]'>
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className='text-xs text-[var(--muted-foreground)]'>
            {helperText}
          </p>
        ) : null}
      </div>
    );
}
RoboSlider.displayName = 'RoboSlider';

export { RoboSlider };
