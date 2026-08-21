// __mocks__/motion/react.tsx
// Lightweight mock for Motion in Jest/jsdom environment.
// All animated components render their children transparently.
import * as React from 'react';

const isMotionValue = (v: unknown): v is { get: () => unknown } =>
  v !== null && typeof v === 'object' && 'get' in v && typeof (v as { get: unknown }).get === 'function';

const resolveChildren = (children: React.ReactNode): React.ReactNode => {
  if (isMotionValue(children)) return String(children.get());
  return children;
};

const createMotionComponent = (tag: string) =>
  React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & Record<string, unknown>>(
    ({ children, initial: _i, animate: _a, exit: _e, transition: _t, variants: _v,
       whileHover: _wh, whileTap: _wt, whileFocus: _wf, layout: _l, ...rest }, ref) =>
      React.createElement(tag, { ref, ...rest }, resolveChildren(children))
  );

// Cache component constructors so React sees the same identity across renders.
// Without caching, each render accesses motion.div → new function → React unmounts/remounts.
const _motionCache = new Map<string, ReturnType<typeof createMotionComponent>>();
const handler: ProxyHandler<object> = {
  get: (_t, key: string) => {
    if (!_motionCache.has(key)) _motionCache.set(key, createMotionComponent(key));
    return _motionCache.get(key);
  },
};

export const motion = new Proxy({}, handler);

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const useReducedMotion = () => false;
export const useInView = (_ref: React.RefObject<HTMLElement>, _opts?: object) => true;
export const useSpring = (initial: number) => {
  const v = { get: () => initial, set: (_n: number) => {}, on: () => () => {} };
  return Object.assign(v, { current: initial });
};
export const useTransform = (_v: unknown, fn: (n: number) => unknown) => {
  const val = typeof _v === 'object' && _v && 'get' in _v ? (_v as { get: () => number }).get() : 0;
  return { get: () => fn(val), on: () => () => {} };
};
export const useMotionValue = (initial: number) => ({
  get: () => initial,
  set: (_n: number) => {},
  on: () => () => {},
});
