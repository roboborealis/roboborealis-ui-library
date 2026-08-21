import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * OrbitIcon — a central body with an elliptical orbit and an orbiting dot.
 */
function OrbitIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
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
      {/* Central body */}
      <circle cx='12' cy='12' r='3' fill={color} stroke='none' />
      {/* Orbit path */}
      <ellipse cx='12' cy='12' rx='10' ry='5' transform='rotate(-30 12 12)' />
      {/* Orbiting satellite */}
      <circle cx='20' cy='8' r='1.6' fill={color} stroke='none' />
    </svg>
  );
}
OrbitIcon.displayName = 'OrbitIcon';

export { OrbitIcon };
