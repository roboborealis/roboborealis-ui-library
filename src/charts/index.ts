// @roboborealis/components/charts — Line, Bar, Area, Pie, StatCard
export { RoboLineChart } from './line-chart/robo-line-chart';
export type { RoboLineChartProps, RoboLineChartLine } from './line-chart/robo-line-chart';

export { RoboBarChart } from './bar-chart/robo-bar-chart';
export type { RoboBarChartProps, RoboBarChartBar } from './bar-chart/robo-bar-chart';

export { RoboAreaChart } from './area-chart/robo-area-chart';
export type { RoboAreaChartProps, RoboAreaChartArea } from './area-chart/robo-area-chart';

export { RoboPieChart } from './pie-chart/robo-pie-chart';
export type { RoboPieChartProps, RoboPieChartDataItem } from './pie-chart/robo-pie-chart';

export { RoboStatCard } from './stat-card/robo-stat-card';
export type { RoboStatCardProps } from './stat-card/robo-stat-card';

export { getChartColor, getTooltipStyle, resolveToken } from './utils';

export {
  getChartColors,
  getRoboTooltipFormatter,
  useRoboEChartsTheme,
} from './echarts/echarts-theme';

// ECharts components
export { RoboHeatmap } from './echarts/robo-heatmap';
export type { RoboHeatmapProps } from './echarts/robo-heatmap';
export { RoboCalendarHeatmap } from './echarts/robo-calendar-heatmap';
export type { RoboCalendarHeatmapProps } from './echarts/robo-calendar-heatmap';
export { RoboTreemap } from './echarts/robo-treemap';
export type { RoboTreemapProps, RoboTreemapNode } from './echarts/robo-treemap';
export { RoboScatterChart } from './echarts/robo-scatter';
export type { RoboScatterChartProps, RoboScatterSeries } from './echarts/robo-scatter';
export { RoboGaugeChart } from './echarts/robo-gauge-chart';
export type { RoboGaugeChartProps, RoboGaugeVariant, RoboGaugeColorThreshold } from './echarts/robo-gauge-chart';
export { RoboSunburstChart } from './echarts/robo-sunburst-chart';
export type { RoboSunburstChartProps, RoboSunburstChartNode } from './echarts/robo-sunburst-chart';
export { RoboThemeRiverChart } from './echarts/robo-theme-river-chart';
export type { RoboThemeRiverChartProps } from './echarts/robo-theme-river-chart';
export { RoboParallelCoordinatesChart } from './echarts/robo-parallel-coordinates-chart';
export type {
  RoboParallelCoordinatesChartProps,
  RoboParallelAxis,
  RoboParallelCoordinatesSeries,
} from './echarts/robo-parallel-coordinates-chart';
export { RoboNightingaleChart } from './echarts/robo-nightingale-chart';
export type {
  RoboNightingaleChartProps,
  RoboNightingaleChartDataItem,
} from './echarts/robo-nightingale-chart';
export { RoboSingleAxisScatterChart } from './echarts/robo-single-axis-scatter-chart';
export type {
  RoboSingleAxisScatterChartProps,
  RoboSingleAxisScatterChartSeries,
} from './echarts/robo-single-axis-scatter-chart';
export { RoboCalendarScatterChart } from './echarts/robo-calendar-scatter-chart';
export type { RoboCalendarScatterChartProps } from './echarts/robo-calendar-scatter-chart';
export { RoboChordDiagram } from './echarts/robo-chord-diagram';
export type { RoboChordDiagramProps } from './echarts/robo-chord-diagram';
export { RoboSankeyFlowChart } from './echarts/robo-sankey-flow-chart';
export type { RoboSankeyFlowChartProps } from './echarts/robo-sankey-flow-chart';
export { RoboCirclePacking } from './echarts/robo-circle-packing';
export type { RoboCirclePackingProps, RoboCirclePackingNode } from './echarts/robo-circle-packing';
export { RoboMatrixSparkline } from './echarts/robo-matrix-sparkline';
export type { RoboMatrixSparklineProps } from './echarts/robo-matrix-sparkline';
export { RoboCorrelationHeatmap } from './echarts/robo-correlation-heatmap';
export type { RoboCorrelationHeatmapProps } from './echarts/robo-correlation-heatmap';
export { RoboCalendarBarChart } from './echarts/robo-calendar-bar-chart';
export type { RoboCalendarBarChartProps } from './echarts/robo-calendar-bar-chart';
export { RoboCalendarIconChart } from './echarts/robo-calendar-icon-chart';
export type { RoboCalendarIconChartProps, CelestialIconSymbol } from './echarts/robo-calendar-icon-chart';
export { RoboFunnelChart } from './echarts/robo-funnel-chart';
export type { RoboFunnelChartProps, RoboFunnelStage } from './echarts/robo-funnel-chart';
