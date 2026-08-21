import { render, screen } from '@testing-library/react';
import { RoboTextEffect } from './robo-text-effect';

describe('RoboTextEffect', () => {
  it('exposes full text via aria-label for screen readers', () => {
    render(<RoboTextEffect text="Constellation Overview" />);
    expect(screen.getByLabelText('Constellation Overview')).toBeInTheDocument();
  });

  it('forwards className to wrapper', () => {
    const { container } = render(
      <RoboTextEffect text="Test" className="heading-cls" />
    );
    expect(container.querySelector('.heading-cls')).toBeTruthy();
  });
});
