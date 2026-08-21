import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoboDateFormatProvider, useDateFormat, useDateFormatOptional } from './robo-date-format-provider';
import type { StorageAdapter } from '../storage-adapter';

const SAMPLE = '2026-03-04T15:06:07.000Z';

// Helper component that reads the date-format context
function DateFormatDisplay() {
  const { dateFormat, setDateFormat, formatDate } = useDateFormat();
  return (
    <div>
      <span data-testid='date-format-value'>{dateFormat}</span>
      <span data-testid='formatted-sample'>{formatDate(SAMPLE)}</span>
      <button onClick={() => setDateFormat('YYYY-MM-DD')}>Set ISO</button>
      <button onClick={() => setDateFormat('DD/MM/YYYY')}>Set International</button>
    </div>
  );
}

function ThrowingComponent() {
  useDateFormat();
  return null;
}

function OptionalDisplay() {
  const ctx = useDateFormatOptional();
  return <span data-testid='optional-value'>{ctx ? ctx.formatDate(SAMPLE) : 'no-provider'}</span>;
}

function makeMockAdapter(initial: Record<string, string> = {}): StorageAdapter {
  const store = { ...initial };
  return {
    get: vi.fn((key: string) => store[key] ?? null),
    set: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    remove: vi.fn((key: string) => {
      delete store[key];
    }),
  };
}

describe('RoboDateFormatProvider', () => {
  it('renders children', () => {
    render(
      <RoboDateFormatProvider>
        <span>hello</span>
      </RoboDateFormatProvider>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('defaults to MM/DD/YYYY', () => {
    render(
      <RoboDateFormatProvider>
        <DateFormatDisplay />
      </RoboDateFormatProvider>
    );
    expect(screen.getByTestId('date-format-value')).toHaveTextContent('MM/DD/YYYY');
    expect(screen.getByTestId('formatted-sample')).toHaveTextContent('03/04/2026');
  });

  it('uses a custom defaultDateFormat when no storageAdapter value exists', () => {
    render(
      <RoboDateFormatProvider defaultDateFormat='YYYY-MM-DD'>
        <DateFormatDisplay />
      </RoboDateFormatProvider>
    );
    expect(screen.getByTestId('date-format-value')).toHaveTextContent('YYYY-MM-DD');
  });

  it('reads initial dateFormat from storageAdapter when provided', () => {
    const adapter = makeMockAdapter({ 'robo-date-format': 'DD/MM/YYYY' });
    render(
      <RoboDateFormatProvider storageAdapter={adapter}>
        <DateFormatDisplay />
      </RoboDateFormatProvider>
    );
    expect(adapter.get).toHaveBeenCalledWith('robo-date-format');
    expect(screen.getByTestId('date-format-value')).toHaveTextContent('DD/MM/YYYY');
  });

  it('setDateFormat() updates the context value and re-formats live', async () => {
    render(
      <RoboDateFormatProvider>
        <DateFormatDisplay />
      </RoboDateFormatProvider>
    );
    await userEvent.click(screen.getByText('Set ISO'));
    expect(screen.getByTestId('date-format-value')).toHaveTextContent('YYYY-MM-DD');
    expect(screen.getByTestId('formatted-sample')).toHaveTextContent('2026-03-04');
  });

  it('setDateFormat() persists to storageAdapter when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboDateFormatProvider storageAdapter={adapter}>
        <DateFormatDisplay />
      </RoboDateFormatProvider>
    );
    await userEvent.click(screen.getByText('Set International'));
    expect(adapter.set).toHaveBeenCalledWith('robo-date-format', 'DD/MM/YYYY');
  });

  it('falls back to defaultDateFormat when storageAdapter.get returns null', () => {
    const adapter = makeMockAdapter();
    render(
      <RoboDateFormatProvider defaultDateFormat='MMM D, YYYY' storageAdapter={adapter}>
        <DateFormatDisplay />
      </RoboDateFormatProvider>
    );
    expect(screen.getByTestId('date-format-value')).toHaveTextContent('MMM D, YYYY');
  });

  it('useDateFormat() throws when called outside RoboDateFormatProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<ThrowingComponent />)).toThrow(
      'useDateFormat must be used within RoboDateFormatProvider'
    );
    spy.mockRestore();
  });

  it('uses custom storageKey when provided', async () => {
    const adapter = makeMockAdapter();
    render(
      <RoboDateFormatProvider storageAdapter={adapter} storageKey='my-date-format'>
        <DateFormatDisplay />
      </RoboDateFormatProvider>
    );
    await userEvent.click(screen.getByText('Set ISO'));
    expect(adapter.set).toHaveBeenCalledWith('my-date-format', 'YYYY-MM-DD');
  });

  it('defaults storageAdapter to persistent localStorage-backed storage when omitted', async () => {
    window.localStorage.clear();
    const { unmount } = render(
      <RoboDateFormatProvider>
        <DateFormatDisplay />
      </RoboDateFormatProvider>
    );
    await userEvent.click(screen.getByText('Set ISO'));
    expect(window.localStorage.getItem('robo-date-format')).toBe('YYYY-MM-DD');
    unmount();

    render(
      <RoboDateFormatProvider>
        <DateFormatDisplay />
      </RoboDateFormatProvider>
    );
    expect(screen.getByTestId('date-format-value')).toHaveTextContent('YYYY-MM-DD');
    window.localStorage.clear();
  });

  describe('useDateFormatOptional', () => {
    it('returns the context value when inside a provider', () => {
      render(
        <RoboDateFormatProvider defaultDateFormat='YYYY-MM-DD'>
          <OptionalDisplay />
        </RoboDateFormatProvider>
      );
      expect(screen.getByTestId('optional-value')).toHaveTextContent('2026-03-04');
    });

    it('returns null (no throw) when outside a provider', () => {
      render(<OptionalDisplay />);
      expect(screen.getByTestId('optional-value')).toHaveTextContent('no-provider');
    });
  });
});
