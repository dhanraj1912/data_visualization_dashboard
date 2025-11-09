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

interface HeatmapProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  onRender?: (renderTime: number) => void;
}

function HeatmapComponent({
  data,
  width = 800,
  height = 400,
  showGrid = true,
  showAxes = true,
  onRender,
}: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dimensions = useMemo(
    () => calculateChartDimensions(width, height),
    [width, height]
  );

  const bounds = useMemo(() => getDataBounds(data), [data]);

  // Create heatmap grid
  const heatmapData = useMemo(() => {
    const gridSize = 50; // 50x50 grid
    const grid: number[][] = Array(gridSize)
      .fill(0)
      .map(() => Array(gridSize).fill(0));

    if (data.length === 0) return grid;

    data.forEach((point) => {
      const x = Math.floor(
        ((point.timestamp - bounds.minX) / (bounds.maxX - bounds.minX)) *
          (gridSize - 1)
      );
      const y = Math.floor(
        ((point.value - bounds.minY) / (bounds.maxY - bounds.minY)) *
          (gridSize - 1)
      );
      if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        grid[y][x] += 1;
      }
    });

    return grid;
  }, [data, bounds]);

  const maxDensity = useMemo(() => {
    return Math.max(...heatmapData.flat());
  }, [heatmapData]);

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

      // Draw heatmap
      const { padding } = updatedDimensions;
      const cellWidth = (actualWidth - padding.left - padding.right) / heatmapData[0].length;
      const cellHeight = (actualHeight - padding.top - padding.bottom) / heatmapData.length;

      heatmapData.forEach((row, y) => {
        row.forEach((density, x) => {
          if (density > 0) {
            const intensity = density / maxDensity;
            // Color gradient from blue (low) to red (high)
            const r = Math.floor(intensity * 255);
            const b = Math.floor((1 - intensity) * 255);
            ctx.fillStyle = `rgb(${r}, 0, ${b})`;
            ctx.fillRect(
              padding.left + x * cellWidth,
              padding.top + y * cellHeight,
              cellWidth,
              cellHeight
            );
          }
        });
      });

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
  }, [data, width, height, dimensions, bounds, heatmapData, maxDensity, showGrid, showAxes, onRender]);

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

export const Heatmap = memo(HeatmapComponent);

