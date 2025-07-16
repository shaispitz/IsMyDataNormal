import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks } from 'lucide-react';
import ChartDisplay from './ChartDisplay';

export default function GeneralStatsDisplay({ stats }) {
    if (!stats) return null;

    const { mean, stdDev, dataSize, min, max, median, distributionData } = stats;

    return (
        <Card className="shadow-md mb-6 border-blue-200 border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <ListChecks className="w-5 h-5 text-blue-600" />
                    </div>
                    Data Summary
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Horizontal stats layout */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 text-center">
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Data Size</p>
                        <p className="text-lg font-bold text-slate-800">{dataSize}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Mean</p>
                        <p className="text-lg font-bold text-slate-800">{mean.toFixed(3)}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Median</p>
                        <p className="text-lg font-bold text-slate-800">{median.toFixed(3)}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Std Dev</p>
                        <p className="text-lg font-bold text-slate-800">{stdDev.toFixed(3)}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Min</p>
                        <p className="text-lg font-bold text-slate-800">{min.toFixed(3)}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-600 mb-1">Max</p>
                        <p className="text-lg font-bold text-slate-800">{max.toFixed(3)}</p>
                    </div>
                </div>
                
                {/* Chart below stats */}
                {distributionData && (
                    <div className="w-full mt-4">
                        <h4 className="text-center font-semibold text-slate-700 mb-2">Data Distribution vs. Normal</h4>
                        <div className="relative h-[450px]">
                            <ChartDisplay data={distributionData} type="hist_normal" />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}