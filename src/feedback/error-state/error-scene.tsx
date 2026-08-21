// ---------------------------------------------------------------------------
// Error scene — internal SVG frames for RoboErrorState
// ---------------------------------------------------------------------------
// NOT exported from @roboborealis/components — internal to the error state only.
//
// An astronaut drifts away from a rocket on a slack tether. The frame-cycling
// loader advances the astronaut further out across 12 frames, so it reads as
// someone floating off into space — an Apollo-13 "we have a problem" moment.
// `ErrorStatic` is the settled, fully-drifted pose.
//
// Colors:
//   var(--primary)          = rocket body
//   var(--foreground)       = astronaut suit
//   var(--muted-foreground) = tether, visor, stars
// ---------------------------------------------------------------------------

import * as React from 'react';

/** The rocket, anchored bottom-left. */
function Rocket() {
  return (
    <g>
      <path d="M22 84 C 26 74, 30 68, 30 60 C 30 54, 27 49, 24 46 C 21 49, 18 54, 18 60 C 18 68, 20 74, 22 84 Z" fill="var(--primary)" />
      <circle cx="24" cy="60" r="2.4" fill="var(--background)" />
      <path d="M18 74 L 13 82 L 18 79 Z" fill="var(--primary)" opacity="0.8" />
      <path d="M30 74 L 35 82 L 30 79 Z" fill="var(--primary)" opacity="0.8" />
      <path d="M21 84 L 24 92 L 27 84" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

/** An astronaut at (x,y), rotated by `spin` degrees. */
function Astronaut({ x, y, spin }: { x: number; y: number; spin: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${spin})`}>
      {/* backpack */}
      <rect x="-6" y="-6" width="12" height="13" rx="4" fill="var(--foreground)" opacity="0.85" />
      {/* helmet */}
      <circle cx="0" cy="-2" r="7" fill="var(--foreground)" />
      <path d="M-4 -3 a 4 4 0 0 1 6 -2" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" />
      {/* arms */}
      <path d="M-6 2 L -11 -1" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 2 L 11 4" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
      {/* legs */}
      <path d="M-3 7 L -6 13" stroke="var(--foreground)" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M3 7 L 7 12" stroke="var(--foreground)" strokeWidth="3.2" strokeLinecap="round" />
    </g>
  );
}

// Rocket tether anchor point.
const ANCHOR = { x: 27, y: 58 };

function makeFrame(t: number) {
  // Astronaut drifts up-and-right as t goes 0 -> 1.
  const ax = 44 + t * 52;
  const ay = 54 - t * 30;
  const spin = t * 40;
  function Frame() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full h-auto" aria-hidden="true">
        {/* stars */}
        <g fill="var(--muted-foreground)">
          <circle cx="92" cy="20" r="1.5" />
          <circle cx="104" cy="60" r="1.2" />
          <circle cx="70" cy="14" r="1.2" />
        </g>
        {/* tether */}
        <path
          d={`M${ANCHOR.x} ${ANCHOR.y} Q ${(ANCHOR.x + ax) / 2} ${Math.max(ANCHOR.y, ay) + 14}, ${ax} ${ay}`}
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          opacity="0.7"
        />
        <Rocket />
        <Astronaut x={ax} y={ay} spin={spin} />
      </svg>
    );
  }
  return Frame;
}

// Settled (error) pose — astronaut fully drifted out.
export const ErrorStatic = makeFrame(1);

// 12 frames of the astronaut floating further away.
export const ErrorFrame1 = makeFrame(0);
export const ErrorFrame2 = makeFrame(1 / 11);
export const ErrorFrame3 = makeFrame(2 / 11);
export const ErrorFrame4 = makeFrame(3 / 11);
export const ErrorFrame5 = makeFrame(4 / 11);
export const ErrorFrame6 = makeFrame(5 / 11);
export const ErrorFrame7 = makeFrame(6 / 11);
export const ErrorFrame8 = makeFrame(7 / 11);
export const ErrorFrame9 = makeFrame(8 / 11);
export const ErrorFrame10 = makeFrame(9 / 11);
export const ErrorFrame11 = makeFrame(10 / 11);
export const ErrorFrame12 = makeFrame(1);
