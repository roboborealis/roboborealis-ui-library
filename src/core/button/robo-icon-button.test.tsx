import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { RoboIconButton } from './robo-icon-button';


const TestIcon = () => <svg data-testid='test-icon' aria-hidden='true' />;

describe('RoboIconButton', () => {
  it('renders icon passed as children', () => {
    render(<RoboIconButton aria-label='Close'><TestIcon /></RoboIconButton>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('requires aria-label (renders with aria-label set)', () => {
    render(<RoboIconButton aria-label='Settings'><TestIcon /></RoboIconButton>);
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });

  it('renders square dimensions for sm size (h-8 w-8)', () => {
    render(<RoboIconButton aria-label='Small' size='sm'><TestIcon /></RoboIconButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-8');
    expect(button.className).toContain('w-8');
  });

  it('renders square dimensions for md size (h-10 w-10)', () => {
    render(<RoboIconButton aria-label='Medium' size='md'><TestIcon /></RoboIconButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-10');
    expect(button.className).toContain('w-10');
  });

  it('renders square dimensions for lg size (h-12 w-12)', () => {
    render(<RoboIconButton aria-label='Large' size='lg'><TestIcon /></RoboIconButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-12');
    expect(button.className).toContain('w-12');
  });

  it('has displayName RoboIconButton', () => {
    expect(RoboIconButton.displayName).toBe('RoboIconButton');
  });

  it('forwards ref to the underlying button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboIconButton aria-label='Ref test' ref={ref}><TestIcon /></RoboIconButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('no a11y violations (has aria-label)', async () => {
    const { container } = render(
      <RoboIconButton aria-label='Close dialog'><TestIcon /></RoboIconButton>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
