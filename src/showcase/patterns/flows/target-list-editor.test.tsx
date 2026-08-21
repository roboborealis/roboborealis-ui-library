import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// @roboborealis/space-faker is mocked for deterministic fixture data.
vi.mock('@roboborealis/space-faker', () => ({
  makeCatalog: (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: `dso${i}`,
      designation: `M${i + 1}`,
      commonName: `Test Object ${i}`,
      type: 'Galaxy',
      constellation: 'Orion',
      ra: '05h 35m',
      dec: '-05° 23\'',
      magnitude: 5 + i,
      distanceLy: 1000 * (i + 1),
      discoveredYear: 1800 + i,
    })),
}));

import { TargetListEditorPattern } from './target-list-editor.stories';

describe('Target List Editor pattern', () => {
  it('renders the target list table without crashing', () => {
    render(<>{TargetListEditorPattern.render?.({}, {} as never)}</>);
    expect(screen.getByText(/targets$/)).toBeInTheDocument();
  });

  it('opens the edit panel when a row is selected', async () => {
    const user = userEvent.setup();
    render(<>{TargetListEditorPattern.render?.({}, {} as never)}</>);

    await user.click(screen.getByLabelText('Select row dso0'));

    expect(screen.getByText('Edit Target')).toBeInTheDocument();
  });

  it('closes the edit panel when the same row is clicked again', async () => {
    const user = userEvent.setup();
    render(<>{TargetListEditorPattern.render?.({}, {} as never)}</>);

    const rowCheckbox = screen.getByLabelText('Select row dso0');
    await user.click(rowCheckbox);
    expect(screen.getByText('Edit Target')).toBeInTheDocument();

    await user.click(rowCheckbox);
    expect(screen.queryByText('Edit Target')).not.toBeInTheDocument();
  });
});
