'use client';

import * as React from 'react';
import type { CellContext } from '@tanstack/react-table';

import {
  RoboCourseIndicator,
  type CourseDisplay,
} from '@/core/course-indicator/robo-course-indicator';

// ---------------------------------------------------------------------------
// CourseCell — TanStack cell factory wrapping RoboCourseIndicator
// ---------------------------------------------------------------------------

export interface CourseCellConfig {
  /** What to display: arrow, value, or both. Default: 'both'. */
  display?: CourseDisplay;
  /** Size variant. Default: 'sm'. */
  size?: 'sm' | 'md' | 'lg';
  /** Override the arrow icon size in pixels. */
  iconSize?: number;
}

/**
 * Creates a TanStack cell renderer that displays a course heading
 * using `RoboCourseIndicator`.
 *
 * @example
 * ```tsx
 * columnHelper.accessor('course', {
 *   header: 'Course',
 *   cell: createCourseCell(),
 *   meta: { align: 'center' },
 * })
 * ```
 */
export function createCourseCell<TData>(
  config: CourseCellConfig = {},
): (info: CellContext<TData, unknown>) => React.ReactNode {
  const { display, size = 'sm', iconSize } = config;

  return function CourseCell(info: CellContext<TData, unknown>) {
    const raw = info.getValue();
    const course = raw === null || raw === undefined ? null : Number(raw);

    return (
      <RoboCourseIndicator
        course={isNaN(course as number) ? null : course}
        display={display}
        size={size}
        iconSize={iconSize}
      />
    );
  };
}
