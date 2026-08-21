import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// @roboborealis/space-faker is mocked for deterministic fixture data.
vi.mock('@roboborealis/space-faker', () => ({
  makeConstellation: (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: `sc${i}`,
      name: `Test Spacecraft ${i}`,
      noradId: `1000${i}`,
      cosparId: `2024-00${i}A`,
      operator: 'NASA',
      spacecraftType: 'Satellite',
      platform: 'LEOStar',
      spacecraftClass: 'Commercial',
      lengthM: 10,
      solarPanelSpanM: 20,
      powerKw: 5,
      massKg: 5000,
      callSign: `NAB-000${i}`,
      launchSite: 'Cape Canaveral',
      status: 'in-orbit',
      position: { lat: 30, lng: -80 },
      inclination: 0,
      velocityKmS: 7.66,
      raan: 0,
      timestamp: new Date(0).toISOString(),
    })),
}));

import { ConstellationEditorPattern } from './constellation-editor.stories';

describe('Constellation Editor pattern', () => {
  it('renders the constellation table without crashing', () => {
    render(<>{ConstellationEditorPattern.render?.({}, {} as never)}</>);
    expect(screen.getByText(/spacecraft$/)).toBeInTheDocument();
  });

  it('opens the edit panel when a row is selected', async () => {
    const user = userEvent.setup();
    render(<>{ConstellationEditorPattern.render?.({}, {} as never)}</>);

    await user.click(screen.getByLabelText('Select row sc0'));

    expect(screen.getByText('Edit Spacecraft')).toBeInTheDocument();
  });

  it('closes the edit panel when the same row is clicked again', async () => {
    const user = userEvent.setup();
    render(<>{ConstellationEditorPattern.render?.({}, {} as never)}</>);

    const rowCheckbox = screen.getByLabelText('Select row sc0');
    await user.click(rowCheckbox);
    expect(screen.getByText('Edit Spacecraft')).toBeInTheDocument();

    await user.click(rowCheckbox);
    expect(screen.queryByText('Edit Spacecraft')).not.toBeInTheDocument();
  });
});
