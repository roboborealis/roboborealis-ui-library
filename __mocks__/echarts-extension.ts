import { vi } from 'vitest';

/** Stand-in for a registrable ECharts transform. `registerTransform` is itself a mock, so only the shape matters. */
const transformStub = { type: 'mock:transform', transform: vi.fn(() => []) };

// `echarts-stat`'s default export is indexed at module scope
// (`ecStat.transform.regression`), so a bare `{}` throws on import. The Proxy
// answers for any transform name without tracking the real package's surface.
const transform: Record<string, typeof transformStub> = new Proxy(
  {},
  { get: () => transformStub },
);

export default { transform };
export const install = vi.fn();
