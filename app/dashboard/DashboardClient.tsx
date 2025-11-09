'use client';

import React, { useState, useEffect, useCallback, useMemo, useTransition } from 'react';
import { useDataContext } from '@/components/providers/DataProvider';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { ScatterPlot } from '@/components/charts/ScatterPlot';
import { Heatmap } from '@/components/charts/Heatmap';
import { FilterPanel } from '@/components/controls/FilterPanel';
import { TimeRangeSelector } from '@/components/controls/TimeRangeSelector';
import { DataTable } from '@/components/ui/DataTable';
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useResize } from '@/hooks/useResize';
import { generateNewDataPoint } from '@/lib/dataGenerator';
import { filterData, aggregateData } from '@/lib/dataGenerator';
import { AGGREGATION_PERIODS } from '@/lib/types';

export default function DashboardClient() {
  const {
    data: rawData,
    filters,
    timeRange,
    aggregationPeriod,
    addDataPoint,
  } = useDataContext();

  const [isStreaming, setIsStreaming] = useState(true);
  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'scatter' | 'heatmap'>('line');
  const [isPending, startTransition] = useTransition();
  const { metrics, recordFrame } = usePerformanceMonitor(true);
  const { ref: chartContainerRef, width: chartWidth, height: chartHeight } = useResize<HTMLDivElement>();

  // Process data with filters and aggregation
  const processedData = useMemo(() => {
    let processed = rawData;

    if (filters || timeRange) {
      processed = filterData(processed, {
        categories: filters?.categories,
        minValue: filters?.minValue,
        maxValue: filters?.maxValue,
        timeRange: timeRange ? { start: timeRange.start, end: timeRange.end } : undefined,
      });
    }

    if (aggregationPeriod > 0) {
      processed = aggregateData(processed, aggregationPeriod);
    }

    return processed;
  }, [rawData, filters, timeRange, aggregationPeriod]);

  // Real-time data streaming
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newPoint = generateNewDataPoint();
      startTransition(() => {
        addDataPoint(newPoint);
      });
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [isStreaming, addDataPoint]);

  const handleToggleStream = useCallback(() => {
    setIsStreaming((prev) => !prev);
  }, []);

  const handleChartChange = useCallback((chart: 'line' | 'bar' | 'scatter' | 'heatmap') => {
    setSelectedChart(chart);
  }, []);

  // Render callback for performance tracking
  const handleRender = useCallback((renderTime: number) => {
    recordFrame(renderTime);
  }, [recordFrame]);

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '24px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        backgroundSize: '200% 200%',
      }}
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <header
          style={{
            marginBottom: '32px',
            padding: '24px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '6px',
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px',
              }}
            >
              Performance Dashboard
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
              Real-time data visualization with 10,000+ data points at 60fps
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleToggleStream}
              style={{
                padding: '10px 20px',
                background: isStreaming
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: isStreaming
                  ? '0 2px 4px rgba(239, 68, 68, 0.3)'
                  : '0 2px 4px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = isStreaming
                  ? '0 4px 6px rgba(239, 68, 68, 0.4)'
                  : '0 4px 6px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isStreaming
                  ? '0 2px 4px rgba(239, 68, 68, 0.3)'
                  : '0 2px 4px rgba(16, 185, 129, 0.3)';
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#fff',
                  display: isStreaming ? 'block' : 'none',
                  animation: isStreaming ? 'pulse 2s infinite' : 'none',
                }}
              />
              {isStreaming ? 'Stop Stream' : 'Start Stream'}
            </button>
            <div
              style={{
                padding: '10px 18px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
              }}
            >
              {processedData.length.toLocaleString()} points
            </div>
          </div>
        </header>

        {/* Performance Monitor */}
        <div style={{ marginBottom: '24px' }}>
          <PerformanceMonitor metrics={metrics} />
        </div>

        {/* Controls */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <FilterPanel />
          <TimeRangeSelector />
        </div>

        {/* Chart Selector */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            padding: '16px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {(['line', 'bar', 'scatter', 'heatmap'] as const).map((chart) => (
            <button
              key={chart}
              onClick={() => handleChartChange(chart)}
              style={{
                padding: '10px 20px',
                background: selectedChart === chart
                  ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: selectedChart === chart ? '#fff' : '#e2e8f0',
                border: selectedChart === chart ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: selectedChart === chart ? '600' : '500',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
                boxShadow: selectedChart === chart
                  ? '0 2px 4px rgba(59, 130, 246, 0.3)'
                  : 'none',
              }}
              onMouseEnter={(e) => {
                if (selectedChart !== chart) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedChart !== chart) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              {chart} Chart
            </button>
          ))}
        </div>

        {/* Charts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              padding: '28px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  textTransform: 'capitalize',
                  color: '#fff',
                  margin: 0,
                }}
              >
                {selectedChart} Chart
              </h2>
              {isStreaming && (
                <div
                  style={{
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#fff',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'block',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                  Live
                </div>
              )}
            </div>
            <div
              ref={chartContainerRef}
              style={{
                width: '100%',
                height: '450px',
                minHeight: '450px',
                maxHeight: '450px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              {selectedChart === 'line' && (
                <LineChart
                  data={processedData}
                  width={chartWidth || 800}
                  height={chartHeight || 400}
                  onRender={handleRender}
                />
              )}
              {selectedChart === 'bar' && (
                <BarChart
                  data={processedData}
                  width={chartWidth || 800}
                  height={chartHeight || 400}
                  onRender={handleRender}
                />
              )}
              {selectedChart === 'scatter' && (
                <ScatterPlot
                  data={processedData}
                  width={chartWidth || 800}
                  height={chartHeight || 400}
                  onRender={handleRender}
                />
              )}
              {selectedChart === 'heatmap' && (
                <Heatmap
                  data={processedData}
                  width={chartWidth || 800}
                  height={chartHeight || 400}
                  onRender={handleRender}
                />
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '28px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#fff',
            }}
          >
            Data Table
          </h2>
          <DataTable height={400} />
        </div>
      </div>
    </div>
  );
}

