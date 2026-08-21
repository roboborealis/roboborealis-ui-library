import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * WaypointIcon — navigation waypoint teardrop/pin with center dot.
 */
function WaypointIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
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
      {/* Teardrop pin shape */}
      <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' />
      {/* Center dot */}
      <circle cx='12' cy='9' r='2' fill={color} />
    </svg>
  );
}
WaypointIcon.displayName = 'WaypointIcon';

export { WaypointIcon };
