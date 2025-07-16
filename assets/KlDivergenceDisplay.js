import React from 'react';
import TestResultCard from './TestResultCard';

const HorizontalGauge = ({ value }) => {
  const GAUGE_MAX = 1.2;
  const clampedValue = Math.min(Math.max(value, 0), GAUGE_MAX);
  const percentage = (clampedValue / GAUGE_MAX) * 100;

  const ranges = [
    { limit: 0.1, color: '#22c55e', label: 'Very Close' },
    { limit: 0.5, color: '#3b82f6', label: 'Reasonable' },
    { limit: 1.0, color: '#ef4444', label: 'Noticeable' },
    { limit: GAUGE_MAX, color: '#1f2937', label: 'Strong Deviation' },
  ];

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-2xl mx-auto">
      <div className="w-full relative">
        <div className="h-6 bg-gray-200 rounded-full relative overflow-hidden">
          {ranges.map((range, index) => {
            const startPercent = index === 0 ? 0 : (ranges[index - 1].limit / GAUGE_MAX) * 100;
            const endPercent = (range.limit / GAUGE_MAX) * 100;
            const width = endPercent - startPercent;
            return <div key={index} className="absolute top-0 h-full" style={{ left: `${startPercent}%`, width: `${width}%`, backgroundColor: range.color }} />;
          })}
        </div>
        <div className="absolute top-0 transform -translate-x-1/2 transition-all duration-500 ease-out" style={{ left: `${percentage}%` }}>
          <div className="w-1 h-6 bg-gray-800" />
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 w-full text-center">
        {ranges.map(range => (
            <div key={range.label}>
                <p className="text-xs font-semibold" style={{ color: range.color }}>{range.label}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default function KlDivergenceDisplay({ result }) {
  const { score, mean, stdDev, dataSize } = result;

  return (
    <TestResultCard title="KL Divergence">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <p className="text-2xl font-bold text-slate-800">{score.toFixed(4)}</p>
          <HorizontalGauge value={score} />
        </div>
        <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>Mean:</strong> {mean.toFixed(3)}</p>
          <p><strong>Std Dev:</strong> {stdDev.toFixed(3)}</p>
          <p><strong>Data Size:</strong> {dataSize}</p>
        </div>
      </div>
    </TestResultCard>
  );
}
