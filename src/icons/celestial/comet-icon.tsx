import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * CometIcon — a comet head with a swept tail and sparks.
 */
function CometIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
  return (
    <svg
      ref={ref}
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      {...props}
    >
      {/* Comet head */}
      <circle cx='16.5' cy='7.5' r='3.5' fill={color} stroke='none' />
      {/* Tail */}
      <path d='M14 10 L 4 20' />
      <path d='M16 11 L 9 20' />
      <path d='M12 9 L 3 15' />
    </svg>
  );
}
CometIcon.displayName = 'CometIcon';

export { CometIcon };
