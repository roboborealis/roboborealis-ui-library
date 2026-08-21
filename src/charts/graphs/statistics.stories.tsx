'use client';

/**
 * ECharts Statistics Extension Demo
 *
 * Demonstrates echarts-stat regression lines and clustering on space data.
 * Not a RoboComponent — dev/Storybook demo only to evaluate the extension.
 */

import type { Meta, StoryObj } from '@storybook/react';
import * as echarts from 'echarts/core';
import ReactECharts from 'echarts-for-react';

import { makeConstellation, makeEventHistory } from '@roboborealis/space-faker';

import { useRoboEChartsTheme } from '../echarts/echarts-theme';

// @ts-expect-error — no type declarations for echarts-stat
import ecStat from 'echarts-stat';

const transform = echarts.registerTransform;
// @ts-expect-error — no type declarations for ecStat.transform
transform(ecStat.transform.regression);
// @ts-expect-error — no type declarations for ecStat.transform
transform(ecStat.transform.clustering);

const constellation = makeConstellation(80, 31);
const scatterData = constellation
  .filter((s) => s.velocityKmS > 0)
  .map((s) => [s.massKg, s.velocityKmS]);

const incidents = makeEventHistory(300, 180);
const incidentByDay = incidents.reduce<Record<string, number>>((acc, inc) => {
  const d = new Date(inc.timestamp);
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {});
const timeSeriesData = Object.entries(incidentByDay)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([date, count]) => [date, count]);

function RegressionChart() {
  const theme = useRoboEChartsTheme();

  const option = {
    title: {
      text: 'Spacecraft Velocity vs Mass — Linear Regression',
      subtext: 'Lower mass → higher achievable velocity',
      left: 'center',
    },
    dataset: [
      { id: 'raw', source: scatterData },
      {
        id: 'regression',
        fromDatasetId: 'raw',
        transform: {
          type: 'ecStat:regression',
          config: { method: 'linear' },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    xAxis: {
      name: 'Mass (kg)',
      nameLocation: 'middle',
      nameGap: 30,
      splitLine: { lineStyle: { type: 'dashed' } },
    },
    yAxis: {
      name: 'Velocity (km/s)',
      nameLocation: 'middle',
      nameGap: 40,
      splitLine: { lineStyle: { type: 'dashed' } },
    },
    series: [
      {
        name: 'Spacecraft',
        type: 'scatter',
        datasetId: 'raw',
        symbolSize: 8,
        encode: { x: 0, y: 1 },
      },
      {
        name: 'Regression',
        type: 'line',
        datasetId: 'regression',
        smooth: true,
        symbolSize: 0,
        encode: { x: 0, y: 1 },
        lineStyle: { width: 2 },
      },
    ],
    legend: { data: ['Spacecraft', 'Regression'], bottom: 10 },
  };

  return <ReactECharts option={option} theme={theme} style={{ height: 480 }} notMerge />;
}

function ClusteringChart() {
  const theme = useRoboEChartsTheme();

  const clusterData = constellation.map((s) => [s.velocityKmS, s.massKg / 1000]);

  const option = {
    title: {
      text: 'Constellation Clustering — Velocity vs Mass (k=3)',
      left: 'center',
    },
    dataset: [
      { id: 'raw', source: clusterData },
      {
        id: 'clustered',
        fromDatasetId: 'raw',
        transform: {
          type: 'ecStat:clustering',
          config: {
            clusterCount: 3,
            outputType: 'single',
            outputClusterIndexDimension: 2,
          },
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      formatter: (p: { data: number[] }) =>
        `Velocity: ${p.data[0]?.toFixed(2)} km/s<br/>Mass: ${((p.data[1] ?? 0) * 1000).toLocaleString()} kg<br/>Cluster: ${p.data[2]}`,
    },
    visualMap: {
      type: 'piecewise',
      categories: ['0', '1', '2'],
      dimension: 2,
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      itemGap: 12,
    },
    xAxis: {
      name: 'Velocity (km/s)',
      nameLocation: 'middle',
      nameGap: 30,
    },
    yAxis: {
      name: 'Mass (×1000 kg)',
      nameLocation: 'middle',
      nameGap: 50,
    },
    series: [{
      name: 'Constellation',
      type: 'scatter',
      datasetId: 'clustered',
      encode: { x: 0, y: 1, itemGroupId: 2 },
      symbolSize: 10,
    }],
  };

  return <ReactECharts option={option} theme={theme} style={{ height: 460 }} notMerge />;
}

const meta: Meta = {
  title: 'Data/Charts/ECharts/Statistics',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`echarts-stat` extension — statistical transforms (regression, clustering, histogram) ' +
          'applied to space operational data. Not a RoboComponent — evaluate from this demo.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const SpeedTonnageRegression: Story = {
  name: 'Regression — Velocity vs Mass',
  render: () => <RegressionChart />,
};

export const ConstellationClustering: Story = {
  name: 'Clustering — Constellation Operational Groups (k=3)',
  render: () => <ClusteringChart />,
};

export const IncidentFrequency: Story = {
  name: 'Time Series — Daily Event Count',
  render: () => {
    return (
      <ReactECharts
        option={{
          title: { text: 'Daily Space Event Frequency (180 days)', left: 'center' },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: timeSeriesData.map(([d]) => d as string) },
          yAxis: { type: 'value', name: 'Events' },
          series: [{
            type: 'bar',
            data: timeSeriesData.map(([, v]) => v as number),
            smooth: true,
          }],
        }}
        style={{ height: 400 }}
        notMerge
      />
    );
  },
};
