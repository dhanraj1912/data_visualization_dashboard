import { DataPoint } from './types';

const CATEGORIES = ['CPU', 'Memory', 'Network', 'Disk', 'API'];
const BASE_VALUES: Record<string, number> = {
  CPU: 50,
  Memory: 60,
  Network: 40,
  Disk: 30,
  API: 70,
};

/**
 * Generate realistic time-series data points
 */
export function generateDataPoint(
  timestamp: number,
  category: string = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
): DataPoint {
  const baseValue = BASE_VALUES[category] || 50;
  // Add some realistic variation with trend
  const variation = (Math.random() - 0.5) * 20;
  const trend = Math.sin(timestamp / 10000) * 10;
  const value = Math.max(0, Math.min(100, baseValue + variation + trend));

  return {
    timestamp,
    value,
    category,
    metadata: {
      source: 'simulated',
      quality: Math.random() > 0.9 ? 'low' : 'high',
    },
  };
}

/**
 * Generate initial dataset
 */
export function generateInitialDataset(count: number = 1000): DataPoint[] {
  const now = Date.now();
  const data: DataPoint[] = [];
  const interval = 1000; // 1 second intervals

  for (let i = count; i > 0; i--) {
    const timestamp = now - i * interval;
    data.push(generateDataPoint(timestamp));
  }

  return data;
}

/**
 * Generate a single new data point (for real-time updates)
 */
export function generateNewDataPoint(): DataPoint {
  return generateDataPoint(Date.now());
}

/**
 * Aggregate data points by time period
 */
export function aggregateData(
  data: DataPoint[],
  periodMs: number
): DataPoint[] {
  if (data.length === 0) return [];

  const buckets = new Map<number, DataPoint[]>();
  const startTime = data[0].timestamp;

  // Group data into time buckets
  data.forEach((point) => {
    const bucketTime =
      Math.floor((point.timestamp - startTime) / periodMs) * periodMs +
      startTime;
    if (!buckets.has(bucketTime)) {
      buckets.set(bucketTime, []);
    }
    buckets.get(bucketTime)!.push(point);
  });

  // Aggregate each bucket (average value, most common category)
  const aggregated: DataPoint[] = [];
  buckets.forEach((points, bucketTime) => {
    const avgValue =
      points.reduce((sum, p) => sum + p.value, 0) / points.length;
    const categoryCounts = new Map<string, number>();
    points.forEach((p) => {
      categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
    });
    const mostCommonCategory = Array.from(categoryCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    aggregated.push({
      timestamp: bucketTime,
      value: avgValue,
      category: mostCommonCategory,
      metadata: { aggregated: true, pointCount: points.length },
    });
  });

  return aggregated.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Filter data points based on criteria
 */
export function filterData(
  data: DataPoint[],
  filters: {
    categories?: string[];
    minValue?: number;
    maxValue?: number;
    timeRange?: { start: number; end: number };
  }
): DataPoint[] {
  return data.filter((point) => {
    if (filters.categories && !filters.categories.includes(point.category)) {
      return false;
    }
    if (filters.minValue !== undefined && point.value < filters.minValue) {
      return false;
    }
    if (filters.maxValue !== undefined && point.value > filters.maxValue) {
      return false;
    }
    if (filters.timeRange) {
      if (
        point.timestamp < filters.timeRange.start ||
        point.timestamp > filters.timeRange.end
      ) {
        return false;
      }
    }
    return true;
  });
}

