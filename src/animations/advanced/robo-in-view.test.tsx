import { render, screen } from '@testing-library/react';
import { RoboInView } from './robo-in-view';

describe('RoboInView', () => {
  it('renders children (mock useInView returns true immediately)', () => {
    render(<RoboInView><p>section content</p></RoboInView>);
    expect(screen.getByText('section content')).toBeInTheDocument();
  });
});
