import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboFieldList } from './robo-field-list';

const fields = [
  { label: 'NORAD ID', value: '25544' },
  { label: 'Altitude', value: '420 km' },
  { label: 'Velocity', value: '7.66 km/s' },
];

describe('RoboFieldList', () => {
  it('renders every label and value as term/detail pairs', () => {
    render(<RoboFieldList fields={fields} />);
    expect(screen.getByText('NORAD ID')).toBeInTheDocument();
    expect(screen.getByText('25544')).toBeInTheDocument();
    expect(screen.getByText('7.66 km/s')).toBeInTheDocument();
  });

  it('uses semantic dl/dt/dd markup', () => {
    const { container } = render(<RoboFieldList fields={fields} />);
    expect(container.querySelector('dl[data-slot="field-list"]')).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(3);
    expect(container.querySelectorAll('dd')).toHaveLength(3);
  });

  it('stripes even rows by default and drops striping when disabled', () => {
    const { container, rerender } = render(<RoboFieldList fields={fields} />);
    const striped = container.querySelectorAll('[data-slot="field-list-row"]');
    expect(striped[0].className).toContain('nth-child(even)');

    rerender(<RoboFieldList fields={fields} striped={false} />);
    const plain = container.querySelectorAll('[data-slot="field-list-row"]');
    expect(plain[0].className).not.toContain('nth-child(even)');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RoboFieldList fields={fields} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
