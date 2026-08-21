/** Allow TypeScript to resolve *.svg imports as string URLs (data URIs or paths). */
declare module '*.svg' {
  const url: string;
  export default url;
}
