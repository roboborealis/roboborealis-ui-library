'use client';

import * as React from 'react';
import { Printer } from 'lucide-react';

import type { RoboButtonProps } from '@/core/button/robo-button';
import { RoboActionButton } from '@/core/action-button/robo-action-button';

export interface RoboPrintButtonProps
  extends Omit<RoboButtonProps, 'children' | 'onClick'> {
  /**
   * Ref to the element whose content will be printed.
   * If both `targetRef` and `targetSelector` are provided, `targetRef` wins.
   */
  targetRef?: React.RefObject<HTMLElement | null>;
  /**
   * CSS selector for the element to print.
   * Falls back to `window.print()` if the selector matches nothing.
   */
  targetSelector?: string;
  /** Title used in the print window's `<title>` tag. Default: document title */
  pageTitle?: string;
  /** Button label and tooltip. Default: 'Print' */
  label?: string;
  /** Icon-only square button — no visible text label. Default: false */
  iconOnly?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * RoboPrintButton — opens an isolated print window for a target element.
 *
 * Copies all stylesheet `<link>` and `<style>` tags from the current page
 * into the print window so styles render correctly, then calls `print()`
 * after a brief delay for the styles to load.
 *
 * Falls back to `window.print()` when no target is specified.
 *
 * @example
 * ```tsx
 * const tableRef = React.useRef<HTMLDivElement>(null);
 *
 * <div ref={tableRef}>
 *   <RoboDataTable ... />
 * </div>
 * <RoboPrintButton targetRef={tableRef} label="Print table" />
 *
 * // Icon only
 * <RoboPrintButton targetRef={tableRef} label="Print table" iconOnly />
 * ```
 */
function RoboPrintButton({
  targetRef,
  targetSelector,
  pageTitle,
  label = 'Print',
  iconOnly = false,
  className,
  size = 'sm',
  variant = 'ghost',
  ref,
  ...props
}: RoboPrintButtonProps) {
    const handlePrint = React.useCallback(() => {
      // Resolve the target element
      let target: HTMLElement | null = null;
      if (targetRef?.current) {
        target = targetRef.current;
      } else if (targetSelector) {
        target = document.querySelector<HTMLElement>(targetSelector);
      }

      if (!target) {
        window.print();
        return;
      }

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        window.print();
        return;
      }

      const title = pageTitle ?? document.title;
      printWindow.document.title = title;

      // Copy stylesheet <link> elements
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]').forEach((link) => {
        const clone = printWindow.document.createElement('link');
        clone.rel = 'stylesheet';
        clone.href = link.href;
        printWindow.document.head.appendChild(clone);
      });

      // Copy inline <style> elements
      document.querySelectorAll('style').forEach((style) => {
        const clone = printWindow.document.createElement('style');
        clone.textContent = style.textContent;
        printWindow.document.head.appendChild(clone);
      });

      // Add minimal print reset
      const printStyle = printWindow.document.createElement('style');
      printStyle.textContent = '@media print { body { margin: 0; } }';
      printWindow.document.head.appendChild(printStyle);

      // Clone the target element into the print body
      const contentClone = target.cloneNode(true) as HTMLElement;
      printWindow.document.body.appendChild(contentClone);

      // Small delay to let stylesheets load before triggering print dialog
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 250);
    }, [targetRef, targetSelector, pageTitle]);

    const icon = <Printer className='h-3.5 w-3.5' aria-hidden='true' />;

    return (
      <RoboActionButton
        ref={ref}
        icon={icon}
        label={label}
        iconOnly={iconOnly}
        size={size}
        variant={variant}
        onClick={handlePrint}
        data-slot='print-button'
        className={className}
        {...props}
      />
  );
}
RoboPrintButton.displayName = 'RoboPrintButton';

export { RoboPrintButton };
