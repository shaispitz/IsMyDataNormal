import React from 'react';
import { motion } from 'framer-motion';

export default function StatisticalChart({ results }) {
  const { histogram, normalDistribution } = results;

  // --- NEW NORMALIZED SCALING LOGIC ---
  // The y-axis will be based on the histogram's frequency counts.
  const maxHistogramCount = Math.max(1, ...histogram.map(d => d.y));
  // Find the peak of the ideal normal curve to use for scaling.
  const maxNormalPDF = Math.max(0.0001, ...normalDistribution.map(d => d.y));

  // Chart dimensions
  const width = 700;
  const height = 400;
  const margin = { top: 20, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Find data range for X-axis
  const allXValues = [...histogram.map(d => d.x), ...normalDistribution.map(d => d.x)];
  const xMin = Math.min(...allXValues);
  const xMax = Math.max(...allXValues);
  const xRange = xMax - xMin || 1;

  // Scale functions
  const xScale = (x) => ((x - xMin) / xRange) * chartWidth;
  // Y-scale is now based on the max frequency count from the histogram
  const yScale = (y) => chartHeight - (y / maxHistogramCount) * chartHeight;

  // Calculate bar width based on data
  let barPixelWidth;
  if (histogram.length > 0 && histogram[0].singlePoint) {
      barPixelWidth = 5;
  } else if (histogram.length > 1) {
      const binDataWidth = histogram[1].x - histogram[0].x;
      barPixelWidth = (binDataWidth / xRange) * chartWidth;
  } else {
      barPixelWidth = chartWidth / 20;
  }

  // Create histogram bars using the new frequency-based scale
  const histogramBars = histogram.map((d, i) => {
    const barHeight = chartHeight - yScale(d.y);
    const spacing = 0.1;
    const barDrawingWidth = barPixelWidth * (1 - spacing);
    const barX = xScale(d.x) + (barPixelWidth * spacing / 2);

    return (
      <motion.rect
        key={`bar-${i}`}
        x={barX}
        y={yScale(d.y)}
        width={Math.max(0, barDrawingWidth)}
        height={Math.max(0, barHeight)}
        fill="rgba(59, 130, 246, 0.7)"
        stroke="rgba(59, 130, 246, 1)"
        strokeWidth="1"
        rx="1"
        initial={{ height: 0, y: chartHeight }}
        animate={{ height: Math.max(0, barHeight), y: yScale(d.y) }}
        transition={{ duration: 0.5, delay: i * 0.02 }}
      />
    );
  });

  // Create normal distribution curve, scaling its y-values to match the histogram's scale
  const normalPath = normalDistribution.reduce((path, d, i) => {
    const x = xScale(d.x);
    // This is the key: scale the PDF value to the count-based axis
    const scaledY = (d.y / maxNormalPDF) * maxHistogramCount;
    const y = yScale(scaledY);
    return path + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
  }, '');

  // Create axis tick marks
  const numTicks = 5;
  const xTicks = [];
  const yTicks = [];
 
