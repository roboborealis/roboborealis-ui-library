import { render, screen } from '@testing-library/react';
import { RoboSlideIn } from './robo-slide';

describe('RoboSlideIn', () => {
  it('renders children for each direction', () => {
    const { rerender } = render(<RoboSlideIn from="bottom"><div>content</div></RoboSlideIn>);
    expect(screen.getByText('content')).toBeInTheDocument();

    rerender(<RoboSlideIn from="left"><div>content</div></RoboSlideIn>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
