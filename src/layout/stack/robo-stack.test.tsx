import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RoboStack } from './robo-stack';

describe('RoboStack', () => {
  it('renders children', () => {
    render(
      <RoboStack>
        <span>Child</span>
      </RoboStack>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies data-slot="stack"', () => {
    const { container } = render(<RoboStack>Content</RoboStack>);
    const stack = container.firstChild as HTMLElement;
    expect(stack.getAttribute('data-slot')).toBe('stack');
  });

  it('defaults to vertical direction (flex-col)', () => {
    const { container } = render(<RoboStack>Content</RoboStack>);
    const stack = container.firstChild as HTMLElement;
    expect(stack.className).toContain('flex-col');
  });

  it('applies flex-row for horizontal direction', () => {
    const { container } = render(
      <RoboStack direction='horizontal'>Content</RoboStack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack.className).toContain('flex-row');
    expect(stack.className).not.toContain('flex-col');
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
      <RoboStack gap={gapProp}>Content</RoboStack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack.className).toContain(expectedClass);
  });

  it.each([
    ['start', 'items-start'],
    ['center', 'items-center'],
    ['end', 'items-end'],
    ['stretch', 'items-stretch'],
    ['baseline', 'items-baseline'],
  ] as const)('applies align class "%s" → "%s"', (alignProp, expectedClass) => {
    const { container } = render(
      <RoboStack align={alignProp}>Content</RoboStack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack.className).toContain(expectedClass);
  });

  it.each([
    ['start', 'justify-start'],
    ['center', 'justify-center'],
    ['end', 'justify-end'],
    ['between', 'justify-between'],
    ['around', 'justify-around'],
    ['evenly', 'justify-evenly'],
  ] as const)('applies justify class "%s" → "%s"', (justifyProp, expectedClass) => {
    const { container } = render(
      <RoboStack justify={justifyProp}>Content</RoboStack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack.className).toContain(expectedClass);
  });

  it('adds flex-wrap when wrap is true', () => {
    const { container } = render(<RoboStack wrap>Content</RoboStack>);
    const stack = container.firstChild as HTMLElement;
    expect(stack.className).toContain('flex-wrap');
  });

  it('does not add flex-wrap when wrap is false (default)', () => {
    const { container } = render(<RoboStack>Content</RoboStack>);
    const stack = container.firstChild as HTMLElement;
    expect(stack.className).not.toContain('flex-wrap');
  });

  it('uses inline-flex when inline is true', () => {
    const { container } = render(<RoboStack inline>Content</RoboStack>);
    const stack = container.firstChild as HTMLElement;
    expect(stack.className).toContain('inline-flex');
    expect(stack.className).not.toContain(' flex ');
  });

  it('uses flex (not inline-flex) by default', () => {
    const { container } = render(<RoboStack>Content</RoboStack>);
    const stack = container.firstChild as HTMLElement;
    // className should contain 'flex' but NOT 'inline-flex'
    expect(stack.className).toContain('flex');
    expect(stack.className).not.toContain('inline-flex');
  });

  it('accepts and applies a custom className', () => {
    const { container } = render(
      <RoboStack className='custom-stack'>Content</RoboStack>
    );
    const stack = container.firstChild as HTMLElement;
    expect(stack.className).toContain('custom-stack');
  });

  it('forwards ref to the div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboStack ref={ref}>Content</RoboStack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('sets displayName', () => {
    expect(RoboStack.displayName).toBe('RoboStack');
  });

  it('passes additional HTML attributes to the div', () => {
    render(<RoboStack aria-label='content stack'>Content</RoboStack>);
    expect(
      screen.getByRole('generic', { name: 'content stack' })
    ).toBeInTheDocument();
  });
});
