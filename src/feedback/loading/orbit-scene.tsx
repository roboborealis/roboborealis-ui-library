// ---------------------------------------------------------------------------
// OrbitScene — internal animated SVG scene for RoboLoading
// ---------------------------------------------------------------------------
// NOT exported from @roboborealis/components — internal to the loading indicator.
//
// A shaded, glowing planet with a tilted ring sits at center while a satellite
// tracks a dashed orbit around it and stars twinkle behind. The planet is lit
// with a radial gradient (light side + terminator shadow); the satellite and
// core carry a soft glow for a richer, textured feel.
//
// React.useId() keeps gradient/filter/animation ids unique per instance.
//
// Colors: var(--primary) (planet/orbit), var(--secondary) + var(--chart-3)
// (ring + accents where present; falls back to --primary via the gradient),
// var(--muted-foreground) (stars). Respects prefers-reduced-motion.
// ---------------------------------------------------------------------------

import { useId } from 'react';

export function OrbitScene() {
  const uid = useId().replace(/:/g, '');
  const spin = `robo-orbit-spin-${uid}`;
  const counter = `robo-orbit-counter-${uid}`;
  const twinkle = `robo-orbit-twinkle-${uid}`;
  const planetGrad = `robo-orbit-planet-${uid}`;
  const glow = `robo-orbit-glow-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className="w-full h-auto"
      overflow="visible"
    >
      <defs>
        {/* Lit planet: bright top-left, shadowed lower-right. */}
        <radialGradient id={planetGrad} cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
          <stop offset="55%" stopColor="var(--primary)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
        {/* Soft glow for the satellite + core. */}
        <filter id={glow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <style>{`
        .${spin} { transform-box: view-box; transform-origin: 60px 60px; animation: ${spin} 2.4s linear infinite; }
        .${counter} { transform-box: fill-box; transform-origin: 50% 50%; animation: ${counter} 2.4s linear infinite; }
        .robo-orbit-star-${uid} { animation: ${twinkle} 1.8s ease-in-out infinite; }
        .robo-orbit-star-${uid}:nth-of-type(2) { animation-delay: -0.6s; }
        .robo-orbit-star-${uid}:nth-of-type(3) { animation-delay: -1.2s; }
        @keyframes ${spin} { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ${counter} { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes ${twinkle} { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .${spin}, .${counter}, .robo-orbit-star-${uid} { animation: none; }
        }
      `}</style>

      {/* Twinkling stars */}
      <circle className={`robo-orbit-star-${uid}`} cx="16" cy="22" r="1.8" fill="var(--muted-foreground)" />
      <circle className={`robo-orbit-star-${uid}`} cx="102" cy="32" r="1.3" fill="var(--muted-foreground)" />
      <circle className={`robo-orbit-star-${uid}`} cx="96" cy="98" r="1.8" fill="var(--muted-foreground)" />

      {/* Orbit path */}
      <circle cx="60" cy="60" r="40" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.5" />

      {/* Planet: shaded sphere + tilted ring + a couple of surface bands for texture */}
      <ellipse cx="60" cy="60" rx="30" ry="8" fill="none" stroke="var(--secondary)" strokeWidth="3" opacity="0.85" transform="rotate(-20 60 60)" />
      <circle cx="60" cy="60" r="17" fill={`url(#${planetGrad})`} filter={`url(#${glow})`} />
      {/* surface texture bands (clipped visually by low opacity) */}
      <path d="M46 56 q 14 -4 28 0" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.18" />
      <path d="M45 63 q 15 5 30 0" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.14" />
      <circle cx="53" cy="53" r="2.4" fill="#fff" opacity="0.35" />
      {/* front half of ring, drawn over the planet */}
      <path d="M32 63 A 30 8 -20 0 0 88 57" fill="none" stroke="var(--secondary)" strokeWidth="3" opacity="0.95" transform="rotate(-20 60 60)" />

      {/* Orbiting satellite (group spins; body counter-spins to stay upright) */}
      <g className={spin}>
        <g transform="translate(60,20)">
          <g className={counter} filter={`url(#${glow})`}>
            <rect x="-3" y="-3" width="6" height="6" rx="1" fill="var(--primary)" />
            <rect x="-9" y="-2" width="4" height="4" fill="var(--secondary)" />
            <rect x="5" y="-2" width="4" height="4" fill="var(--secondary)" />
          </g>
        </g>
      </g>
    </svg>
  );
}
