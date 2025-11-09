'use client';

import React, { useState, useCallback, memo } from 'react';
import { TimeRange, AGGREGATION_PERIODS } from '@/lib/types';
import { useDataContext } from '../providers/DataProvider';

function TimeRangeSelectorComponent() {
  const { timeRange, setTimeRange, aggregationPeriod, setAggregationPeriod } = useDataContext();
  const [localRange, setLocalRange] = useState<TimeRange | null>(timeRange);

  const handleApply = useCallback(() => {
    setTimeRange(localRange);
  }, [localRange, setTimeRange]);

  const handlePreset = useCallback((minutes: number) => {
    const now = Date.now();
    const range: TimeRange = {
      start: now - minutes * 60 * 1000,
      end: now,
    };
    setLocalRange(range);
    setTimeRange(range);
  }, [setTimeRange]);

  const handleClear = useCallback(() => {
    setLocalRange(null);
    setTimeRange(null);
  }, [setTimeRange]);

  return (
    <div
      className="time-range-selector"
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '3px',
            height: '18px',
            background: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '2px',
            marginRight: '10px',
          }}
        />
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#fff' }}>
          Time Range
        </h3>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#e2e8f0' }}>
          Quick Presets
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => handlePreset(5)}
            style={{
              padding: '8px 14px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              color: '#e2e8f0',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Last 5 min
          </button>
          <button
            onClick={() => handlePreset(15)}
            style={{
              padding: '8px 14px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              color: '#e2e8f0',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Last 15 min
          </button>
          <button
            onClick={() => handlePreset(60)}
            style={{
              padding: '8px 14px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              color: '#e2e8f0',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Last 1 hour
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#e2e8f0' }}>
          Custom Range
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="datetime-local"
            value={
              localRange?.start
                ? new Date(localRange.start).toISOString().slice(0, 16)
                : ''
            }
            onChange={(e) =>
              setLocalRange((prev) => ({
                ...prev,
                start: e.target.value ? new Date(e.target.value).getTime() : Date.now(),
                end: prev?.end || Date.now(),
              }))
            }
            style={{
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              fontSize: '13px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#8b5cf6';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          />
          <span style={{ color: '#cbd5e1', fontSize: '13px' }}>to</span>
          <input
            type="datetime-local"
            value={
              localRange?.end
                ? new Date(localRange.end).toISOString().slice(0, 16)
                : ''
            }
            onChange={(e) =>
              setLocalRange((prev) => ({
                ...prev,
                end: e.target.value ? new Date(e.target.value).getTime() : Date.now(),
                start: prev?.start || Date.now(),
              }))
            }
            style={{
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              fontSize: '13px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#8b5cf6';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#e2e8f0' }}>
          Aggregation Period
        </label>
        <select
          value={aggregationPeriod}
          onChange={(e) => setAggregationPeriod(Number(e.target.value))}
          style={{
            padding: '8px 12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            width: '100%',
            fontSize: '13px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#8b5cf6';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <option value="0">No Aggregation</option>
          {AGGREGATION_PERIODS.map((period) => (
            <option key={period.milliseconds} value={period.milliseconds}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button
          onClick={handleApply}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(139, 92, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(139, 92, 246, 0.2)';
          }}
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export const TimeRangeSelector = memo(TimeRangeSelectorComponent);

