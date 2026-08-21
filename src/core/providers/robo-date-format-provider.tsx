'use client';

import * as React from 'react';

import { type StorageAdapter, createLocalStorageAdapter } from '../storage-adapter';
import { type DateFormatId, formatDate, formatDateTime } from '../formatting/format-date';

const DEFAULT_DATE_FORMAT: DateFormatId = 'MM/DD/YYYY';
const defaultStorageAdapter = createLocalStorageAdapter();

interface DateFormatContextValue {
  dateFormat: DateFormatId;
  setDateFormat: (dateFormat: DateFormatId) => void;
  /** Formats a date using the current setting. Bound for convenience — equivalent to `formatDate(input, dateFormat)`. */
  formatDate: (input: Date | string | number | null | undefined) => string;
  /** Formats a date + UTC time using the current setting. Bound for convenience — equivalent to `formatDateTime(input, dateFormat)`. */
  formatDateTime: (input: Date | string | number | null | undefined) => string;
}

const DateFormatContext = React.createContext<DateFormatContextValue | null>(null);

export interface RoboDateFormatProviderProps {
  defaultDateFormat?: DateFormatId;
  storageAdapter?: StorageAdapter;
  storageKey?: string;
  children: React.ReactNode;
}

function RoboDateFormatProvider({
  defaultDateFormat = DEFAULT_DATE_FORMAT,
  storageAdapter = defaultStorageAdapter,
  storageKey = 'robo-date-format',
  children,
}: RoboDateFormatProviderProps) {
  const [dateFormat, setDateFormatState] = React.useState<DateFormatId>(() => {
    const stored = storageAdapter.get(storageKey);
    return (stored as DateFormatId) ?? defaultDateFormat;
  });

  const setDateFormat = React.useCallback(
    (next: DateFormatId) => {
      setDateFormatState(next);
      storageAdapter.set(storageKey, next);
    },
    [storageAdapter, storageKey]
  );

  const value = React.useMemo<DateFormatContextValue>(
    () => ({
      dateFormat,
      setDateFormat,
      formatDate: (input) => formatDate(input, dateFormat),
      formatDateTime: (input) => formatDateTime(input, dateFormat),
    }),
    [dateFormat, setDateFormat]
  );

  return <DateFormatContext.Provider value={value}>{children}</DateFormatContext.Provider>;
}
RoboDateFormatProvider.displayName = 'RoboDateFormatProvider';

function useDateFormat(): DateFormatContextValue {
  const ctx = React.useContext(DateFormatContext);
  if (!ctx) throw new Error('useDateFormat must be used within RoboDateFormatProvider');
  return ctx;
}

/**
 * Non-throwing variant for library components (e.g. `createDateCell`) that
 * must keep working standalone in consumer apps/Storybook that haven't
 * mounted `RoboDateFormatProvider`. Returns `null` absent a provider.
 */
function useDateFormatOptional(): DateFormatContextValue | null {
  return React.useContext(DateFormatContext);
}

export { RoboDateFormatProvider, useDateFormat, useDateFormatOptional, DEFAULT_DATE_FORMAT };
export type { DateFormatId };
