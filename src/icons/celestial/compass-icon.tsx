import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * CompassIcon — compass rose with outer circle and N/S/E/W directional arrows.
 */
function CompassIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
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
      {/* Outer circle */}
      <circle cx='12' cy='12' r='10' />
      {/* N pointer (north) — filled */}
      <polygon points='12,4 14,12 12,10 10,12' fill={color} stroke='none' />
      {/* S pointer (south) */}
      <polygon
        points='12,20 14,12 12,14 10,12'
        fill='none'
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* E/W hash marks */}
      <line x1='22' y1='12' x2='19' y2='12' />
      <line x1='5' y1='12' x2='2' y2='12' />
      {/* Center dot */}
      <circle cx='12' cy='12' r='1' fill={color} />
    </svg>
  );
}
CompassIcon.displayName = 'CompassIcon';

export { CompassIcon };
