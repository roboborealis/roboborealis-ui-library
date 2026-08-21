// recover from story chunks that fail to load.
//
// Every story on the published Storybook showed "Failed to fetch dynamically
// imported module" until the visitor pressed hard-reload. Two causes produce
// that identical error, and a single reload fixes both: the private-Pages auth
// cookie expiring (it is issued with `Max-Age=600`, and a dynamic `import()`
// cannot follow the resulting redirect the way a navigation can), and a new
// deploy rotating Vite's content hashes out from under a cached `iframe.html`.
//
// Retrying the import in place does not work — the browser caches the rejected
// module record — so a reload is the only recovery, which is what Vite itself
// recommends for this event. https://vite.dev/guide/troubleshooting
//
// GitLab Pages supports custom cache headers only instance-wide
// (`gitlab_pages['headers']`), never per project, so the deploy-rotation half
// cannot be fixed with a `_headers` file in this repo.

const RELOAD_COUNT_KEY = 'robo:stale-chunk-reload-count';

/** Ceiling per tab session. Without it, a permanently broken deploy reloads forever. */
const MAX_RELOADS_PER_SESSION = 3;

let installed = false;

/** Reads the reload tally, treating anything unusable as zero. */
function readReloadCount(storage: Storage): number {
  const parsed = Number(storage.getItem(RELOAD_COUNT_KEY));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/** Whether a failed chunk load should trigger a recovery reload. Exported for the loop-guard test. */
export function shouldReload(storage: Storage): boolean {
  return readReloadCount(storage) < MAX_RELOADS_PER_SESSION;
}

/** Records a reload so `shouldReload` eventually gives up. Exported for the loop-guard test. */
export function recordReload(storage: Storage): void {
  storage.setItem(RELOAD_COUNT_KEY, String(readReloadCount(storage) + 1));
}

/** Installs the `vite:preloadError` listener. Idempotent; a no-op when storage is unavailable. */
export function installStaleChunkRecovery(win: Window = window): void {
  if (installed) return;
  installed = true;

  win.addEventListener('vite:preloadError', (event) => {
    let storage: Storage;
    try {
      storage = win.sessionStorage;
    } catch {
      // Storage blocked (private mode, third-party cookie policy). Surface the
      // error rather than reloading with no loop protection at all.
      return;
    }

    if (!shouldReload(storage)) return;

    // Suppress the default throw only once committed to reloading, so a
    // rate-limited failure still reports itself in the console.
    event.preventDefault();
    recordReload(storage);
    win.location.reload();
  });
}
