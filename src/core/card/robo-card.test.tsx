import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { RoboCard, RoboCardHeader, RoboCardBody, RoboCardFooter } from './robo-card';


describe('RoboCard', () => {
  it('renders with default variant', () => {
    render(<RoboCard data-testid='card'>Content</RoboCard>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('default variant applies border and shadow class', () => {
    render(<RoboCard data-testid='card' variant='default'>Content</RoboCard>);
    const card = screen.getByTestId('card');
    expect(card.className).toContain('bg-[var(--card)]');
    expect(card.className).toContain('border');
  });

  it('outlined variant applies 2-border class', () => {
    render(<RoboCard data-testid='card' variant='outlined'>Content</RoboCard>);
    expect(screen.getByTestId('card').className).toContain('border-2');
  });

  it('elevated variant applies shadow-lg class', () => {
    render(<RoboCard data-testid='card' variant='elevated'>Content</RoboCard>);
    expect(screen.getByTestId('card').className).toContain('shadow-[var(--shadow-lg)]');
  });

  it('ghost variant applies bg-transparent class', () => {
    render(<RoboCard data-testid='card' variant='ghost'>Content</RoboCard>);
    expect(screen.getByTestId('card').className).toContain('bg-transparent');
  });

  it('hoverable prop adds transition and cursor-pointer classes', () => {
    render(<RoboCard data-testid='card' hoverable>Content</RoboCard>);
    const card = screen.getByTestId('card');
    expect(card.className).toContain('transition-shadow');
    expect(card.className).toContain('cursor-pointer');
  });

  it('forwards ref to underlying div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboCard ref={ref}>Card</RoboCard>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has displayName RoboCard', () => {
    expect(RoboCard.displayName).toBe('RoboCard');
  });
});

describe('RoboCardHeader', () => {
  it('renders header content', () => {
    render(<RoboCardHeader>Header text</RoboCardHeader>);
    expect(screen.getByText('Header text')).toBeInTheDocument();
  });

  it('has displayName RoboCardHeader', () => {
    expect(RoboCardHeader.displayName).toBe('RoboCardHeader');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboCardHeader ref={ref}>Header</RoboCardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('RoboCardBody', () => {
  it('renders body content', () => {
    render(<RoboCardBody>Body text</RoboCardBody>);
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('has displayName RoboCardBody', () => {
    expect(RoboCardBody.displayName).toBe('RoboCardBody');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboCardBody ref={ref}>Body</RoboCardBody>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('RoboCardFooter', () => {
  it('renders footer content', () => {
    render(<RoboCardFooter>Footer text</RoboCardFooter>);
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('has displayName RoboCardFooter', () => {
    expect(RoboCardFooter.displayName).toBe('RoboCardFooter');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<RoboCardFooter ref={ref}>Footer</RoboCardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('RoboCard interactive guard', () => {
  it('has role="button" when onClick is provided', () => {
    render(<RoboCard onClick={() => {}}>Content</RoboCard>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when Enter is pressed', async () => {
    const handler = vi.fn();
    render(<RoboCard onClick={handler}>Content</RoboCard>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space is pressed', async () => {
    const handler = vi.fn();
    render(<RoboCard onClick={handler}>Content</RoboCard>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{ }');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not have role="button" when onClick is absent', () => {
    render(<RoboCard>Content</RoboCard>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('is focusable (tabIndex=0) when onClick is provided', () => {
    render(<RoboCard onClick={() => {}}>Content</RoboCard>);
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
  });
});

describe('RoboCard compound composition', () => {
  it('all three slots compose correctly inside RoboCard', () => {
    render(
      <RoboCard data-testid='card'>
        <RoboCardHeader>The Title</RoboCardHeader>
        <RoboCardBody>The Body</RoboCardBody>
        <RoboCardFooter>The Footer</RoboCardFooter>
      </RoboCard>
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('The Title')).toBeInTheDocument();
    expect(screen.getByText('The Body')).toBeInTheDocument();
    expect(screen.getByText('The Footer')).toBeInTheDocument();
  });

  it('no a11y violations for full composition', async () => {
    const { container } = render(
      <RoboCard>
        <RoboCardHeader>Title</RoboCardHeader>
        <RoboCardBody>Body content</RoboCardBody>
        <RoboCardFooter>Footer</RoboCardFooter>
      </RoboCard>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
