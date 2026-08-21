import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * ReportIcon — document with text lines and a small chart element in corner.
 */
function ReportIcon({ size = 24, color = 'currentColor', strokeWidth = 2, ref, ...props }: IconProps) {
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
      {/* Document body */}
      <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
      {/* Folded corner */}
      <polyline points='14 2 14 8 20 8' />
      {/* Text lines */}
      <line x1='8' y1='13' x2='13' y2='13' />
      <line x1='8' y1='16' x2='13' y2='16' />
      {/* Mini bar chart in bottom-right */}
      <line x1='15' y1='18' x2='15' y2='15' />
      <line x1='17' y1='18' x2='17' y2='13' />
    </svg>
  );
}
ReportIcon.displayName = 'ReportIcon';

export { ReportIcon };
