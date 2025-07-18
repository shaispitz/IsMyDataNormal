import React from 'react';

// This component contains the complete HTML structure for the static site
export default function StaticSite() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Normality Analyzer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js"></script>
    <script src="https://unpkg.com/simple-statistics@7.8.3/dist/simple-statistics.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
        }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .transition-all { transition: all 0.3s ease; }
        .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        @media print {
            body { background-color: white !important; }
            .no-print { display: none !important; }
            main { padding: 0 !important; max-width: 100% !important; }
            .shadow-md, .shadow-sm { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        }
        .lucide-icon { width: 1rem; height: 1rem; display: inline-block; }
    </style>
</head>
<body class="bg-slate-50">
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        // Icons (simplified SVG versions)
        const Upload = () => React.createElement('svg', { className: 'lucide-icon', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, 
            React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
            React.createElement('polyline', { points: '7,10 12,15 17,10' }),
            React.createElement('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
        );
        
        const TestTube = () => React.createElement('svg', { className: 'lucide-icon', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('path', { d: 'M14.5 2h-5l1.5 1.5L9.5 6h5l-1.5-2.5L14.5 2z' }),
            React.createElement('path', { d: 'M11.5 6L6 21.5c-.5.5-1.5.5-2 0s-.5-1.5 0-2L9.5 6' }),
            React.createElement('path', { d: 'M15.5 6L21 21.5c.5.5.5 1.5 0 2s-1.5.5-2 0L12.5 6' })
        );
        
        const AlertCircle = () => React.createElement('svg', { className: 'lucide-icon', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
            React.createElement('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
            React.createElement('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
        );
        
        const Loader2 = () => React.createElement('svg', { className: 'lucide-icon animate-spin', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('path', { d: 'M21 12a9 9 0 11-6.219-8.56' })
        );
        
        const Printer = () => React.createElement('svg', { className: 'lucide-icon', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('polyline', { points: '6,9 6,2 18,2 18,9' }),
            React.createElement('path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }),
            React.createElement('rect', { x: '6', y: '14', width: '12', height: '8' })
        );
        
        const ListChecks = () => React.createElement('svg', { className: 'lucide-icon', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('path', { d: 'M3 17l2 2 4-4' }),
            React.createElement('path', { d: 'M3 7l2 2 4-4' }),
            React.createElement('path', { d: 'M13 6h8' }),
            React.createElement('path', { d: 'M13 12h8' }),
            React.createElement('path', { d: 'M13 18h8' })
        );
        
        const CheckCircle2 = () => React.createElement('svg', { className: 'lucide-icon', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
            React.createElement('path', { d: 'M9 12l2 2 4-4' })
        );
        
        const XCircle = () => React.createElement('svg', { className: 'lucide-icon', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
            React.createElement('path', { d: 'M15 9l-6 6' }),
            React.createElement('path', { d: 'M9 9l6 6' })
        );

        // Helper functions
        const createSequenceOptimized = (min, max, count) => {
            if (count <= 1) return [min];
            const arr = new Array(count);
            const step = (max - min) / (count - 1);
            for (let i = 0; i < count; i++) {
                arr[i] = min + (i * step);
            }
            return arr;
        };

        const calculateAndersonDarling = (sortedData, mu, sigma) => {
            const n = sortedData.length;
            let S = 0;
            for (let i = 0; i < n; i++) {
                const cdfVal = jStat.normal.cdf(sortedData[i], mu, sigma);
                const clampedCdf = Math.max(1e-9, Math.min(1 - 1e-9, cdfVal));
                const cdfComplementVal = jStat.normal.cdf(sortedData[n - 1 - i], mu, sigma);
                const clampedCdfComplement = Math.max(1e-9, Math.min(1 - 1e-9, cdfComplementVal));
                S += (2 * (i + 1) - 1) * (Math.log(clampedCdf) + Math.log(1 - clampedCdfComplement));
            }
            return -n - (S / n);
        };

        // UI Components
        const Button = ({ children, onClick, disabled, variant = "default", className = "" }) => {
            const baseClass = "px-4 py-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
            const variantClass = variant === "outline" 
                ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" 
                : "bg-blue-600 text-white hover:bg-blue-700";
            const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
            
            return React.createElement('button', {
                className: \`\${baseClass} \${variantClass} \${disabledClass} \${className}\`,
                onClick: disabled ? undefined : onClick,
                disabled
            }, children);
        };

        const Card = ({ children, className = "" }) => {
            return React.createElement('div', {
                className: \`bg-white rounded-lg shadow-sm border border-gray-200 \${className}\`
            }, children);
        };

        const CardHeader = ({ children }) => {
            return React.createElement('div', { className: 'px-6 py-4 border-b border-gray-200' }, children);
        };

        const CardTitle = ({ children, className = "" }) => {
            return React.createElement('h3', { className: \`text-lg font-semibold text-gray-900 \${className}\` }, children);
        };

        const CardContent = ({ children }) => {
            return React.createElement('div', { className: 'px-6 py-4' }, children);
        };

        const Checkbox = ({ id, checked, onCheckedChange }) => {
            return React.createElement('input', {
                type: 'checkbox',
                id,
                checked,
                onChange: (e) => onCheckedChange(e.target.checked),
                className: 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            });
        };

        const Alert = ({ children, variant = "default", className = "" }) => {
            const variantClass = variant === "destructive" ? "bg-red-50 border-red-200 text-red-800" : "bg-blue-50 border-blue-200 text-blue-800";
            return React.createElement('div', {
                className: \`border rounded-lg p-4 \${variantClass} \${className}\`
            }, children);
        };

        const AlertTitle = ({ children }) => {
            return React.createElement('h5', { className: 'font-medium mb-1' }, children);
        };

        const AlertDescription = ({ children }) => {
            return React.createElement('div', { className: 'text-sm' }, children);
        };

        // Chart Component
        const ChartDisplay = ({ data, type }) => {
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
                        },
                    };
                }

                if (chartRef.current) {
                    chartRef.current.destroy();
                }
                
                chartRef.current = new window.Chart(canvasRef.current.getContext('2d'), config);

            }, [data, type]);

            return React.createElement('div', { className: 'relative h-full w-full' },
                React.createElement('canvas', { ref: canvasRef })
            );
        };

        // Test Result Components
        const TestResultCard = ({ title, children }) => {
            return React.createElement(Card, { className: 'shadow-md transition-shadow hover:shadow-lg' },
                React.createElement(CardHeader, {},
                    React.createElement(CardTitle, { className: 'flex items-center gap-3 text-xl text-slate-800' },
                        React.createElement('div', { className: 'flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center' },
                            React.createElement(TestTube, { className: 'w-5 h-5 text-blue-600' })
                        ),
                        title
                    )
                ),
                React.createElement(CardContent, {}, children)
            );
        };

        // KL Divergence Components
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

            return React.createElement('div', { className: 'flex flex-col items-center space-y-6 w-full max-w-2xl mx-auto' },
                React.createElement('div', { className: 'w-full relative' },
                    React.createElement('div', { className: 'h-6 bg-gray-200 rounded-full relative overflow-hidden' },
                        ...ranges.map((range, index) => {
                            const startPercent = index === 0 ? 0 : (ranges[index - 1].limit / GAUGE_MAX) * 100;
                            const endPercent = (range.limit / GAUGE_MAX) * 100;
                            const width = endPercent - startPercent;
                            return React.createElement('div', { 
                                key: index, 
                                className: 'absolute top-0 h-full',
                                style: { left: \`\${startPercent}%\`, width: \`\${width}%\`, backgroundColor: range.color }
                            });
                        })
                    ),
                    React.createElement('div', { 
                        className: 'absolute top-0 transform -translate-x-1/2 transition-all duration-500 ease-out',
                        style: { left: \`\${percentage}%\` }
                    },
                        React.createElement('div', { className: 'w-1 h-6 bg-gray-800' }),
                        React.createElement('div', { className: 'absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800' })
                    )
                ),
                React.createElement('div', { className: 'grid grid-cols-4 gap-2 w-full text-center' },
                    ...ranges.map(range =>
                        React.createElement('div', { key: range.label },
                            React.createElement('p', { className: 'text-xs font-semibold', style: { color: range.color } }, range.label)
                        )
                    )
                )
            );
        };

        const KlDivergenceDisplay = ({ result }) => {
            const { score, mean, stdDev, dataSize } = result;

            return React.createElement(TestResultCard, { title: 'KL Divergence' },
                React.createElement('div', { className: 'grid md:grid-cols-3 gap-6' },
                    React.createElement('div', { className: 'md:col-span-2 space-y-4' },
                        React.createElement('p', { className: 'text-2xl font-bold text-slate-800' }, score.toFixed(4)),
                        React.createElement(HorizontalGauge, { value: score })
                    ),
                    React.createElement('div', { className: 'bg-slate-50 p-4 rounded-lg space-y-2 text-sm' },
                        React.createElement('p', {}, React.createElement('strong', {}, 'Mean: '), mean.toFixed(3)),
                        React.createElement('p', {}, React.createElement('strong', {}, 'Std Dev: '), stdDev.toFixed(3)),
                        React.createElement('p', {}, React.createElement('strong', {}, 'Data Size: '), dataSize)
                    )
                )
            );
        };

        const AndersonDarlingDisplay = ({ result }) => {
            const { statistic } = result;
            
            const criticalValues = {
                '15%': 0.576,
                '10%': 0.656,
                '5%': 0.787,
                '2.5%': 0.918,
                '1%': 1.092,
            };
            
            const significanceLevel = '5%';
            const pass = statistic < criticalValues[significanceLevel];

            return React.createElement(TestResultCard, { title: 'Anderson-Darling Test' },
                React.createElement('div', { className: 'grid md:grid-cols-2 gap-6 items-start' },
                    React.createElement('div', {},
                        React.createElement('p', { className: 'text-sm text-slate-600' }, 'A-D Statistic:'),
                        React.createElement('p', { className: 'text-3xl font-bold text-slate-800' }, statistic.toFixed(4)),
                        React.createElement('div', { className: \`mt-4 flex items-center gap-2 font-semibold \${pass ? 'text-green-600' : 'text-red-600'}\` },
                            pass ? React.createElement(CheckCircle2, { className: 'w-5 h-5' }) : React.createElement(XCircle, { className: 'w-5 h-5' }),
                            React.createElement('span', {}, \`At \${significanceLevel} significance, the data \${pass ? 'passes' : 'fails'} the normality test.\`)
                        ),
                        React.createElement('p', { className: 'text-xs text-slate-500 mt-1' }, 
                            '(The null hypothesis of normality cannot be rejected if the statistic is less than the critical value).')
                    ),
                    React.createElement('div', { className: 'bg-slate-50 p-4 rounded-lg' },
                        React.createElement('h4', { className: 'font-semibold text-sm mb-2' }, 'Critical Values'),
                        React.createElement('ul', { className: 'space-y-1 text-sm' },
                            ...Object.entries(criticalValues).map(([level, value]) =>
                                React.createElement('li', { key: level, className: 'flex justify-between' },
                                    React.createElement('span', { className: 'text-slate-600' }, \`Significance \${level}:\`),
                                    React.createElement('span', { className: \`font-mono \${statistic > value ? 'text-red-500 font-bold' : 'text-slate-800'}\` }, value)
                                )
                            )
                        )
                    )
                )
            );
        };

        const GeneralStatsDisplay = ({ stats }) => {
            if (!stats) return null;

            const { mean, stdDev, dataSize, min, max, median, distributionData } = stats;

            return React.createElement(Card, { className: 'shadow-md mb-6 border-blue-200 border-2' },
                React.createElement(CardHeader, {},
                    React.createElement(CardTitle, { className: 'flex items-center gap-3 text-xl text-slate-800' },
                        React.createElement('div', { className: 'flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center' },
                            React.createElement(ListChecks, { className: 'w-5 h-5 text-blue-600' })
                        ),
                        'Data Summary'
                    )
                ),
                React.createElement(CardContent, {},
                    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 text-center' },
                        React.createElement('div', { className: 'bg-slate-50 p-3 rounded-lg' },
                            React.createElement('p', { className: 'text-xs text-slate-600 mb-1' }, 'Data Size'),
                            React.createElement('p', { className: 'text-lg font-bold text-slate-800' }, dataSize)
                        ),
                        React.createElement('div', { className: 'bg-slate-50 p-3 rounded-lg' },
                            React.createElement('p', { className: 'text-xs text-slate-600 mb-1' }, 'Mean'),
                            React.createElement('p', { className: 'text-lg font-bold text-slate-800' }, mean.toFixed(3))
                        ),
                        React.createElement('div', { className: 'bg-slate-50 p-3 rounded-lg' },
                            React.createElement('p', { className: 'text-xs text-slate-600 mb-1' }, 'Median'),
                            React.createElement('p', { className: 'text-lg font-bold text-slate-800' }, median.toFixed(3))
                        ),
                        React.createElement('div', { className: 'bg-slate-50 p-3 rounded-lg' },
                            React.createElement('p', { className: 'text-xs text-slate-600 mb-1' }, 'Std Dev'),
                            React.createElement('p', { className: 'text-lg font-bold text-slate-800' }, stdDev.toFixed(3))
                        ),
                        React.createElement('div', { className: 'bg-slate-50 p-3 rounded-lg' },
                            React.createElement('p', { className: 'text-xs text-slate-600 mb-1' }, 'Min'),
                            React.createElement('p', { className: 'text-lg font-bold text-slate-800' }, min.toFixed(3))
                        ),
                        React.createElement('div', { className: 'bg-slate-50 p-3 rounded-lg' },
                            React.createElement('p', { className: 'text-xs text-slate-600 mb-1' }, 'Max'),
                            React.createElement('p', { className: 'text-lg font-bold text-slate-800' }, max.toFixed(3))
                        )
                    ),
                    distributionData && React.createElement('div', { className: 'w-full mt-4' },
                        React.createElement('h4', { className: 'text-center font-semibold text-slate-700 mb-2' }, 'Data Distribution vs. Normal'),
                        React.createElement('div', { className: 'relative h-96' },
                            React.createElement(ChartDisplay, { data: distributionData, type: 'hist_normal' })
                        )
                    )
                )
            );
        };

        // Main App Component
        const App = () => {
            const [selectedTests, setSelectedTests] = useState({ kl: true });
            const [file, setFile] = useState(null);
            const [fileName, setFileName] = useState('');
            const [isAnalyzing, setIsAnalyzing] = useState(false);
            const [results, setResults] = useState(null);
            const [generalStats, setGeneralStats] = useState(null);
            const [error, setError] = useState('');
            const [scriptsReady, setScriptsReady] = useState(false);

            const fileInputRef = useRef(null);

            const TESTS = {
                kl: 'KL Divergence',
                ad: 'Anderson-Darling Test',
                qq: 'Q-Q Plot',
            };

            useEffect(() => {
                // Check if scripts are loaded
                if (window.Chart && window.jStat && window.ss) {
                    setScriptsReady(true);
                } else {
                    setTimeout(() => {
                        if (window.Chart && window.jStat && window.ss) {
                            setScriptsReady(true);
                        }
                    }, 1000);
                }
            }, []);

            const handleFileChange = (e) => {
                const uploadedFile = e.target.files[0];
                if (uploadedFile) {
                    if (uploadedFile.size > 50 * 1024 * 1024) {
                        setError("File size cannot exceed 50MB.");
                        return;
                    }
                    setFile(uploadedFile);
                    setFileName(uploadedFile.name);
                    setError('');
                }
            };

            const handleExport = () => {
                window.print();
            };

            const handleAnalyze = async () => {
                if (!file || Object.values(selectedTests).every(v => !v)) {
                    setError("Please select a file and at least one test to run.");
                    return;
                }
                if (!scriptsReady) {
                    setError("Analysis scripts are not ready yet. Please wait a moment.");
                    return;
                }

                setIsAnalyzing(true);
                setResults(null);
                setGeneralStats(null);
                setError('');

                try {
                    const text = await file.text();
                    const data = text.trim().split(/[\\s,]+/).map(Number).filter(n => !isNaN(n) && isFinite(n));

                    if (data.length < 8) {
                        throw new Error("At least 8 valid numerical data points are required for the tests.");
                    }
                    if (data.length > 1000000) {
                        throw new Error("Dataset is too large. Please use a file with fewer than 1 million data points.");
                    }

                    const newResults = {};
                    const mu = jStat.mean(data);
                    const sigma = jStat.stdev(data, true);
                    const sortedData = [...data].sort((a, b) => a - b);
                    const minVal = sortedData[0];
                    const maxVal = sortedData[sortedData.length - 1];

                    // General stats calculation
                    const binsForSummary = Math.min(50, Math.max(20, Math.ceil(Math.sqrt(data.length))));
                    const binWidthForSummary = (maxVal - minVal) > 0 ? (maxVal - minVal) / binsForSummary : 1;
                    const histCountsForSummary = new Array(binsForSummary).fill(0);

                    for (let i = 0; i < data.length; i++) {
                        const binIndex = Math.min(binsForSummary - 1, Math.floor((data[i] - minVal) / binWidthForSummary));
                        histCountsForSummary[binIndex]++;
                    }

                    const plotMin = sigma > 0 ? mu - 4 * sigma : minVal - 1;
                    const plotMax = sigma > 0 ? mu + 4 * sigma : maxVal + 1;
                    const xDomainForSummary = createSequenceOptimized(plotMin, plotMax, 100);

                    const normalCurveData = new Array(xDomainForSummary.length);
                    for (let i = 0; i < xDomainForSummary.length; i++) {
                        const x = xDomainForSummary[i];
                        normalCurveData[i] = {
                            x: x,
                            y: jStat.normal.pdf(x, mu, sigma) * data.length * binWidthForSummary
                        };
                    }

                    setGeneralStats({
                        mean: mu,
                        stdDev: sigma,
                        dataSize: data.length,
                        min: minVal,
                        max: maxVal,
                        median: jStat.median(data),
                        distributionData: {
                            histogram: histCountsForSummary.map((count, i) => ({
                                x: minVal + (i * binWidthForSummary) + (binWidthForSummary / 2),
                                y: count
                            })),
                            normalCurve: normalCurveData,
                        },
                    });

                    // Test calculations
                    if (selectedTests.kl) {
                        const bins = Math.min(50, Math.ceil(Math.sqrt(data.length)));
                        const binWidth = (maxVal - minVal) > 0 ? (maxVal - minVal) / bins : 1;
                        const counts = new Array(bins).fill(0);

                        for (let i = 0; i < data.length; i++) {
                            const binIndex = Math.min(bins - 1, Math.floor((data[i] - minVal) / binWidth));
                            counts[binIndex]++;
                        }

                        const p = counts.map(count => count / data.length);
                        const binCenters = new Array(bins);
                        for (let i = 0; i < bins; i++) {
                            binCenters[i] = minVal + (i * binWidth) + (binWidth / 2);
                        }

                        const q_unnormalized = binCenters.map(x => jStat.normal.pdf(x, mu, sigma) * binWidth);
                        const q_sum = q_unnormalized.reduce((a, b) => a + b, 0);
                        const q = q_sum > 0 ? q_unnormalized.map(val => val / q_sum) : new Array(bins).fill(1 / bins);

                        let klDiv = 0;
                        for (let i = 0; i < p.length; i++) {
                            if (p[i] > 0 && q[i] > 0) {
                                klDiv += p[i] * Math.log(p[i] / q[i]);
                            }
                        }

                        newResults.kl = { score: klDiv, mean: mu, stdDev: sigma, dataSize: data.length };
                    }

                    if (selectedTests.ad) {
                        const adStat = calculateAndersonDarling(sortedData, mu, sigma);
                        newResults.ad = { statistic: adStat };
                    }

                    if (selectedTests.qq) {
                        const sampleSize = Math.min(1000, data.length);
                        const step = Math.floor(data.length / sampleSize);
                        const sampledData = [];
                        for (let i = 0; i < data.length; i += step) {
                            sampledData.push(sortedData[i]);
                        }

                        const quantiles = sampledData.map((_, i) => (i + 1 - 0.5) / sampledData.length);
                        const theoreticalQuantiles = quantiles.map(q => jStat.normal.inv(q, 0, 1));
                        const sampleQuantiles = sampledData.map(val => (val - mu) / sigma);
                        newResults.qq = theoreticalQuantiles.map((tq, i) => ({ x: tq, y: sampleQuantiles[i] }));
                    }

                    setResults(newResults);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsAnalyzing(false);
                }
            };

            return React.createElement('div', { className: 'bg-slate-50 min-h-screen p-4 md:p-8' },
                React.createElement('main', { className: 'max-w-5xl mx-auto' },
                    React.createElement('div', { className: 'no-print' },
                        React.createElement('header', { className: 'text-center mb-8' },
                            React.createElement('div', { className: 'flex justify-center items-center gap-4' },
                                React.createElement('h1', { className: 'text-4xl font-extrabold text-slate-800 tracking-tight' }, 'Data Normality Analyzer'),
                                React.createElement(Button, { variant: 'outline', onClick: handleExport, disabled: !results },
                                    React.createElement(Printer, { className: 'mr-2 h-4 w-4' }),
                                    'Export PDF'
                                )
                            ),
                            React.createElement('p', { className: 'mt-2 text-lg text-slate-600' },
                                'Select the tests you want to apply to your data and upload your file. Once ready, click "Analyze" to run the selected tests and view results.'
                            )
                        ),

                        React.createElement(Card, { className: 'mb-8 shadow-sm' },
                            React.createElement(CardContent, { className: 'p-6' },
                                React.createElement('div', { className: 'grid md:grid-cols-2 gap-8' },
                                    React.createElement('div', {},
                                        React.createElement('h3', { className: 'text-lg font-semibold mb-3' }, '1. Select Tests'),
                                        React.createElement('div', { className: 'grid grid-cols-1 gap-3' },
                                            ...Object.entries(TESTS).map(([key, name]) =>
                                                React.createElement('div', { key, className: 'flex items-center space-x-2' },
                                                    React.createElement(Checkbox, {
                                                        id: key,
                                                        checked: !!selectedTests[key],
                                                        onCheckedChange: (checked) => setSelectedTests(prev => ({ ...prev, [key]: checked }))
                                                    }),
                                                    React.createElement('label', { htmlFor: key, className: 'text-sm font-medium text-slate-700 cursor-pointer' }, name)
                                                )
                                            )
                                        )
                                    ),

                                    React.createElement('div', {},
                                        React.createElement('h3', { className: 'text-lg font-semibold mb-3' }, '2. Upload File'),
                                        React.createElement('div', { className: 'flex items-center gap-4' },
                                            React.createElement(Button, { variant: 'outline', onClick: () => fileInputRef.current?.click() },
                                                React.createElement(Upload, { className: 'mr-2 h-4 w-4' }),
                                                'Choose File'
                                            ),
                                            React.createElement('input', {
                                                ref: fileInputRef,
                                                type: 'file',
                                                accept: '.csv, .txt, text/plain',
                                                onChange: handleFileChange,
                                                style: { display: 'none' }
                                            }),
                                            fileName && React.createElement('span', { className: 'text-sm text-slate-600 truncate' }, fileName)
                                        ),
                                        React.createElement('p', { className: 'text-xs text-slate-500 mt-2' }, 'CSV or text file with numbers, max 50MB.')
                                    )
                                ),

                                React.createElement('div', { className: 'mt-6 text-center' },
                                    React.createElement(Button, { size: 'lg', onClick: handleAnalyze, disabled: !file || isAnalyzing || !scriptsReady },
                                        isAnalyzing 
                                            ? React.createElement(React.Fragment, {},
                                                React.createElement(Loader2, { className: 'mr-2 h-4 w-4 animate-spin' }),
                                                'Analyzing...'
                                            )
                                            : React.createElement(React.Fragment, {},
                                                React.createElement(TestTube, { className: 'mr-2 h-4 w-4' }),
                                                'Analyze'
                                            )
                                    )
                                )
                            )
                        ),

                        error && React.createElement(Alert, { variant: 'destructive', className: 'mb-8' },
                            React.createElement(AlertCircle, { className: 'h-4 w-4' }),
                            React.createElement(AlertTitle, {}, 'Error'),
                            React.createElement(AlertDescription, {}, error)
                        ),

                        isAnalyzing && React.createElement('div', { className: 'text-center p-8' },
                            React.createElement(Loader2, { className: 'h-8 w-8 mx-auto animate-spin text-blue-600 mb-4' }),
                            React.createElement('p', { className: 'text-slate-600' }, 'Running analyses... this may take a moment.')
                        )
                    ),

                    generalStats && React.createElement(GeneralStatsDisplay, { stats: generalStats }),

                    results && React.createElement('div', { className: 'space-y-6' },
                        ...Object.keys(results).map(key => {
                            if (key === 'kl') return React.createElement(KlDivergenceDisplay, { key, result: results.kl });
                            if (key === 'ad') return React.createElement(AndersonDarlingDisplay, { key, result: results.ad });
                            if (key === 'qq') return React.createElement(TestResultCard, { key, title: 'Q-Q Plot' },
                                React.createElement('div', { className: 'relative h-80' },
                                    React.createElement(ChartDisplay, { data: results.qq, type: 'qq' })
                                )
                            );
                            return null;
                        })
                    )
                )
            );
        };

        // Render the app
        ReactDOM.render(React.createElement(App), document.getElementById('root'));
    </script>
</body>
</html>
      `
    }} />
  );
}