import { DataPoint, ChartDimensions } from './types';

/**
 * Calculate chart dimensions with padding
 */
export function calculateChartDimensions(
  containerWidth: number,
  containerHeight: number,
  padding: { top: number; right: number; bottom: number; left: number } = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 60,
  }
): ChartDimensions {
  return {
    width: containerWidth,
    height: containerHeight,
    padding,
  };
}

/**
 * Get data bounds for scaling
 */
export function getDataBounds(data: DataPoint[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  if (data.length === 0) {
    return { minX: 0, maxX: 1, minY: 0, maxY: 100 };
  }

  let minX = data[0].timestamp;
  let maxX = data[0].timestamp;
  let minY = data[0].value;
  let maxY = data[0].value;

  data.forEach((point) => {
    minX = Math.min(minX, point.timestamp);
    maxX = Math.max(maxX, point.timestamp);
    minY = Math.min(minY, point.value);
    maxY = Math.max(maxY, point.value);
  });

  // Add some padding
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  return {
    minX: minX - xRange * 0.05,
    maxX: maxX + xRange * 0.05,
    minY: Math.max(0, minY - yRange * 0.1),
    maxY: maxY + yRange * 0.1,
  };
}

/**
 * Scale value from data space to canvas space
 */
export function scaleX(
  value: number,
  min: number,
  max: number,
  width: number,
  padding: { left: number; right: number }
): number {
  const range = max - min;
  if (range === 0) return padding.left;
  const normalized = (value - min) / range;
  return padding.left + normalized * (width - padding.left - padding.right);
}

export function scaleY(
  value: number,
  min: number,
  max: number,
  height: number,
  padding: { top: number; bottom: number }
): number {
  const range = max - min;
  if (range === 0) return padding.top;
  const normalized = (value - min) / range;
  // Invert Y axis (canvas Y increases downward)
  return (
    height -
    padding.bottom -
    normalized * (height - padding.top - padding.bottom)
  );
}

/**
 * Draw grid lines
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  dimensions: ChartDimensions,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  xTicks: number = 10,
  yTicks: number = 10
): void {
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;

  const { width, height, padding } = dimensions;

  // Vertical grid lines
  for (let i = 0; i <= xTicks; i++) {
    const x = scaleX(
      bounds.minX + ((bounds.maxX - bounds.minX) * i) / xTicks,
      bounds.minX,
      bounds.maxX,
      width,
      padding
    );
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, height - padding.bottom);
    ctx.stroke();
  }

  // Horizontal grid lines
  for (let i = 0; i <= yTicks; i++) {
    const y = scaleY(
      bounds.minY + ((bounds.maxY - bounds.minY) * i) / yTicks,
      bounds.minY,
      bounds.maxY,
      height,
      padding
    );
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }
}

/**
 * Draw axes labels
 */
export function drawAxes(
  ctx: CanvasRenderingContext2D,
  dimensions: ChartDimensions,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  xTicks: number = 10,
  yTicks: number = 10
): void {
  ctx.fillStyle = '#666';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const { width, height, padding } = dimensions;

  // X-axis labels
  for (let i = 0; i <= xTicks; i++) {
    const timestamp =
      bounds.minX + ((bounds.maxX - bounds.minX) * i) / xTicks;
    const x = scaleX(timestamp, bounds.minX, bounds.maxX, width, padding);
    const label = new Date(timestamp).toLocaleTimeString();
    ctx.fillText(label, x, height - padding.bottom + 20);
  }

  // Y-axis labels
  ctx.textAlign = 'right';
  for (let i = 0; i <= yTicks; i++) {
    const value = bounds.minY + ((bounds.maxY - bounds.minY) * i) / yTicks;
    const y = scaleY(value, bounds.minY, bounds.maxY, height, padding);
    ctx.fillText(value.toFixed(1), padding.left - 10, y);
  }
}

/**
 * Clear canvas
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
}

