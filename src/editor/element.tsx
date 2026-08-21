import * as React from 'react';
import type { RenderElementProps } from 'slate-react';

import type { CustomElement, LinkElement } from './types';

/**
 * RoboElement — renders block-level Slate elements as semantic HTML.
 * All styling uses CSS variable tokens (no hardcoded colors).
 */
export const RoboElement = ({ attributes, children, element }: RenderElementProps) => {
  const el = element as CustomElement;

  switch (el.type) {
    case 'heading-one':
      return (
        <h1
          {...attributes}
          className='mb-3 mt-4 font-heading text-4xl font-bold leading-tight text-[var(--foreground)]'
        >
          {children}
        </h1>
      );

    case 'heading-two':
      return (
        <h2
          {...attributes}
          className='mb-2 mt-4 font-heading text-3xl font-semibold leading-tight text-[var(--foreground)]'
        >
          {children}
        </h2>
      );

    case 'heading-three':
      return (
        <h3
          {...attributes}
          className='mb-2 mt-3 font-heading text-2xl font-semibold leading-snug text-[var(--foreground)]'
        >
          {children}
        </h3>
      );

    case 'heading-four':
      return (
        <h4
          {...attributes}
          className='mb-1 mt-3 font-heading text-xl font-semibold leading-snug text-[var(--foreground)]'
        >
          {children}
        </h4>
      );

    case 'bulleted-list':
      return (
        <ul
          {...attributes}
          className='my-2 list-disc pl-6 text-[var(--foreground)]'
        >
          {children}
        </ul>
      );

    case 'numbered-list':
      return (
        <ol
          {...attributes}
          className='my-2 list-decimal pl-6 text-[var(--foreground)]'
        >
          {children}
        </ol>
      );

    case 'list-item':
      return (
        <li {...attributes} className='my-0.5 leading-relaxed'>
          {children}
        </li>
      );

    case 'link': {
      const linkEl = el as LinkElement;
      return (
        <a
          {...attributes}
          href={linkEl.url}
          className='text-[var(--primary)] underline underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1'
          rel='noopener noreferrer'
          target='_blank'
        >
          {children}
        </a>
      );
    }

    case 'horizontal-rule':
      return (
        <div {...attributes} contentEditable={false} className='my-4'>
          <hr className='border-[var(--border)]' />
          {children}
        </div>
      );

    default:
      return (
        <p
          {...attributes}
          className='my-1 leading-relaxed text-[var(--foreground)]'
        >
          {children}
        </p>
      );
  }
};

RoboElement.displayName = 'RoboElement';
