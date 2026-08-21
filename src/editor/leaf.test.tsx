import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboLeaf } from './leaf';


// ---------------------------------------------------------------------------
// Helper — minimal RenderLeafProps stub
// ---------------------------------------------------------------------------

function renderLeaf(marks: Record<string, boolean> = {}, text = 'Hello') {
  const leaf = { text, ...marks } as any;
  const attributes = { 'data-slate-leaf': true } as any;
  return render(
    <RoboLeaf attributes={attributes} leaf={leaf} text={leaf}>
      {text}
    </RoboLeaf>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboLeaf', () => {
  it('has displayName', () => {
    expect(RoboLeaf.displayName).toBe('RoboLeaf');
  });

  it('renders plain text in a span', () => {
    const { container } = renderLeaf();
    expect(container.querySelector('span')).toHaveTextContent('Hello');
  });

  it('wraps bold text in <strong>', () => {
    const { container } = renderLeaf({ bold: true });
    expect(container.querySelector('strong')).toHaveTextContent('Hello');
  });

  it('wraps italic text in <em>', () => {
    const { container } = renderLeaf({ italic: true });
    expect(container.querySelector('em')).toHaveTextContent('Hello');
  });

  it('wraps underline text in <u>', () => {
    const { container } = renderLeaf({ underline: true });
    expect(container.querySelector('u')).toHaveTextContent('Hello');
  });

  it('wraps code text in <code>', () => {
    const { container } = renderLeaf({ code: true });
    expect(container.querySelector('code')).toHaveTextContent('Hello');
  });

  it('stacks multiple marks (bold + italic)', () => {
    const { container } = renderLeaf({ bold: true, italic: true });
    expect(container.querySelector('strong')).toBeInTheDocument();
    expect(container.querySelector('em')).toBeInTheDocument();
  });

  it('stacks all marks simultaneously', () => {
    const { container } = renderLeaf({ bold: true, italic: true, underline: true, code: true });
    expect(container.querySelector('strong')).toBeInTheDocument();
    expect(container.querySelector('em')).toBeInTheDocument();
    expect(container.querySelector('u')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
  });

  it('passes axe accessibility checks', async () => {
    const { container } = renderLeaf({ bold: true });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
