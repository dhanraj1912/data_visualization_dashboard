'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DataPoint, FilterOptions, TimeRange } from '@/lib/types';

interface DataContextValue {
  data: DataPoint[];
  filters: FilterOptions | null;
  timeRange: TimeRange | null;
  aggregationPeriod: number;
  setFilters: (filters: FilterOptions | null) => void;
  setTimeRange: (range: TimeRange | null) => void;
  setAggregationPeriod: (period: number) => void;
  addDataPoint: (point: DataPoint) => void;
  clearData: () => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: DataPoint[];
}) {
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange | null>(null);
  const [aggregationPeriod, setAggregationPeriod] = useState<number>(0);

  const addDataPoint = useCallback((point: DataPoint) => {
    setData((prev) => {
      const newData = [...prev, point];
      // Limit to 10k points
      if (newData.length > 10000) {
        return newData.slice(-10000);
      }
      return newData;
    });
  }, []);

  const clearData = useCallback(() => {
    setData([]);
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        filters,
        timeRange,
        aggregationPeriod,
        setFilters,
        setTimeRange,
        setAggregationPeriod,
        addDataPoint,
        clearData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within DataProvider');
  }
  return context;
}

