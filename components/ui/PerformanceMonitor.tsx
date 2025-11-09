'use client';

import React, { memo } from 'react';
import { PerformanceMetrics } from '@/lib/types';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
}

function PerformanceMonitorComponent({ metrics }: PerformanceMonitorProps) {
  const fpsColor = metrics.fps >= 55 ? '#10b981' : metrics.fps >= 30 ? '#f59e0b' : '#ef4444';
  const memoryColor = metrics.memoryUsage < 50 ? '#10b981' : metrics.memoryUsage < 100 ? '#f59e0b' : '#ef4444';

  return (
    <div
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '12px',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '14px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '3px',
            height: '20px',
            background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '2px',
            marginRight: '12px',
          }}
        />
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', letterSpacing: '0.5px' }}>
          Performance Metrics
        </h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div
          style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            FPS
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: fpsColor, lineHeight: '1.2' }}>
            {metrics.fps.toFixed(1)}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Target: 60fps
          </div>
        </div>
        <div
          style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Memory
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: memoryColor, lineHeight: '1.2' }}>
            {metrics.memoryUsage.toFixed(1)} <span style={{ fontSize: '16px', fontWeight: '500' }}>MB</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Heap usage
          </div>
        </div>
        <div
          style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Render Time
          </div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', lineHeight: '1.2' }}>
            {metrics.renderTime.toFixed(2)} <span style={{ fontSize: '14px', fontWeight: '500' }}>ms</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Per frame
          </div>
        </div>
        <div
          style={{
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Frames
          </div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', lineHeight: '1.2' }}>
            {metrics.frameCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Total rendered
          </div>
        </div>
      </div>
    </div>
  );
}

export const PerformanceMonitor = memo(PerformanceMonitorComponent);

