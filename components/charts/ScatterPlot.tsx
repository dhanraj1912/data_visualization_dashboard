'use client';

import React, { useRef, useEffect, useMemo, memo } from 'react';
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

interface ScatterPlotProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  pointSize?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  onRender?: (renderTime: number) => void;
}

function ScatterPlotComponent({
  data,
  width = 800,
  height = 400,
  color = '#8b5cf6',
  pointSize = 4,
  showGrid = true,
  showAxes = true,
  onRender,
}: ScatterPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dimensions = useMemo(
    () => calculateChartDimensions(width, height),
    [width, height]
  );

  const bounds = useMemo(() => getDataBounds(data), [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Get actual container dimensions
    const container = containerRef.current;
    const actualWidth = container ? container.clientWidth : width;
    const actualHeight = container ? container.clientHeight : height;
    
    // Set canvas size to match container
    if (canvas.width !== actualWidth || canvas.height !== actualHeight) {
      canvas.width = actualWidth;
      canvas.height = actualHeight;
    }

    const render = () => {
      const startTime = performance.now();
      
      // Get actual container dimensions
      const container = containerRef.current;
      const actualWidth = container ? container.clientWidth : width;
      const actualHeight = container ? container.clientHeight : height;
      
      clearCanvas(ctx, actualWidth, actualHeight);

      if (data.length === 0) {
        const renderTime = performance.now() - startTime;
        if (onRender) onRender(renderTime);
        return;
      }

      // Update dimensions for actual container size
      const updatedDimensions = calculateChartDimensions(actualWidth, actualHeight);

      if (showGrid) {
        drawGrid(ctx, updatedDimensions, bounds);
      }

      if (showAxes) {
        drawAxes(ctx, updatedDimensions, bounds);
      }

      // Draw scatter points
      if (data.length > 0) {
        const { padding } = updatedDimensions;
        ctx.fillStyle = color;

        // Use path for better performance with many points
        ctx.beginPath();
        data.forEach((point) => {
          const x = scaleX(
            point.timestamp,
            bounds.minX,
            bounds.maxX,
            actualWidth,
            padding
          );
          const y = scaleY(
            point.value,
            bounds.minY,
            bounds.maxY,
            actualHeight,
            padding
          );
          ctx.moveTo(x + pointSize, y);
          ctx.arc(x, y, pointSize, 0, Math.PI * 2);
        });
        ctx.fill();
      }

      const renderTime = performance.now() - startTime;
      if (onRender) onRender(renderTime);
    };

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
  }, [data, width, height, color, pointSize, dimensions, bounds, showGrid, showAxes, onRender]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  );
}

export const ScatterPlot = memo(ScatterPlotComponent);

