export function extractStorySlug(url: string): string {
  const match = url.match(/path=\/story\/([^&]+)/);
  if (!match) return 'storybook-capture';
  return match[1].replace(/--+/g, '-').replace(/[/\\%?:*|"<>]/g, '-');
}

export function storyUrlToIframeUrl(url: string): string {
  if (url.includes('/iframe.html')) return url;
  const match = url.match(/path=\/story\/([^&]+)/);
  if (!match) return url;
  const base = new URL(url).origin;
  return `${base}/iframe.html?id=${match[1]}&viewMode=story`;
}
