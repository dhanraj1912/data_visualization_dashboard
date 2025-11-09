export interface DataPoint {
  timestamp: number;
  value: number;
  category: string;
  metadata?: Record<string, any>;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'heatmap';
  dataKey: string;
  color: string;
  visible: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  dataProcessingTime: number;
  frameCount: number;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface FilterOptions {
  categories: string[];
  minValue?: number;
  maxValue?: number;
}

export interface AggregationPeriod {
  label: string;
  milliseconds: number;
}

export const AGGREGATION_PERIODS: AggregationPeriod[] = [
  { label: '1 minute', milliseconds: 60 * 1000 },
  { label: '5 minutes', milliseconds: 5 * 60 * 1000 },
  { label: '1 hour', milliseconds: 60 * 60 * 1000 },
];

export interface ChartDimensions {
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

