import { PerformanceMetrics } from './types';

/**
 * Calculate FPS based on frame timestamps
 */
export class FPSMonitor {
  private frameTimes: number[] = [];
  private readonly maxSamples = 60; // Keep last 60 frames

  recordFrame(): void {
    const now = performance.now();
    this.frameTimes.push(now);

    // Keep only recent frames
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
  }

  getFPS(): number {
    if (this.frameTimes.length < 2) return 0;

    const timeSpan =
      this.frameTimes[this.frameTimes.length - 1] - this.frameTimes[0];
    if (timeSpan === 0) return 0;

    return ((this.frameTimes.length - 1) / timeSpan) * 1000;
  }

  reset(): void {
    this.frameTimes = [];
  }
}

/**
 * Measure memory usage (if available)
 */
export function getMemoryUsage(): number {
  if ('memory' in performance) {
    const mem = (performance as any).memory;
    return mem.usedJSHeapSize / 1024 / 1024; // Convert to MB
  }
  return 0;
}

/**
 * Measure render time using performance API
 */
export function measureRenderTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, time: end - start };
}

/**
 * Create a performance observer for monitoring
 */
export function createPerformanceObserver(
  callback: (metrics: Partial<PerformanceMetrics>) => void
): PerformanceObserver | null {
  if (typeof PerformanceObserver === 'undefined') {
    return null;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          callback({
            renderTime: entry.duration,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
    return observer;
  } catch (e) {
    console.warn('PerformanceObserver not supported', e);
    return null;
  }
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

