import type { CSSProperties } from 'react';

interface ReactEChartsProps {
  option?: unknown;
  theme?: string;
  style?: CSSProperties;
  notMerge?: boolean;
  'aria-label'?: string;
  [key: string]: unknown;
}

const ReactECharts = ({ style, 'aria-label': ariaLabel }: ReactEChartsProps) => (
  <div data-testid='echarts-chart' style={style} aria-label={ariaLabel} />
);

ReactECharts.displayName = 'ReactECharts';

export default ReactECharts;
