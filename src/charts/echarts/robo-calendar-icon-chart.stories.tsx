import type { Meta, StoryObj } from '@storybook/react';

import { CHART_DATASET } from './mock-data';
import { RoboCalendarIconChart } from './robo-calendar-icon-chart';

const incidentYear = CHART_DATASET.incidentCalendarScatter[0]?.[0]
  ? parseInt(CHART_DATASET.incidentCalendarScatter[0][0].substring(0, 4), 10)
  : new Date().getFullYear();

export const componentMeta = {
  description: 'Calendar grid where each day cell shows a themed icon chosen or sized by value',
  category: 'visualization' as const,
  keywords: ['calendar', 'icon', 'daily', 'day', 'symbol', 'activity', 'glyph', 'pictogram', 'year', 'events'],
  whenToUse: 'For marking which days had events using a themed icon on a calendar grid — like satellite or star glyphs per day',
  whenNotToUse: 'For precise value comparison use RoboCalendarBarChart or the color intensity of RoboCalendarHeatmap',
  pairsWith: ['RoboCard', 'RoboStatCard', 'RoboCalendarHeatmap'],
  a11y: 'Renders to a canvas with role img and an aria-label prop that falls back to the title; pair with a data table for screen reader users',
};

const meta: Meta<typeof RoboCalendarIconChart> = {
  excludeStories: ['componentMeta'],
  title: 'Data/Charts/ECharts/RoboCalendarIconChart',
  component: RoboCalendarIconChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    icon: {
      control: 'select',
      options: ['satellite', 'rocket', 'star', 'planet'],
    },
    height: { control: { type: 'number', min: 100, max: 400, step: 20 } },
    isLoading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof RoboCalendarIconChart>;

export const SatelliteCalendar: Story = {
  name: 'Satellite Calendar',
  args: {
    data: CHART_DATASET.incidentCalendarScatter,
    year: incidentYear,
    icon: 'satellite',
    title: 'Satellite Passes — Calendar View',
    height: 200,
  },
};

export const RocketCalendar: Story = {
  name: 'Rocket Calendar',
  args: {
    data: CHART_DATASET.incidentCalendarScatter,
    year: incidentYear,
    icon: 'rocket',
    title: 'Daily Launch Activity — Rocket Icons',
    height: 200,
  },
};

export const StarCalendar: Story = {
  name: 'Star Calendar',
  args: {
    data: CHART_DATASET.incidentCalendarScatter,
    year: incidentYear,
    icon: 'star',
    title: 'Anomaly Events — Daily Star Calendar',
    height: 200,
  },
};

export const PlanetCalendar: Story = {
  name: 'Planet Calendar',
  args: {
    data: CHART_DATASET.incidentCalendarScatter,
    year: incidentYear,
    icon: 'planet',
    title: 'Ground-Station Event Log — Calendar View',
    height: 200,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    data: [],
    height: 200,
    isLoading: true,
  },
};

export const Playground: Story = {
  args: {
    data: CHART_DATASET.incidentCalendarScatter,
    year: incidentYear,
    icon: 'satellite',
    title: 'Calendar Icon Chart',
    height: 200,
    isLoading: false,
  },
};
