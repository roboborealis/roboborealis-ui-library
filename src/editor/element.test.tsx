import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';

import { RoboElement } from './element';


// ---------------------------------------------------------------------------
// Helpers — minimal RenderElementProps stubs
// ---------------------------------------------------------------------------

function renderElement(
  type: string,
  extraProps: Record<string, unknown> = {},
  childText = 'Test content',
) {
  const element = { type, children: [{ text: childText }], ...extraProps } as any;
  const attributes = { 'data-slate-node': 'element' } as any;
  return render(
    <RoboElement attributes={attributes} element={element}>
      <span>{childText}</span>
    </RoboElement>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoboElement', () => {
  it('has displayName', () => {
    expect(RoboElement.displayName).toBe('RoboElement');
  });

  // --- Headings ---

  it('renders heading-one as <h1>', () => {
    renderElement('heading-one');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test content');
  });

  it('renders heading-two as <h2>', () => {
    renderElement('heading-two');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test content');
  });

  it('renders heading-three as <h3>', () => {
    renderElement('heading-three');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test content');
  });

  it('renders heading-four as <h4>', () => {
    renderElement('heading-four');
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Test content');
  });

  // --- Lists ---

  it('renders bulleted-list as <ul>', () => {
    const { container } = renderElement('bulleted-list');
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('renders numbered-list as <ol>', () => {
    const { container } = renderElement('numbered-list');
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('renders list-item as <li>', () => {
    const { container } = renderElement('list-item');
    expect(container.querySelector('li')).toBeInTheDocument();
  });

  // --- Link ---

  it('renders link as <a> with href, rel, and target', () => {
    renderElement('link', { url: 'https://example.com' });
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // --- Horizontal rule ---

  it('renders horizontal-rule as <hr>', () => {
    const { container } = renderElement('horizontal-rule');
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  // --- Default (paragraph) ---

  it('renders unknown types as <p>', () => {
    const { container } = renderElement('paragraph');
    expect(container.querySelector('p')).toHaveTextContent('Test content');
  });

  // --- Accessibility ---

  it('passes axe accessibility checks for a paragraph', async () => {
    const { container } = renderElement('paragraph');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks for a link', async () => {
    const { container } = renderElement('link', { url: 'https://example.com' }, 'Click here');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
