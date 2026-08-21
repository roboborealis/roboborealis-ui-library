import { renderHook } from '@testing-library/react';
import { usePointerGlow, mergePointerGlow } from './use-pointer-glow';

function makeEvent(clientX: number, clientY: number, rect: Partial<DOMRect>) {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({ left: 0, top: 0, ...rect }) as DOMRect;
  return {
    currentTarget: el,
    clientX,
    clientY,
  } as unknown as React.PointerEvent<HTMLDivElement>;
}

describe('usePointerGlow', () => {
  it('writes --robo-glow-x/y relative to the element top-left', () => {
    const { result } = renderHook(() => usePointerGlow<HTMLDivElement>());
    const event = makeEvent(130, 90, { left: 100, top: 40 });

    result.current.onPointerMove(event);

    const el = event.currentTarget;
    expect(el.style.getPropertyValue('--robo-glow-x')).toBe('30px');
    expect(el.style.getPropertyValue('--robo-glow-y')).toBe('50px');
  });

  it('returns a stable handler across renders', () => {
    const { result, rerender } = renderHook(() => usePointerGlow());
    const first = result.current.onPointerMove;
    rerender();
    expect(result.current.onPointerMove).toBe(first);
  });
});

describe('mergePointerGlow', () => {
  it('returns the glow handler unchanged when no provided handler', () => {
    const glow = vi.fn();
    expect(mergePointerGlow(glow)).toBe(glow);
  });

  it('runs both handlers when a provided handler exists', () => {
    const glow = vi.fn();
    const provided = vi.fn();
    const merged = mergePointerGlow(glow, provided);
    const event = makeEvent(10, 10, { left: 0, top: 0 });

    merged(event);

    expect(glow).toHaveBeenCalledWith(event);
    expect(provided).toHaveBeenCalledWith(event);
  });
});
