import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * RocketIcon — an upright rocket with nose cone, fins, and an exhaust plume.
 */
function RocketIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
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
      {/* Fuselage + nose cone */}
      <path d='M12 2 C 15 5, 16 10, 16 14 L 8 14 C 8 10, 9 5, 12 2 Z' />
      {/* Window */}
      <circle cx='12' cy='9' r='1.6' fill={color} stroke='none' />
      {/* Fins */}
      <path d='M8 13 L 5 17 L 8 16 Z' fill={color} stroke='none' />
      <path d='M16 13 L 19 17 L 16 16 Z' fill={color} stroke='none' />
      {/* Exhaust plume */}
      <path d='M10 15 L 12 22 L 14 15' />
    </svg>
  );
}
RocketIcon.displayName = 'RocketIcon';

export { RocketIcon };
