'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { RoboButtonProps } from '@/core/button/robo-button';
import { RoboActionButton } from '@/core/action-button/robo-action-button';

export interface RoboCopyButtonProps
  extends Omit<RoboButtonProps, 'children' | 'onClick'> {
  /** The text to copy to the clipboard */
  value: string;
  /** Button label and tooltip in idle state. Default: 'Copy' */
  label?: string;
  /** Label shown after a successful copy. Default: 'Copied!' */
  successLabel?: string;
  /** Icon-only square button — no visible text label. Default: false */
  iconOnly?: boolean;
  /** How long (ms) to show the success state before resetting. Default: 2000 */
  resetDelay?: number;
  /** Called after the text is successfully written to the clipboard */
  onCopy?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

type CopyStatus = 'idle' | 'success' | 'error';

function RoboCopyButton({
  value,
  label = 'Copy',
  successLabel = 'Copied!',
  iconOnly = false,
  resetDelay = 2000,
  onCopy,
  className,
  size = 'sm',
  variant = 'ghost',
  ref,
  ...props
}: RoboCopyButtonProps) {
  const [status, setStatus] = React.useState<CopyStatus>('idle');
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

    const handleCopy = React.useCallback(async () => {
      try {
        await navigator.clipboard.writeText(value);
        setStatus('success');
        onCopy?.();
      } catch {
        setStatus('error');
      }
      timerRef.current = setTimeout(() => setStatus('idle'), resetDelay);
    }, [value, onCopy, resetDelay]);

    const isSuccess = status === 'success';
    const currentLabel = isSuccess ? successLabel : label;
    const icon = isSuccess
      ? <Check className='h-3.5 w-3.5' aria-hidden='true' />
      : <Copy className='h-3.5 w-3.5' aria-hidden='true' />;

    return (
      <>
        <RoboActionButton
          ref={ref}
          icon={icon}
          label={currentLabel}
          iconOnly={iconOnly}
          size={size}
          variant={variant}
          onClick={handleCopy}
          data-slot='copy-button'
          className={cn(isSuccess && 'text-[var(--success-text)]', className)}
          {...props}
        />
        <span
          aria-live='polite'
          aria-atomic='true'
          className='sr-only'
        >
          {isSuccess ? currentLabel : ''}
        </span>
      </>
  );
}
RoboCopyButton.displayName = 'RoboCopyButton';

export { RoboCopyButton };
