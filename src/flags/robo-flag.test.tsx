import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { RoboFlag } from './robo-flag';

describe('RoboFlag', () => {
  describe('known country codes', () => {
    it('renders an img element', () => {
      render(<RoboFlag code='us' />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('uses the country name as alt text', () => {
      render(<RoboFlag code='us' />);
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'United States');
    });

    it('uses a custom alt prop when provided', () => {
      render(<RoboFlag code='us' alt='Custom alt' />);
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Custom alt');
    });

    it('is case-insensitive for the code prop', () => {
      render(<RoboFlag code='US' />);
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'United States');
    });

    it('renders flags with sub-codes (gb-eng, gb-sct, etc.)', () => {
      render(<RoboFlag code='gb-sct' />);
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Scotland');
    });
  });

  describe('unknown country codes', () => {
    it('renders a span placeholder instead of an img', () => {
      render(<RoboFlag code='xx' />);
      // Unknown code renders a span with role="img"
      const el = screen.getByRole('img');
      expect(el.tagName).toBe('SPAN');
    });

    it('sets a descriptive aria-label on the placeholder', () => {
      render(<RoboFlag code='xx' />);
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Unknown flag: xx');
    });

    it('respects a custom alt on the placeholder', () => {
      render(<RoboFlag code='xx' alt='No flag available' />);
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'No flag available');
    });
  });

  describe('size variants', () => {
    it.each([
      ['xs', 'h-4 w-6'],
      ['sm', 'h-5 w-7'],
      ['md', 'h-6 w-9'],
      ['lg', 'h-8 w-12'],
    ] as const)('applies %s size classes', (size, expectedClasses) => {
      render(<RoboFlag code='us' size={size} />);
      const img = screen.getByRole('img');
      for (const cls of expectedClasses.split(' ')) {
        expect(img).toHaveClass(cls);
      }
    });
  });

  describe('rounded prop', () => {
    it('applies rounded-sm class by default', () => {
      render(<RoboFlag code='us' />);
      expect(screen.getByRole('img')).toHaveClass('rounded-sm');
    });

    it('removes rounded class when rounded={false}', () => {
      render(<RoboFlag code='us' rounded={false} />);
      expect(screen.getByRole('img')).not.toHaveClass('rounded-sm');
    });
  });

  describe('className forwarding', () => {
    it('merges custom className onto the element', () => {
      render(<RoboFlag code='us' className='my-custom-class' />);
      expect(screen.getByRole('img')).toHaveClass('my-custom-class');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the img element', () => {
      const ref = React.createRef<HTMLImageElement>();
      render(<RoboFlag code='us' ref={ref} />);
      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe('IMG');
    });
  });
});
