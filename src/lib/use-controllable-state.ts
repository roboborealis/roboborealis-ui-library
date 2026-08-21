import * as React from 'react';

type SetStateFn<T> = (next: T | ((prev: T) => T)) => void;

export interface UseControllableStateParams<T> {
  /** Controlled value. When provided (not `undefined`), the hook is controlled. */
  prop?: T | undefined;
  /** Initial value when uncontrolled. */
  defaultProp: T;
  /** Notified whenever a new value is requested, in both modes. */
  onChange?: (value: T) => void;
}

/**
 * useControllableState — one implementation of the controlled/uncontrolled
 * toggle every Robo component was hand-rolling. When `prop` is defined the value
 * is controlled and internal writes forward to `onChange` only; otherwise the
 * hook owns the state and still fires `onChange` on each change.
 *
 * Mirrors the shape of Radix's own `useControllableState` so the API is
 * familiar, but is a first-party implementation (no reliance on a transitive
 * dependency).
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useControllableState({
 *   prop: openProp,
 *   defaultProp: false,
 *   onChange: onOpenChange,
 * });
 * ```
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>): [T, SetStateFn<T>] {
  const [internalValue, setInternalValue] = React.useState<T>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? (prop as T) : internalValue;

  // Keep the latest onChange without re-creating the setter each render.
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback<SetStateFn<T>>(
    (next) => {
      if (isControlled) {
        const resolved =
          typeof next === 'function'
            ? (next as (prev: T) => T)(prop as T)
            : next;
        if (resolved !== prop) onChangeRef.current?.(resolved);
      } else {
        setInternalValue((prev) => {
          const resolved =
            typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
          if (resolved !== prev) onChangeRef.current?.(resolved);
          return resolved;
        });
      }
    },
    [isControlled, prop]
  );

  return [value, setValue];
}
