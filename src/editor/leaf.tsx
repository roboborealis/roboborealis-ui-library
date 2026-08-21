import * as React from 'react';
import type { RenderLeafProps } from 'slate-react';

/**
 * RoboLeaf — renders inline text marks (bold, italic, underline, code).
 */
export const RoboLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let content = children;

  if (leaf.bold) {
    content = <strong>{content}</strong>;
  }

  if (leaf.italic) {
    content = <em>{content}</em>;
  }

  if (leaf.underline) {
    content = <u>{content}</u>;
  }

  if (leaf.code) {
    content = (
      <code className='rounded bg-[var(--muted)] px-1 py-0.5 font-mono text-sm text-[var(--foreground)]'>
        {content}
      </code>
    );
  }

  return <span {...attributes}>{content}</span>;
};

RoboLeaf.displayName = 'RoboLeaf';
