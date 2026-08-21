import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * SatelliteIcon — a satellite body with two solar-panel wings and a dish.
 */
function SatelliteIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
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
      {/* Body */}
      <rect x='10' y='10' width='4' height='4' rx='0.5' />
      {/* Left solar wing */}
      <rect x='2' y='9.5' width='6' height='5' rx='0.5' />
      <line x1='5' y1='9.5' x2='5' y2='14.5' />
      {/* Right solar wing */}
      <rect x='16' y='9.5' width='6' height='5' rx='0.5' />
      <line x1='19' y1='9.5' x2='19' y2='14.5' />
      {/* Dish antenna */}
      <path d='M12 10 L12 6' />
      <path d='M9.5 5 A 3 3 0 0 1 14.5 5 Z' fill={color} stroke='none' />
    </svg>
  );
}
SatelliteIcon.displayName = 'SatelliteIcon';

export { SatelliteIcon };
