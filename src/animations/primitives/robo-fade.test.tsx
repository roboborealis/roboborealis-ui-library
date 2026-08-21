import { render, screen } from '@testing-library/react';
import { RoboFadeIn } from './robo-fade';

describe('RoboFadeIn', () => {
  it('renders children', () => {
    render(<RoboFadeIn><span>Hello</span></RoboFadeIn>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(
      <RoboFadeIn className="test-cls"><span>x</span></RoboFadeIn>
    );
    expect(container.firstChild).toHaveClass('test-cls');
  });
});
