import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * RadarIcon — radar sweep with outer circle, center point, sweep line, and arcs.
 */
function RadarIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
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
      {/* Middle arc */}
      <path d='M12 12m-6 0a6 6 0 0 1 6-6' />
      {/* Inner arc */}
      <path d='M12 12m-3 0a3 3 0 0 1 3-3' />
      {/* Sweep line from center */}
      <line x1='12' y1='12' x2='19' y2='5' />
      {/* Center dot */}
      <circle cx='12' cy='12' r='1' fill={color} />
    </svg>
  );
}
RadarIcon.displayName = 'RadarIcon';

export { RadarIcon };
