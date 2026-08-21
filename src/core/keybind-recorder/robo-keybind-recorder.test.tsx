import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { RoboKeybindRecorder } from './robo-keybind-recorder';
import { isMac, formatComboForDisplay } from '../keybinds/robo-keybind-utils';

// `mod` displays as ⌘ on Mac, Ctrl elsewhere, and a captured Meta/Ctrl keydown
// normalizes to `mod` only on its own platform — use the same check the
// component itself uses so these tests assert real behavior, not a platform.
const MOD_KEY = isMac() ? 'metaKey' : 'ctrlKey';

describe('RoboKeybindRecorder', () => {
  it('renders the current combo via RoboKbd segments when idle', () => {
    render(<RoboKeybindRecorder combo='mod+/' onChange={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveTextContent(formatComboForDisplay('mod+/').join(''));
  });

  it('clicking enters the listening state', async () => {
    const user = userEvent.setup();
    render(<RoboKeybindRecorder combo='mod+/' onChange={vi.fn()} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Press keys…')).toBeInTheDocument();
  });

  it('capturing a keydown while listening calls onChange with the normalized combo', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<RoboKeybindRecorder combo='mod+/' onChange={onChange} />);
    await user.click(screen.getByRole('button'));
    fireEvent.keyDown(screen.getByRole('button'), { key: 'k', [MOD_KEY]: true });
    expect(onChange).toHaveBeenCalledWith('mod+k');
  });

  it('ignores bare modifier keydowns while listening', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<RoboKeybindRecorder combo='mod+/' onChange={onChange} />);
    await user.click(screen.getByRole('button'));
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Meta', metaKey: true });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Press keys…')).toBeInTheDocument();
  });

  it('Escape while listening cancels without calling onChange', async () => {
    const onChange = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<RoboKeybindRecorder combo='mod+/' onChange={onChange} onCancel={onCancel} />);
    await user.click(screen.getByRole('button'));
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });
    expect(onChange).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
    expect(screen.queryByText('Press keys…')).not.toBeInTheDocument();
  });

  it('blurring away while listening cancels without calling onChange', async () => {
    const onChange = vi.fn();
    const onCancel = vi.fn();
    render(
      <div>
        <RoboKeybindRecorder combo='mod+/' onChange={onChange} onCancel={onCancel} />
        <button>Elsewhere</button>
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: /keyboard shortcut/i }));
    fireEvent.blur(screen.getByRole('button', { name: /listening for new shortcut/i }));
    expect(onChange).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders an inline conflict warning when conflictWith is set', () => {
    render(<RoboKeybindRecorder combo='mod+/' onChange={vi.fn()} conflictWith='Toggle Quick Panel' />);
    expect(screen.getByRole('alert')).toHaveTextContent('Already used by Toggle Quick Panel');
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<RoboKeybindRecorder combo='mod+/' onChange={vi.fn()} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has displayName RoboKeybindRecorder', () => {
    expect(RoboKeybindRecorder.displayName).toBe('RoboKeybindRecorder');
  });

  it('no a11y violations when idle', async () => {
    const { container } = render(<RoboKeybindRecorder combo='mod+/' onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('no a11y violations when listening', async () => {
    const user = userEvent.setup();
    const { container } = render(<RoboKeybindRecorder combo='mod+/' onChange={vi.fn()} />);
    await user.click(screen.getByRole('button'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
