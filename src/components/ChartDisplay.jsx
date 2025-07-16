import React, { useEffect, useRef } from 'react';
// TestResultCard import removed as this is now a pure chart component

export default function ChartDisplay({ data, type }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !window.Chart) return;
    
    let config;

    if (type === 'qq') {
        const min = Math.min(...data.map(p => p.x), ...data.map(p => p.y));
        const max = Math.max(...data.map(p => p.x), ...data.map(p => p.y));
        
        config = {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Q-Q Data',
                        data: data,
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    },
                    {
                        label: 'Reference Line',
                        data: [{x: min, y: min}, {x: max, y: max}],
                        type: 'line',
                        borderColor: 'rgba(239, 68, 68, 0.8)',
                        fill: false,
                        pointRadius: 0,
                        borderWidth: 2,
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Theoretical Quantiles (Standard Normal)' } },
                    y: { title: { display: true, text: 'Sample Quantiles (Standardized)' } },
                },
                plugins: {
                    tooltip: { callbacks: { label: (c) => `Theoretical: ${c.raw.x.toFixed(3)}, Sample: ${c.raw.y.toFixed(3)}` } },
                },
            },
        };
    } else if (type === 'hist_kde') {
        // This type is kept for potential future use but is not currently selectable
        config = {
            type: 'bar',
            data: {
                labels: data.histogram.map(d => d.x.toFixed(2)),
                datasets: [
                    {
                        label: 'Histogram',
                        data: data.histogram.map(d => d.y),
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        yAxisID: 'y',
                    },
                    {
                        label: 'KDE',
                        data: data.kde,
                        type: 'line',
                        borderColor: 'rgba(239, 68, 68, 0.8)',
                        yAxisID: 'y1',
                        pointRadius: 0,
                        borderWidth: 3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { type: 'linear', position: 'left', title: { display: true, text: 'Frequency' } },
                    y1: { type: 'linear', position: 'right', title: { display: true, text: 'Density' }, grid: { drawOnChartArea: false } },
                },
            },
        };
    } else if (type === 'hist_normal') {
        config = {
            data: {
                datasets: [
                    {
                        label: 'Histogram',
                        data: data.histogram,
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        type: 'bar',
                        barPercentage: 1.0,
                        categoryPercentage: 1.0,
                    },
                    {
                        label: 'Normal Distribution',
                        data: data.normalCurve,
                        borderColor: 'rgba(239, 68, 68, 0.8)',
                        type: 'line',
                        pointRadius: 0,
                        borderWidth: 3,
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Data Value' },
                    },
                    y: { 
                        title: { display: true, text: 'Frequency' },
                        beginAtZero: true
                    },
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                },
            },
        };
    }

    if (chartRef.current) {
        chartRef.current.destroy();
    }
    
    chartRef.current = new window.Chart(canvasRef.current.getContext('2d'), config);

  }, [data, type]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}