'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DataPoint, FilterOptions, TimeRange } from '@/lib/types';
import { generateNewDataPoint, filterData, aggregateData } from '@/lib/dataGenerator';
import { AGGREGATION_PERIODS } from '@/lib/types';

interface UseDataStreamOptions {
  updateInterval?: number; // milliseconds
  maxDataPoints?: number;
  aggregationPeriod?: number; // milliseconds, 0 = no aggregation
  filters?: FilterOptions;
  timeRange?: TimeRange;
}

export function useDataStream(
  initialData: DataPoint[],
  options: UseDataStreamOptions = {}
) {
  const {
    updateInterval = 100,
    maxDataPoints = 10000,
    aggregationPeriod = 0,
    filters,
    timeRange,
  } = options;

  const [data, setData] = useState<DataPoint[]>(initialData);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  // Add new data point
  const addDataPoint = useCallback(() => {
    if (!isActiveRef.current) return;

    setData((prevData) => {
      const newPoint = generateNewDataPoint();
      let newData = [...prevData, newPoint];

      // Limit data points
      if (newData.length > maxDataPoints) {
        newData = newData.slice(-maxDataPoints);
      }

      return newData;
    });
  }, [maxDataPoints]);

  // Start/stop streaming
  const startStream = useCallback(() => {
    if (intervalRef.current) return;
    isActiveRef.current = true;
    intervalRef.current = setInterval(addDataPoint, updateInterval);
  }, [addDataPoint, updateInterval]);

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isActiveRef.current = false;
  }, []);

  // Initialize stream
  useEffect(() => {
    startStream();
    return () => {
      stopStream();
    };
  }, [startStream, stopStream]);

  // Process data: filter, aggregate
  const processedData = useMemo(() => {
    let processed = data;

    // Apply filters
    if (filters || timeRange) {
      processed = filterData(processed, {
        categories: filters?.categories,
        minValue: filters?.minValue,
        maxValue: filters?.maxValue,
        timeRange: timeRange ? { start: timeRange.start, end: timeRange.end } : undefined,
      });
    }

    // Apply aggregation
    if (aggregationPeriod > 0) {
      processed = aggregateData(processed, aggregationPeriod);
    }

    return processed;
  }, [data, filters, timeRange, aggregationPeriod]);

  return {
    data: processedData,
    rawData: data,
    startStream,
    stopStream,
    isStreaming: intervalRef.current !== null,
  };
}

