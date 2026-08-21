import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RoboGrid } from './robo-grid';

describe('RoboGrid', () => {
  it('renders children', () => {
    render(
      <RoboGrid>
        <div>Child</div>
      </RoboGrid>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies data-slot="grid"', () => {
    const { container } = render(<RoboGrid>Content</RoboGrid>);
    const grid = container.firstChild as HTMLElement;
    expect(grid.getAttribute('data-slot')).toBe('grid');
  });

  it('accepts and applies a custom className', () => {
    const { container } = render(
      <RoboGrid className='custom-class'>Content</RoboGrid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('custom-class');
  });

  it('defaults to 12 columns via inline style', () => {
    const { container } = render(<RoboGrid>Content</RoboGrid>);
    const grid = container.firstChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toContain('repeat(12');
  });

  it('applies custom cols via inline style', () => {
    const { container } = render(<RoboGrid cols={3}>Content</RoboGrid>);
    const grid = container.firstChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toContain('repeat(3');
  });

  it.each([
    ['none', 'gap-0'],
    ['xs', 'gap-2'],
    ['sm', 'gap-3'],
    ['md', 'gap-4'],
    ['lg', 'gap-6'],
    ['xl', 'gap-8'],
  ] as const)('applies gap class "%s" → "%s"', (gapProp, expectedClass) => {
    const { container } = render(
      <RoboGrid gap={gapProp}>Content</RoboGrid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain(expectedClass);
  });

  it('applies gap-x-* and gap-y-* separately when rowGap is provided', () => {
    const { container } = render(
      <RoboGrid gap='lg' rowGap='xs'>
        Content
      </RoboGrid>
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('gap-x-6');
    expect(grid.className).toContain('gap-y-2');
    // The unified gap class should NOT be present
    expect(grid.className).not.toContain(' gap-6 ');
  });

  it('does not apply gap-x-*/gap-y-* when rowGap is not provided', () => {
    const { container } = render(<RoboGrid gap='md'>Content</RoboGrid>);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).not.toContain('gap-x-');
    expect(grid.className).not.toContain('gap-y-');
  });

  it('forwards ref to the div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboGrid ref={ref}>Content</RoboGrid>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('sets displayName', () => {
    expect(RoboGrid.displayName).toBe('RoboGrid');
  });

  it('passes additional HTML attributes to the div', () => {
    render(<RoboGrid aria-label='layout grid'>Content</RoboGrid>);
    expect(
      screen.getByRole('generic', { name: 'layout grid' })
    ).toBeInTheDocument();
  });
});
