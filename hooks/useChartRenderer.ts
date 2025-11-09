'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { DataPoint, ChartDimensions } from '@/lib/types';
import {
  calculateChartDimensions,
  getDataBounds,
  scaleX,
  scaleY,
  drawGrid,
  drawAxes,
  clearCanvas,
} from '@/lib/canvasUtils';

interface UseChartRendererOptions {
  data: DataPoint[];
  color?: string;
  lineWidth?: number;
  showGrid?: boolean;
  showAxes?: boolean;
}

export function useChartRenderer(
  options: UseChartRendererOptions,
  dimensions: ChartDimensions
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { data, color = '#3b82f6', lineWidth = 2, showGrid = true, showAxes = true } = options;

  const bounds = useMemo(() => getDataBounds(data), [data]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, padding } = dimensions;

    // Set canvas size
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // Clear canvas
    clearCanvas(ctx, width, height);

    if (data.length === 0) return;

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, dimensions, bounds);
    }

    // Draw axes
    if (showAxes) {
      drawAxes(ctx, dimensions, bounds);
    }

    // Draw data
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = scaleX(point.timestamp, bounds.minX, bounds.maxX, width, padding);
      const y = scaleY(point.value, bounds.minY, bounds.maxY, height, padding);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [data, color, lineWidth, dimensions, bounds, showGrid, showAxes]);

  useEffect(() => {
    const animate = () => {
      render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  return { canvasRef, render };
}

