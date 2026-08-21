import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { RoboButton } from './robo-button';


describe('RoboButton', () => {
  it('renders with default props (variant=default, size=md)', () => {
    render(<RoboButton>Click me</RoboButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    render(<RoboButton variant='default'>Default</RoboButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-[var(--primary)]');
  });

  it('applies secondary variant class', () => {
    render(<RoboButton variant='secondary'>Secondary</RoboButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-[var(--secondary)]');
  });

  it('applies ghost variant class', () => {
    render(<RoboButton variant='ghost'>Ghost</RoboButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-transparent');
  });

  it('applies destructive variant class', () => {
    render(<RoboButton variant='destructive'>Destructive</RoboButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-[var(--destructive)]');
  });

  it('applies outline variant class', () => {
    render(<RoboButton variant='outline'>Outline</RoboButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('border');
  });

  it('applies sm size class', () => {
    render(<RoboButton size='sm'>Small</RoboButton>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/h-\[var\(--btn-h-sm\)\]|h-8/);
  });

  it('applies md size class', () => {
    render(<RoboButton size='md'>Medium</RoboButton>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/h-\[var\(--btn-h-md\)\]|h-10/);
  });

  it('applies lg size class', () => {
    render(<RoboButton size='lg'>Large</RoboButton>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/h-\[var\(--btn-h-lg\)\]|h-12/);
  });

  it('disabled prop sets aria-disabled and prevents click', async () => {
    const handleClick = vi.fn();
    render(<RoboButton disabled onClick={handleClick}>Disabled</RoboButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('click handler fires on click', async () => {
    const handleClick = vi.fn();
    render(<RoboButton onClick={handleClick}>Click</RoboButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('ref forwarding points to the button DOM element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboButton ref={ref}>Ref Test</RoboButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has displayName RoboButton', () => {
    expect(RoboButton.displayName).toBe('RoboButton');
  });

  it('passes className through', () => {
    render(<RoboButton className='custom-cls'>Button</RoboButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-cls');
  });

  it('no a11y violations for default variant', async () => {
    const { container } = render(<RoboButton>Accessible</RoboButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for secondary variant', async () => {
    const { container } = render(<RoboButton variant='secondary'>Secondary</RoboButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for ghost variant', async () => {
    const { container } = render(<RoboButton variant='ghost'>Ghost</RoboButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for destructive variant', async () => {
    const { container } = render(<RoboButton variant='destructive'>Destructive</RoboButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations for outline variant', async () => {
    const { container } = render(<RoboButton variant='outline'>Outline</RoboButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('asChild renders child element via Radix Slot', () => {
    render(
      <RoboButton asChild>
        <a href='#'>Link</a>
      </RoboButton>
    );
    // Should render as <a> not <button>
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('defaults type to "button" so it never submits a surrounding form', () => {
    render(<RoboButton>Click me</RoboButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('respects an explicitly passed type', () => {
    render(<RoboButton type='submit'>Submit</RoboButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('does not force a type attribute onto an asChild non-button element', () => {
    render(
      <RoboButton asChild>
        <a href='#'>Link</a>
      </RoboButton>
    );
    expect(screen.getByRole('link')).not.toHaveAttribute('type');
  });

  it('applies a pointer cursor class', () => {
    render(<RoboButton>Click me</RoboButton>);
    expect(screen.getByRole('button').className).toContain('cursor-pointer');
  });

  it('applies a not-allowed cursor class when disabled', () => {
    render(<RoboButton disabled>Click me</RoboButton>);
    expect(screen.getByRole('button').className).toContain('disabled:cursor-not-allowed');
  });
});
