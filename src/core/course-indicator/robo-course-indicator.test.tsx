import { render, screen } from '@testing-library/react';

import { RoboCourseIndicator } from './robo-course-indicator';

describe('RoboCourseIndicator', () => {
  // -----------------------------------------------------------------------
  // Default rendering (both arrow + value)
  // -----------------------------------------------------------------------

  it('renders arrow and degree value by default', () => {
    render(<RoboCourseIndicator course={142} />);
    expect(screen.getByText('142°')).toBeInTheDocument();
    // Arrow icon should be present (aria-hidden SVG)
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies rotation transform to the arrow', () => {
    render(<RoboCourseIndicator course={90} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveStyle({ transform: 'rotate(90deg)' });
  });

  // -----------------------------------------------------------------------
  // Display modes
  // -----------------------------------------------------------------------

  it('renders only the arrow when display="arrow"', () => {
    render(<RoboCourseIndicator course={45} display="arrow" />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // No degree text visible
    expect(screen.queryByText('45°')).not.toBeInTheDocument();
  });

  it('renders only the value when display="value"', () => {
    render(<RoboCourseIndicator course={270} display="value" />);
    expect(screen.getByText('270°')).toBeInTheDocument();
    // No arrow SVG
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders both arrow and value when display="both"', () => {
    render(<RoboCourseIndicator course={180} display="both" />);
    expect(screen.getByText('180°')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Null / undefined handling
  // -----------------------------------------------------------------------

  it('renders a dash when course is null', () => {
    render(<RoboCourseIndicator course={null} />);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders a dash when course is undefined', () => {
    render(<RoboCourseIndicator course={undefined} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Normalization
  // -----------------------------------------------------------------------

  it('normalizes negative course values for rotation', () => {
    render(<RoboCourseIndicator course={-90} />);
    const svg = document.querySelector('svg');
    // -90 normalized = 270
    expect(svg).toHaveStyle({ transform: 'rotate(270deg)' });
    // But the text still shows the original value
    expect(screen.getByText('-90°')).toBeInTheDocument();
  });

  it('normalizes course values over 360', () => {
    render(<RoboCourseIndicator course={450} />);
    const svg = document.querySelector('svg');
    // 450 normalized = 90
    expect(svg).toHaveStyle({ transform: 'rotate(90deg)' });
    expect(screen.getByText('450°')).toBeInTheDocument();
  });

  it('handles course of 0', () => {
    render(<RoboCourseIndicator course={0} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveStyle({ transform: 'rotate(0deg)' });
    expect(screen.getByText('0°')).toBeInTheDocument();
  });

  it('handles course of 360', () => {
    render(<RoboCourseIndicator course={360} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveStyle({ transform: 'rotate(0deg)' });
  });

  // -----------------------------------------------------------------------
  // Accessibility
  // -----------------------------------------------------------------------

  it('adds aria-label and role when display="arrow"', () => {
    render(<RoboCourseIndicator course={135} display="arrow" />);
    const el = screen.getByRole('img');
    expect(el).toHaveAttribute('aria-label', 'Course: 135°');
  });

  it('does not add role="img" when value is visible', () => {
    render(<RoboCourseIndicator course={135} display="both" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Size variants
  // -----------------------------------------------------------------------

  it('applies sm size classes', () => {
    const { container } = render(<RoboCourseIndicator course={90} size="sm" />);
    expect(container.firstChild).toHaveClass('text-xs');
  });

  it('applies lg size classes', () => {
    const { container } = render(<RoboCourseIndicator course={90} size="lg" />);
    expect(container.firstChild).toHaveClass('text-base');
  });

  // -----------------------------------------------------------------------
  // Custom props
  // -----------------------------------------------------------------------

  it('forwards className', () => {
    const { container } = render(
      <RoboCourseIndicator course={90} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<RoboCourseIndicator course={90} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
