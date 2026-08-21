import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * TelescopeIcon — a tripod-mounted refractor tube angled at the sky.
 */
function TelescopeIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
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
      {/* Tube */}
      <path d='M3 13 L 15 6 L 17 9.5 L 5 16.5 Z' />
      {/* Aperture end cap */}
      <line x1='15' y1='6' x2='17' y2='9.5' />
      {/* Tripod legs */}
      <path d='M9 13 L 7 21' />
      <path d='M11 12 L 13 21' />
      {/* Mount pivot */}
      <circle cx='10' cy='12.5' r='1' fill={color} stroke='none' />
    </svg>
  );
}
TelescopeIcon.displayName = 'TelescopeIcon';

export { TelescopeIcon };
