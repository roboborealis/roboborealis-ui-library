'use client';

import * as React from 'react';

import { RoboCard, RoboCardBody, RoboCardHeader } from '../card/robo-card';
import { RoboButton } from '../button/robo-button';
import { useTourRegistry } from './robo-tour-provider';

/**
 * RoboTourSettingsCard — Settings card listing every tour registered with the
 * app's `RoboTourProvider`, each with its own "Restart tour" button. Add one
 * `<RoboProductTour>` and this card picks it up automatically — no Settings
 * code change needed when a consuming app registers a second or third tour.
 *
 * Must be rendered under a mounted `RoboTourProvider` (throws otherwise, via
 * `useTourRegistry` — mirrors the existing Keybinds settings card's use of
 * `useKeybindRegistry`).
 *
 * @example
 * ```tsx
 * <RoboTourProvider>
 *   <RoboProductTour id="app-shell" label="Basic app tour" steps={STEPS} />
 *   <SettingsView>
 *     <RoboTourSettingsCard />
 *   </SettingsView>
 * </RoboTourProvider>
 * ```
 */
function RoboTourSettingsCard() {
  const { list, restart } = useTourRegistry();
  const tours = list();

  return (
    <RoboCard data-slot='tour-settings-card'>
      <RoboCardHeader>Product tour</RoboCardHeader>
      <RoboCardBody>
        {tours.length === 0 ? (
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            No tours are registered for this app yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tours.map((tour) => (
              <div
                key={tour.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{tour.label}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    {tour.completed ? 'Completed' : 'Not yet taken'}
                  </span>
                </div>
                <RoboButton variant='outline' size='sm' onClick={() => restart(tour.id)}>
                  Restart tour
                </RoboButton>
              </div>
            ))}
          </div>
        )}
      </RoboCardBody>
    </RoboCard>
  );
}
RoboTourSettingsCard.displayName = 'RoboTourSettingsCard';

export { RoboTourSettingsCard };
