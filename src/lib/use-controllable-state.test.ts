import { act, renderHook } from '@testing-library/react';

import { useControllableState } from './use-controllable-state';

describe('useControllableState', () => {
  it('is uncontrolled by default and tracks internal state', () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultProp: 'a' })
    );
    expect(result.current[0]).toBe('a');

    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
  });

  it('supports a functional updater when uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultProp: 1 })
    );
    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(2);
  });

  it('is controlled when prop is provided and ignores internal writes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ prop: 'x', defaultProp: 'a', onChange })
    );
    expect(result.current[0]).toBe('x');

    act(() => result.current[1]('y'));
    // controlled value does not change internally...
    expect(result.current[0]).toBe('x');
    // ...but the consumer is notified with the requested value.
    expect(onChange).toHaveBeenCalledWith('y');
  });

  it('calls onChange with the resolved value when uncontrolled', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultProp: false, onChange })
    );
    act(() => result.current[1](true));
    expect(result.current[0]).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('reflects a changed controlled prop across rerenders', () => {
    const { result, rerender } = renderHook(
      ({ prop }: { prop: string }) =>
        useControllableState({ prop, defaultProp: 'a' }),
      { initialProps: { prop: 'one' } }
    );
    expect(result.current[0]).toBe('one');
    rerender({ prop: 'two' });
    expect(result.current[0]).toBe('two');
  });
});
