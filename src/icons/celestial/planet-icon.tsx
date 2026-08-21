import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * PlanetIcon — a ringed planet (sphere with an elliptical ring).
 */
function PlanetIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
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
      {/* Planet body */}
      <circle cx='11' cy='11' r='6' />
      {/* Ring */}
      <ellipse cx='11' cy='11' rx='11' ry='4' transform='rotate(-25 11 11)' />
    </svg>
  );
}
PlanetIcon.displayName = 'PlanetIcon';

export { PlanetIcon };
