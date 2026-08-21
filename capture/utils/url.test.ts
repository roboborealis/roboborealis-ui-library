import { describe, it, expect } from 'vitest';
import { extractStorySlug, storyUrlToIframeUrl } from './url';

describe('extractStorySlug', () => {
  it('extracts slug from story path param', () => {
    expect(
      extractStorySlug('http://localhost:6006/?path=/story/core-button--primary')
    ).toBe('core-button-primary');
  });

  it('collapses double dashes to single', () => {
    expect(
      extractStorySlug('http://localhost:6006/?path=/story/feedback-toast--default')
    ).toBe('feedback-toast-default');
  });

  it('returns fallback when no story param present', () => {
    expect(extractStorySlug('http://localhost:6006/')).toBe('storybook-capture');
  });
});

describe('storyUrlToIframeUrl', () => {
  it('converts story path URL to iframe URL', () => {
    expect(
      storyUrlToIframeUrl('http://localhost:6006/?path=/story/core-button--primary')
    ).toBe('http://localhost:6006/iframe.html?id=core-button--primary&viewMode=story');
  });

  it('passes through an already-iframe URL unchanged', () => {
    const url = 'http://localhost:6006/iframe.html?id=core-button--primary&viewMode=story';
    expect(storyUrlToIframeUrl(url)).toBe(url);
  });
});
