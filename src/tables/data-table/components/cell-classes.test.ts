import { getAlignClass, getDensityCellClass } from './cell-classes';

describe('getAlignClass', () => {
  it('maps center to text-center', () => {
    expect(getAlignClass('center')).toBe('text-center');
  });

  it('maps right to text-right', () => {
    expect(getAlignClass('right')).toBe('text-right');
  });

  it('maps left to text-left', () => {
    expect(getAlignClass('left')).toBe('text-left');
  });

  it('defaults to text-left when align is undefined', () => {
    expect(getAlignClass()).toBe('text-left');
  });
});

describe('getDensityCellClass', () => {
  it('maps compact density', () => {
    expect(getDensityCellClass('compact')).toBe('px-2 py-1.5 text-xs');
  });

  it('maps spacious density', () => {
    expect(getDensityCellClass('spacious')).toBe('px-5 py-4 text-base');
  });

  it('maps comfortable density to the baseline', () => {
    expect(getDensityCellClass('comfortable')).toBe('px-4 py-3 text-sm');
  });

  it('defaults to the comfortable baseline when density is undefined', () => {
    expect(getDensityCellClass()).toBe('px-4 py-3 text-sm');
  });
});
