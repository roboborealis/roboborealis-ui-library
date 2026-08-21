import { render, screen } from '@testing-library/react';
import { RoboTransitionPanel } from './robo-transition-panel';

const panels = [
  { key: 'a', content: <div>Panel A</div> },
  { key: 'b', content: <div>Panel B</div> },
];

describe('RoboTransitionPanel', () => {
  it('renders the active panel content', () => {
    render(<RoboTransitionPanel panels={panels} activeKey="a" />);
    expect(screen.getByText('Panel A')).toBeInTheDocument();
  });

  it('switches panel on activeKey change', () => {
    const { rerender } = render(<RoboTransitionPanel panels={panels} activeKey="a" />);
    rerender(<RoboTransitionPanel panels={panels} activeKey="b" />);
    expect(screen.getByText('Panel B')).toBeInTheDocument();
  });
});
