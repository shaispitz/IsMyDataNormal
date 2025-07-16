import React from 'react';
import TestResultCard from './TestResultCard';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function AndersonDarlingDisplay({ result }) {
  const { statistic } = result;
  
  // Critical values for the Anderson-Darling test from a standard table
  const criticalValues = {
    '15%': 0.576,
    '10%': 0.656,
    '5%': 0.787,
    '2.5%': 0.918,
    '1%': 1.092,
  };
  
  const significanceLevel = '5%';
  const pass = statistic < criticalValues[significanceLevel];

  return (
    <TestResultCard title="Anderson-Darling Test">
        <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
                <p className="text-sm text-slate-600">A-D Statistic:</p>
                <p className="text-3xl font-bold text-slate-800">{statistic.toFixed(4)}</p>
                <div className={`mt-4 flex items-center gap-2 font-semibold ${pass ? 'text-green-600' : 'text-red-600'}`}>
                    {pass ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span>At {significanceLevel} significance, the data {pass ? 'passes' : 'fails'} the normality test.</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    (The null hypothesis of normality cannot be rejected if the statistic is less than the critical value).
                </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Critical Values</h4>
                <ul className="space-y-1 text-sm">
                    {Object.entries(criticalValues).map(([level, value]) => (
                        <li key={level} className="flex justify-between">
                            <span className="text-slate-600">Significance {level}:</span>
                            <span className={`font-mono ${statistic > value ? 'text-red-500 font-bold' : 'text-slate-800'}`}>{value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </TestResultCard>
  );
}