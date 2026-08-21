import { render, screen } from '@testing-library/react';
import { RoboStagger } from './robo-stagger';

describe('RoboStagger', () => {
  it('renders all children', () => {
    render(
      <RoboStagger>
        <div>one</div>
        <div>two</div>
        <div>three</div>
      </RoboStagger>
    );
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(screen.getByText('three')).toBeInTheDocument();
  });
});
