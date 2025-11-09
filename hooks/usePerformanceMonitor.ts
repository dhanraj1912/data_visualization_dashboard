'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PerformanceMetrics } from '@/lib/types';
import { FPSMonitor, getMemoryUsage, createPerformanceObserver } from '@/lib/performanceUtils';

export function usePerformanceMonitor(enabled: boolean = true) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    dataProcessingTime: 0,
    frameCount: 0,
  });

  const fpsMonitorRef = useRef(new FPSMonitor());
  const frameCountRef = useRef(0);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const renderTimesRef = useRef<number[]>([]);
  const maxRenderTimeSamples = useRef(60);

  const updateMetrics = useCallback(() => {
    if (!enabled) return;

    const fps = fpsMonitorRef.current.getFPS();
    const memoryUsage = getMemoryUsage();
    frameCountRef.current += 1;

    // Calculate average render time from recent samples
    const renderTimes = renderTimesRef.current;
    const avgRenderTime = renderTimes.length > 0
      ? renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
      : 0;

    setMetrics((prev) => ({
      ...prev,
      fps: Math.round(fps * 10) / 10,
      memoryUsage: Math.round(memoryUsage * 10) / 10,
      renderTime: Math.round(avgRenderTime * 100) / 100,
      frameCount: frameCountRef.current,
    }));
  }, [enabled]);

  const recordFrame = useCallback((renderTime?: number) => {
    if (!enabled) return;
    fpsMonitorRef.current.recordFrame();
    
    // Record render time if provided
    if (renderTime !== undefined) {
      renderTimesRef.current.push(renderTime);
      // Keep only recent samples
      if (renderTimesRef.current.length > maxRenderTimeSamples.current) {
        renderTimesRef.current.shift();
      }
    }
    
    updateMetrics();
  }, [enabled, updateMetrics]);

  useEffect(() => {
    if (!enabled) return;

    // Set up performance observer
    observerRef.current = createPerformanceObserver((newMetrics) => {
      setMetrics((prev) => ({
        ...prev,
        ...newMetrics,
      }));
    });

    // Start monitoring loop
    const monitor = () => {
      updateMetrics();
      animationFrameRef.current = requestAnimationFrame(monitor);
    };
    animationFrameRef.current = requestAnimationFrame(monitor);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, updateMetrics]);

  return {
    metrics,
    recordFrame,
  };
}

