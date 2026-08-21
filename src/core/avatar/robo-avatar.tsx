import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { RoboFadeIn } from '@/animations';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface RoboAvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  /** Image URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Fallback initials (1–2 chars) when image is unavailable */
  fallback?: string;
  /** Status indicator dot */
  status?: 'online' | 'away' | 'busy' | 'offline';
  /** Fade avatar in on mount. Default: false */
  animateEntrance?: boolean;
  ref?: React.Ref<React.ComponentRef<typeof AvatarPrimitive.Root>>;
}

const statusColors: Record<NonNullable<RoboAvatarProps['status']>, string> = {
  online: 'bg-[var(--success)]',
  away: 'bg-[var(--warning)]',
  busy: 'bg-[var(--destructive)]',
  offline: 'bg-[var(--muted)]',
};

const statusLabels: Record<NonNullable<RoboAvatarProps['status']>, string> = {
  online: 'Online',
  away: 'Away',
  busy: 'Busy',
  offline: 'Offline',
};

/**
 * RoboAvatar — circular avatar with image support, initials fallback, and status dot.
 *
 * @example
 * ```tsx
 * <RoboAvatar src="/user.jpg" alt="John Doe" fallback="JD" />
 * <RoboAvatar fallback="MT" size="lg" status="online" />
 * <RoboAvatar fallback="?" size="sm" />
 * ```
 */
function RoboAvatar({ className, size, src, alt, fallback, status, animateEntrance = false, ref, ...props }: RoboAvatarProps) {
  const avatar = (
    <span className='relative inline-flex'>
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {/* Always render Image so Radix fallback state machine activates correctly.
            When src is undefined, the image fails immediately → Fallback shows. */}
        <AvatarPrimitive.Image
          src={src}
          alt={alt ?? fallback ?? 'Avatar'}
          className='aspect-square h-full w-full object-cover'
        />
        <AvatarPrimitive.Fallback
          className='flex h-full w-full items-center justify-center rounded-full bg-[var(--muted)] text-[var(--foreground)] font-semibold uppercase select-none'
          delayMs={src ? 600 : 0}
        >
          {fallback ? fallback.substring(0, 2) : '?'}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>

      {status && (
        <span
          role="img"
          aria-label={statusLabels[status]}
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-[var(--background)]',
            statusColors[status],
            size === 'xs' && 'h-1.5 w-1.5',
            size === 'sm' && 'h-2 w-2',
            (size === 'md' || !size) && 'h-2.5 w-2.5',
            size === 'lg' && 'h-3 w-3',
            size === 'xl' && 'h-3.5 w-3.5'
          )}
        />
      )}
    </span>
  );

  return animateEntrance ? <RoboFadeIn preset='subtle'>{avatar}</RoboFadeIn> : avatar;
}
RoboAvatar.displayName = 'RoboAvatar';

/** Stack multiple avatars with overlap */
export interface RoboAvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to show before "+N" overflow */
  max?: number;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

function RoboAvatarGroup({ className, max = 5, children, ref, ...props }: RoboAvatarGroupProps) {
  const avatars = React.Children.toArray(children);
    const visible = max ? avatars.slice(0, max) : avatars;
    const overflow = avatars.length - visible.length;

    return (
      <div
        ref={ref}
        className={cn('flex items-center -space-x-2', className)}
        {...props}
      >
        {visible.map((child, i) => (
          <span
            key={i}
            className='ring-2 ring-[var(--background)] rounded-full inline-flex'
          >
            {child}
          </span>
        ))}
        {overflow > 0 && (
          <span
            aria-label={`${overflow} more`}
            className='relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--background)] bg-[var(--muted)] text-[var(--secondary-text)] text-xs font-semibold items-center justify-center'
          >
            +{overflow}
          </span>
        )}
      </div>
    );
}
RoboAvatarGroup.displayName = 'RoboAvatarGroup';

export { RoboAvatar, RoboAvatarGroup, avatarVariants };
