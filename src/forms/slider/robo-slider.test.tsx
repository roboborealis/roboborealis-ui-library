import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboSlider } from './robo-slider';


/* Radix UI Slider uses ResizeObserver internally via @radix-ui/react-use-size.
   jsdom does not implement it, so we provide a minimal stub. */
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

/**
 * Note: Radix UI Slider uses ARIA roles and keyboard navigation that may behave
 * differently in jsdom vs real browsers. We test the rendered output, ARIA attributes,
 * and accessibility violations here. Keyboard drag/range interaction requires e2e tests.
 */

describe('RoboSlider', () => {
  /* ---------------------------------------------------------------- */
  /* Rendering                                                          */
  /* ---------------------------------------------------------------- */

  it('renders a slider element', () => {
    render(<RoboSlider defaultValue={[50]} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders with a visible label', () => {
    render(<RoboSlider label='Volume' defaultValue={[50]} />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<RoboSlider label='Volume' defaultValue={[50]} helperText='Adjust the volume' />);
    expect(screen.getByText('Adjust the volume')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<RoboSlider label='Volume' defaultValue={[50]} error='Invalid value' />);
    expect(screen.getByText('Invalid value')).toBeInTheDocument();
  });

  it('shows current value when showValue is true', () => {
    render(<RoboSlider label='Volume' defaultValue={[75]} showValue />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('formats the displayed value using formatValue', () => {
    render(
      <RoboSlider
        label='Price'
        defaultValue={[50]}
        showValue
        formatValue={(v) => `$${v}`}
      />
    );
    expect(screen.getByText('$50')).toBeInTheDocument();
  });

  it('shows min/max labels', () => {
    render(<RoboSlider min={0} max={200} defaultValue={[100]} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('formats min/max labels using formatValue', () => {
    render(
      <RoboSlider
        min={0}
        max={1000}
        defaultValue={[500]}
        formatValue={(v) => `$${v}`}
      />
    );
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
  });

  it('forwards ref to the slider root element', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<RoboSlider ref={ref} defaultValue={[0]} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has displayName RoboSlider', () => {
    expect(RoboSlider.displayName).toBe('RoboSlider');
  });

  /* ---------------------------------------------------------------- */
  /* ARIA attributes                                                    */
  /* ---------------------------------------------------------------- */

  it('sets aria-valuemin', () => {
    render(<RoboSlider min={10} max={90} defaultValue={[50]} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemin', '10');
  });

  it('sets aria-valuemax', () => {
    render(<RoboSlider min={0} max={200} defaultValue={[50]} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuemax', '200');
  });

  it('sets aria-valuenow to the current value', () => {
    render(<RoboSlider defaultValue={[42]} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '42');
  });

  it('sets aria-invalid when error is provided', () => {
    render(<RoboSlider defaultValue={[0]} error='Out of range' />);
    // aria-invalid is on the root, not the thumb. Use getByRole('slider') or container query.
    const root = screen.getByRole('slider').closest('[aria-invalid]');
    expect(root).toHaveAttribute('aria-invalid', 'true');
  });

  it('error message has role=alert', () => {
    render(<RoboSlider defaultValue={[0]} error='Something is wrong' />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something is wrong');
  });

  /* ---------------------------------------------------------------- */
  /* Disabled state                                                     */
  /* ---------------------------------------------------------------- */

  it('is disabled when disabled prop is passed', () => {
    render(<RoboSlider defaultValue={[50]} disabled />);
    // Radix Slider sets data-disabled on the thumb and the root span
    const slider = screen.getByRole('slider');
    // The thumb itself should be disabled (disabled attribute or data-disabled)
    expect(
      slider.hasAttribute('disabled') ||
        slider.getAttribute('data-disabled') === '' ||
        slider.getAttribute('data-disabled') === 'true'
    ).toBe(true);
  });

  /* ---------------------------------------------------------------- */
  /* Controlled value                                                   */
  /* ---------------------------------------------------------------- */

  it('reflects controlled value', () => {
    render(<RoboSlider value={[30]} onChange={() => {}} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '30');
  });

  /* ---------------------------------------------------------------- */
  /* Accessibility                                                      */
  /* ---------------------------------------------------------------- */

  it('has no a11y violations with default props', async () => {
    const { container } = render(
      <RoboSlider label='Volume' defaultValue={[50]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations with showValue', async () => {
    const { container } = render(
      <RoboSlider label='Brightness' defaultValue={[75]} showValue />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations in error state', async () => {
    const { container } = render(
      <RoboSlider label='Volume' defaultValue={[0]} error='Value is required' />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when disabled', async () => {
    const { container } = render(
      <RoboSlider label='Volume' defaultValue={[50]} disabled />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
