import React from 'react';
import TestResultCard from './TestResultCard';
import { CheckCircle2, XCircle } from 'lucide-react';

const PValueGauge = ({ pValue }) => {
  const isNormal = pValue > 0.05;
  const color = isNormal ? '#22c55e' : '#ef4444';
  const label = isNormal ? 'Likely Normal' : 'Not Normal';
  const percentage = isNormal ? 75 : 25;

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="h-4 bg-gray-200 rounded-full relative overflow-hidden flex">
        <div className="h-full bg-red-500 w-1/2" />
        <div className="h-full bg-green-500 w-1/2" />
        <div className="absolute top-0 w-1 h-4 bg-white" style={{ left: '50%' }} />
        <div className="absolute top-1/2 -translate-y-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out" style={{ left: `${percentage}%` }}>
          <div className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
        </div>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>Not Normal (p≤0.05)</span>
        <span>Normal (p&gt;0.05)</span>
      </div>
    </div>
  );
};

export default function PValueDisplay({ testName, result }) {
  const { statistic, pValue } = result;
  const isNormal = pValue > 0.05;

  return (
    <TestResultCard title={testName}>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <p className="text-sm text-slate-600">Test Statistic: <span className="font-bold text-slate-800">{statistic.toFixed(4)}</span></p>
          <p className="text-sm text-slate-600 mt-1">P-value: <span className="font-bold text-slate-800">{pValue.toExponential(4)}</span></p>
          <div className={`mt-4 flex items-center gap-2 font-semibold ${isNormal ? 'text-green-600' : 'text-red-600'}`}>
            {isNormal ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span>Based on p-value, data is {isNormal ? 'likely' : 'unlikely to be'} normally distributed.</span>
          </div>
        </div>
        <div>
          <PValueGauge pValue={pValue} />
        </div>
      </div>
    </TestResultCard>
  );
}
