import { formatDate, formatDateTime, DATE_FORMAT_OPTIONS } from './format-date';

// A UTC instant: 2026-03-04T15:06:07Z
const SAMPLE = '2026-03-04T15:06:07.000Z';

describe('formatDate', () => {
  it('formats MM/DD/YYYY', () => {
    expect(formatDate(SAMPLE, 'MM/DD/YYYY')).toBe('03/04/2026');
  });

  it('formats DD/MM/YYYY', () => {
    expect(formatDate(SAMPLE, 'DD/MM/YYYY')).toBe('04/03/2026');
  });

  it('formats YYYY-MM-DD', () => {
    expect(formatDate(SAMPLE, 'YYYY-MM-DD')).toBe('2026-03-04');
  });

  it('formats MMM D, YYYY', () => {
    expect(formatDate(SAMPLE, 'MMM D, YYYY')).toBe('Mar 4, 2026');
  });

  it('accepts a Date object', () => {
    expect(formatDate(new Date(SAMPLE), 'YYYY-MM-DD')).toBe('2026-03-04');
  });

  it('accepts an epoch-ms number', () => {
    expect(formatDate(new Date(SAMPLE).getTime(), 'YYYY-MM-DD')).toBe('2026-03-04');
  });

  it('uses the UTC calendar date, not the host timezone', () => {
    // 23:30 UTC on Jan 1 would roll to Jan 2 in a positive-offset local timezone
    // if formatting used local Date getters instead of UTC ones.
    expect(formatDate('2026-01-01T23:30:00.000Z', 'YYYY-MM-DD')).toBe('2026-01-01');
  });

  it('returns an em dash for null', () => {
    expect(formatDate(null, 'YYYY-MM-DD')).toBe('—');
  });

  it('returns an em dash for undefined', () => {
    expect(formatDate(undefined, 'YYYY-MM-DD')).toBe('—');
  });

  it('returns an em dash for an invalid date string', () => {
    expect(formatDate('not-a-date', 'YYYY-MM-DD')).toBe('—');
  });
});

describe('formatDateTime', () => {
  it('appends a UTC HH:mm:ss time suffix to the date', () => {
    expect(formatDateTime(SAMPLE, 'YYYY-MM-DD')).toBe('2026-03-04 15:06:07Z');
  });

  it('returns an em dash for null', () => {
    expect(formatDateTime(null, 'YYYY-MM-DD')).toBe('—');
  });
});

describe('DATE_FORMAT_OPTIONS', () => {
  it('has one entry per DateFormatId with a live example embedded in the label', () => {
    expect(DATE_FORMAT_OPTIONS).toHaveLength(4);
    const isoOption = DATE_FORMAT_OPTIONS.find((o) => o.value === 'YYYY-MM-DD');
    expect(isoOption?.label).toMatch(/^YYYY-MM-DD \(\d{4}-\d{2}-\d{2}\)$/);
  });
});
