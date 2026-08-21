import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import {
  RoboDescriptionList,
  RoboDescriptionTerm,
  RoboDescriptionDetail,
  formatKey,
  formatValue,
} from './robo-description-list';


describe('formatKey', () => {
  it('converts snake_case and kebab-case to Title Case', () => {
    expect(formatKey('operator')).toBe('Operator');
    expect(formatKey('norad-id')).toBe('Norad Id');
  });
});

describe('formatValue', () => {
  it('formats primitives, nulls, arrays, and objects', () => {
    expect(formatValue('abc')).toBe('abc');
    expect(formatValue(42)).toBe('42');
    expect(formatValue(true)).toBe('Yes');
    expect(formatValue(false)).toBe('No');
    expect(formatValue(null)).toBe('—');
    expect(formatValue(undefined)).toBe('—');
    expect(formatValue(['a', 'b'])).toBe('a, b');
    expect(formatValue({ a: 1 })).toBe('{"a":1}');
  });

  it('does not throw on circular references', () => {
    const circular: Record<string, unknown> = { name: 'loop' };
    circular.self = circular;
    expect(formatValue(circular)).toBe('[object]');
  });
});

describe('RoboDescriptionList', () => {
  it('renders items as dt/dd pairs with formatted keys and values', () => {
    render(<RoboDescriptionList items={{ operator: 'NASA', signal_active: true }} />);
    expect(screen.getByText('Operator')).toBeInTheDocument();
    expect(screen.getByText('NASA')).toBeInTheDocument();
    expect(screen.getByText('Signal Active')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('renders a semantic dl element with data-slot', () => {
    const { container } = render(<RoboDescriptionList items={{ a: 1 }} />);
    const dl = container.querySelector('dl');
    expect(dl).toBeInTheDocument();
    expect(dl).toHaveAttribute('data-slot', 'description-list');
  });

  it('renders composed children when items is not passed', () => {
    render(
      <RoboDescriptionList>
        <RoboDescriptionTerm>Spacecraft</RoboDescriptionTerm>
        <RoboDescriptionDetail>Voyager 1</RoboDescriptionDetail>
      </RoboDescriptionList>
    );
    expect(screen.getByText('Spacecraft').tagName).toBe('DT');
    expect(screen.getByText('Voyager 1').tagName).toBe('DD');
  });

  it('stacked layout wraps each pair in a group div', () => {
    const { container } = render(
      <RoboDescriptionList layout="stacked" items={{ a: 1, b: 2 }} />
    );
    expect(container.querySelectorAll('[data-slot="description-group"]')).toHaveLength(2);
  });

  it('forwards ref to the dl element', () => {
    const ref = React.createRef<HTMLDListElement>();
    render(<RoboDescriptionList ref={ref} items={{ a: 1 }} />);
    expect(ref.current).toBeInstanceOf(HTMLDListElement);
  });

  it('has displayName set', () => {
    expect(RoboDescriptionList.displayName).toBe('RoboDescriptionList');
    expect(RoboDescriptionTerm.displayName).toBe('RoboDescriptionTerm');
    expect(RoboDescriptionDetail.displayName).toBe('RoboDescriptionDetail');
  });

  it('no a11y violations', async () => {
    const { container } = render(
      <RoboDescriptionList items={{ operator: 'NASA', norad_id: 25544 }} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
