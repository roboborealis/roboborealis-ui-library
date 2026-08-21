import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RoboAvatar, RoboAvatarGroup } from './robo-avatar';

// Radix Avatar renders Fallback asynchronously (after image load attempt).
// Use findByText (which retries) instead of getByText.

describe('RoboAvatar', () => {
  it('renders initials fallback when no src', async () => {
    render(<RoboAvatar fallback='MT' />);
    expect(await screen.findByText('MT')).toBeInTheDocument();
  });

  it('truncates fallback to 2 characters', async () => {
    render(<RoboAvatar fallback='Matthew Taylor' />);
    expect(await screen.findByText('Ma')).toBeInTheDocument();
  });

  it('shows ? when no fallback provided', async () => {
    render(<RoboAvatar />);
    expect(await screen.findByText('?')).toBeInTheDocument();
  });

  it('shows status dot with aria-label', async () => {
    render(<RoboAvatar fallback='JD' status='online' />);
    // Status dot is a sibling span; render it immediately
    expect(screen.getByLabelText('Online')).toBeInTheDocument();
  });

  it('renders each status type', () => {
    const statuses = ['online', 'away', 'busy', 'offline'] as const;
    statuses.forEach((status) => {
      const { unmount } = render(<RoboAvatar fallback='AB' status={status} />);
      const label = { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Offline' }[status];
      expect(screen.getByLabelText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('forwards ref', async () => {
    const ref = React.createRef<React.ElementRef<typeof import('@radix-ui/react-avatar').Root>>();
    render(<RoboAvatar fallback='MT' ref={ref as React.Ref<HTMLSpanElement>} />);
    await screen.findByText('MT');
    // ref points to the Avatar Root element
    expect(ref.current).not.toBeNull();
  });
});

describe('RoboAvatar WCAG fixes', () => {
  it('offline status dot does not use muted-foreground token', () => {
    const { container } = render(<RoboAvatar fallback="MT" status="offline" />);
    const dot = container.querySelector('[aria-label="Offline"]') as HTMLElement;
    expect(dot).not.toBeNull();
    expect(dot.className).not.toContain('muted-foreground');
  });

  it('status dot has role="img" so aria-label is exposed to AT', () => {
    render(<RoboAvatar fallback="MT" status="online" />);
    expect(screen.getByRole('img', { name: 'Online' })).toBeInTheDocument();
  });

  it('all status values have accessible img role', () => {
    const statuses = ['online', 'away', 'busy', 'offline'] as const;
    statuses.forEach(status => {
      const { unmount } = render(<RoboAvatar fallback="MT" status={status} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      unmount();
    });
  });
});

describe('RoboAvatarGroup', () => {
  it('renders all avatars when under max', async () => {
    render(
      <RoboAvatarGroup>
        <RoboAvatar fallback='A1' />
        <RoboAvatar fallback='A2' />
        <RoboAvatar fallback='A3' />
      </RoboAvatarGroup>
    );
    expect(await screen.findByText('A1')).toBeInTheDocument();
    expect(await screen.findByText('A2')).toBeInTheDocument();
    expect(await screen.findByText('A3')).toBeInTheDocument();
  });

  it('shows overflow indicator when avatars exceed max', async () => {
    render(
      <RoboAvatarGroup max={2}>
        <RoboAvatar fallback='A1' />
        <RoboAvatar fallback='A2' />
        <RoboAvatar fallback='A3' />
        <RoboAvatar fallback='A4' />
      </RoboAvatarGroup>
    );
    expect(screen.getByLabelText('2 more')).toBeInTheDocument();
    expect(screen.queryByText('A3')).not.toBeInTheDocument();
  });
});
