import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RoboDivider } from './robo-divider';

describe('RoboDivider', () => {
  /* ---------------------------------------------------------------- */
  /* Rendering defaults                                                 */
  /* ---------------------------------------------------------------- */

  it('renders horizontal by default', () => {
    const { container } = render(<RoboDivider />);
    const el = container.querySelector('[data-slot="divider"]');
    expect(el).toBeInTheDocument();
    // horizontal without label → h-px w-full
    expect(el?.className).toContain('w-full');
  });

  it('applies data-slot="divider"', () => {
    const { container } = render(<RoboDivider />);
    expect(container.querySelector('[data-slot="divider"]')).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------- */
  /* Accessibility roles                                                */
  /* ---------------------------------------------------------------- */

  it('applies role="none" when decorative (default)', () => {
    const { container } = render(<RoboDivider />);
    const el = container.querySelector('[data-slot="divider"]');
    expect(el).toHaveAttribute('role', 'none');
  });

  it('applies aria-hidden="true" when decorative (default)', () => {
    const { container } = render(<RoboDivider />);
    const el = container.querySelector('[data-slot="divider"]');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies role="separator" when decorative={false}', () => {
    const { container } = render(<RoboDivider decorative={false} />);
    const el = container.querySelector('[data-slot="divider"]');
    expect(el).toHaveAttribute('role', 'separator');
  });

  it('applies aria-orientation="horizontal" when decorative={false} and horizontal', () => {
    const { container } = render(
      <RoboDivider decorative={false} orientation='horizontal' />
    );
    const el = container.querySelector('[data-slot="divider"]');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('applies aria-orientation="vertical" when decorative={false} and vertical', () => {
    const { container } = render(
      <RoboDivider decorative={false} orientation='vertical' />
    );
    const el = container.querySelector('[data-slot="divider"]');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
  });

  /* ---------------------------------------------------------------- */
  /* Label                                                              */
  /* ---------------------------------------------------------------- */

  it('shows label text when label prop is provided', () => {
    render(<RoboDivider label='OR' />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('label text matches the provided string', () => {
    render(<RoboDivider label='Section break' />);
    expect(screen.getByText('Section break')).toBeInTheDocument();
  });

  it('renders a flex container when label is provided', () => {
    const { container } = render(<RoboDivider label='OR' />);
    const el = container.querySelector('[data-slot="divider"]');
    expect(el?.className).toContain('flex');
  });

  it('renders a ReactNode as label', () => {
    render(<RoboDivider label={<span data-testid='custom-label'>Custom</span>} />);
    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------- */
  /* Orientation                                                        */
  /* ---------------------------------------------------------------- */

  it('renders vertical variant with w-px class', () => {
    const { container } = render(<RoboDivider orientation='vertical' />);
    const el = container.querySelector('[data-slot="divider"]');
    expect(el?.className).toContain('w-px');
  });

  it('renders vertical variant with self-stretch class', () => {
    const { container } = render(<RoboDivider orientation='vertical' />);
    const el = container.querySelector('[data-slot="divider"]');
    expect(el?.className).toContain('self-stretch');
  });

  /* ---------------------------------------------------------------- */
  /* Ref forwarding                                                     */
  /* ---------------------------------------------------------------- */

  it('forwards ref to the outer div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboDivider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  /* ---------------------------------------------------------------- */
  /* className prop                                                     */
  /* ---------------------------------------------------------------- */

  it('merges custom className', () => {
    const { container } = render(<RoboDivider className='my-custom-class' />);
    const el = container.querySelector('[data-slot="divider"]');
    expect(el?.className).toContain('my-custom-class');
  });

  /* ---------------------------------------------------------------- */
  /* displayName                                                        */
  /* ---------------------------------------------------------------- */

  it('has displayName RoboDivider', () => {
    expect(RoboDivider.displayName).toBe('RoboDivider');
  });
});
