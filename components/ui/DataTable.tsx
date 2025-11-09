'use client';

import React, { useMemo, memo } from 'react';
import { DataPoint } from '@/lib/types';
import { useVirtualization } from '@/hooks/useVirtualization';
import { useDataContext } from '../providers/DataProvider';
import { filterData, aggregateData } from '@/lib/dataGenerator';

interface DataTableProps {
  height?: number;
}

function DataTableComponent({ height = 400 }: DataTableProps) {
  const { data, filters, timeRange, aggregationPeriod } = useDataContext();

  const processedData = useMemo(() => {
    let processed = data;

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
  }, [data, filters, timeRange, aggregationPeriod]);

  const { visibleItems, totalHeight, offsetY, handleScroll, containerRef } =
    useVirtualization(processedData, {
      itemHeight: 40,
      containerHeight: height,
    });

  return (
    <div
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        height,
        background: 'rgba(0, 0, 0, 0.2)',
      }}
    >
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: '100%',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
              }}
            >
              <thead
                style={{
                  position: 'sticky',
                  top: 0,
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 1,
                  borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <tr>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#e2e8f0',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Timestamp
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#e2e8f0',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: '#e2e8f0',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Value
                    </th>
                </tr>
              </thead>
              <tbody>
                {(visibleItems as DataPoint[]).map((point: DataPoint, index: number) => (
                  <tr
                    key={`${point.timestamp}-${index}`}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      height: 44,
                      background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)';
                    }}
                  >
                    <td
                      style={{
                        padding: '10px 16px',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#cbd5e1',
                        fontSize: '13px',
                      }}
                    >
                      {new Date(point.timestamp).toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#cbd5e1',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}
                    >
                      {point.category}
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        textAlign: 'right',
                        color: '#e2e8f0',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    >
                      {point.value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderTop: '2px solid rgba(255, 255, 255, 0.2)',
          fontSize: '13px',
          color: '#cbd5e1',
          fontWeight: '500',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          Showing {visibleItems.length} of {processedData.length} data points
        </span>
        {processedData.length > 0 && (
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {((visibleItems.length / processedData.length) * 100).toFixed(1)}% visible
          </span>
        )}
      </div>
    </div>
  );
}

export const DataTable = memo(DataTableComponent);

