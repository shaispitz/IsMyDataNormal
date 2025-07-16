import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, TestTube, AlertCircle, Loader2, Printer } from 'lucide-react';

import TestResultCard from '@/components/TestResultCard';
import KlDivergenceDisplay from '@/components/KlDivergenceDisplay';
import AndersonDarlingDisplay from '@/components/AndersonDarlingDisplay';
import ChartDisplay from '@/components/ChartDisplay';
import GeneralStatsDisplay from '@/components/GeneralStatsDisplay';

const TESTS = {
  kl: 'KL Divergence',
  ad: 'Anderson-Darling Test',
  qq: 'Q-Q Plot',
};

// Optimized helper function for large datasets
const createSequenceOptimized = (min, max, count) => {
    if (count <= 1) return [min];
    const arr = new Array(count);
    const step = (max - min) / (count - 1);
    for (let i = 0; i < count; i++) {
        arr[i] = min + (i * step);
    }
    return arr;
};

// Helper for Anderson-Darling calculation
const calculateAndersonDarling = (sortedData, mu, sigma) => {
    const n = sortedData.length;
    let S = 0;
    for (let i = 0; i < n; i++) {
        const cdfVal = window.jStat.normal.cdf(sortedData[i], mu, sigma);
        // Clamp cdfVal to avoid log(0) and log(1-F(x)) issues
        const clampedCdf = Math.max(1e-9, Math.min(1 - 1e-9, cdfVal));
        const cdfComplementVal = window.jStat.normal.cdf(sortedData[n - 1 - i], mu, sigma);
        const clampedCdfComplement = Math.max(1e-9, Math.min(1 - 1e-9, cdfComplementVal));
        S += (2 * (i + 1) - 1) * (Math.log(clampedCdf) + Math.log(1 - clampedCdfComplement));
    }
    return -n - (S / n);
};

export default function NormalityAnalysis() {
  const [selectedTests, setSelectedTests] = useState({ kl: true });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [generalStats, setGeneralStats] = useState(null);
  const [error, setError] = useState('');
  const [scriptsReady, setScriptsReady] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const scriptUrls = [
      'https://cdn.jsdelivr.net/npm/chart.js',
      'https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js',
      'https://unpkg.com/simple-statistics@7.8.3/dist/simple-statistics.min.js',
    ];
    let loadedCount = 0;

    const loadScript = (url) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
          loadedCount++;
          if (loadedCount === scriptUrls.length) {
            setScriptsReady(true);
          }
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    Promise.all(scriptUrls.map(loadScript)).catch(() => setError("Failed to load analysis scripts. Please refresh the page."));
  }, []);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.size > 50 * 1024 * 1024) { // 50MB limit
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
      const data = text.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && isFinite(n));

      if (data.length < 8) {
        throw new Error("At least 8 valid numerical data points are required for the tests.");
      }
      if (data.length > 1000000) { // Set to 1 million
        throw new Error("Dataset is too large. Please use a file with fewer than 1 million data points.");
      }
      
      const newResults = {};
      const mu = window.jStat.mean(data);
      const sigma = window.jStat.stdev(data, true); // true for sample standard deviation
      const sortedData = [...data].sort((a, b) => a - b);
      const minVal = sortedData[0];
      const maxVal = sortedData[sortedData.length - 1];

      // Optimized general stats calculation
      const binsForSummary = Math.min(50, Math.max(20, Math.ceil(Math.sqrt(data.length))));
      const binWidthForSummary = (maxVal - minVal) > 0 ? (maxVal - minVal) / binsForSummary : 1; 
      const histCountsForSummary = new Array(binsForSummary).fill(0);
      
      // Optimized histogram calculation
      for (let i = 0; i < data.length; i++) {
          const binIndex = Math.min(binsForSummary - 1, Math.floor((data[i] - minVal) / binWidthForSummary));
          histCountsForSummary[binIndex]++;
      }

      // Optimized normal curve calculation
      const plotMin = sigma > 0 ? mu - 4 * sigma : minVal - 1;
      const plotMax = sigma > 0 ? mu + 4 * sigma : maxVal + 1;
      const xDomainForSummary = createSequenceOptimized(plotMin, plotMax, 100); // Reduced points
      
      const normalCurveData = new Array(xDomainForSummary.length);
      for (let i = 0; i < xDomainForSummary.length; i++) {
          const x = xDomainForSummary[i];
          normalCurveData[i] = {
              x: x,
              y: window.jStat.normal.pdf(x, mu, sigma) * data.length * binWidthForSummary
          };
      }
      
      setGeneralStats({
        mean: mu,
        stdDev: sigma,
        dataSize: data.length,
        min: minVal,
        max: maxVal,
        median: window.jStat.median(data),
        distributionData: {
          histogram: histCountsForSummary.map((count, i) => ({ 
              x: minVal + (i * binWidthForSummary) + (binWidthForSummary / 2), 
              y: count 
          })),
          normalCurve: normalCurveData,
        },
      });

      // Optimized calculations for each selected test
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
        
        const q_unnormalized = binCenters.map(x => window.jStat.normal.pdf(x, mu, sigma) * binWidth);
        const q_sum = q_unnormalized.reduce((a,b) => a+b, 0);
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
        // Optimize Q-Q plot for large datasets by sampling
        const sampleSize = Math.min(1000, data.length);
        const step = Math.floor(data.length / sampleSize);
        const sampledData = [];
        for (let i = 0; i < data.length; i += step) {
            sampledData.push(sortedData[i]);
        }
        
        const quantiles = sampledData.map((_, i) => (i + 1 - 0.5) / sampledData.length);
        const theoreticalQuantiles = quantiles.map(q => window.jStat.normal.inv(q, 0, 1));
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

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8">
      <style>{`
        @media print {
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            max-width: 100% !important;
            margin: 0 auto !important; /* Ensure content is centered if needed */
          }
          .shadow-md, .shadow-sm, .shadow {
              box-shadow: none !important;
              border: 1px solid #e2e8f0 !important;
          }
          .space-y-6 > *, .mb-6, .mb-8 {
              page-break-inside: avoid;
          }
          /* Ensure charts are rendered correctly for print */
          canvas {
            display: block !important;
            width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>
      <main className="max-w-5xl mx-auto">
        <div className="no-print">
            <header className="text-center mb-8">
              <div className="flex justify-center items-center gap-4">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Data Normality Analyzer</h1>
                <Button variant="outline" onClick={handleExport} disabled={!results}>
                  <Printer className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
              <p className="mt-2 text-lg text-slate-600">
                Select the tests you want to apply to your data and upload your file. Once ready, click 'Analyze' to run the selected tests and view results.
              </p>
            </header>

            <Card className="mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">1. Select Tests</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(TESTS).map(([key, name]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={!!selectedTests[key]}
                            onCheckedChange={(checked) => setSelectedTests(prev => ({ ...prev, [key]: checked }))}
                          />
                          <label htmlFor={key} className="text-sm font-medium text-slate-700 cursor-pointer">{name}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">2. Upload File</h3>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                      <input ref={fileInputRef} type="file" accept=".csv, .txt, text/plain" onChange={handleFileChange} className="hidden" />
                      {fileName && <span className="text-sm text-slate-600 truncate">{fileName}</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">CSV or text file with numbers, max 50MB.</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button size="lg" onClick={handleAnalyze} disabled={!file || isAnalyzing || !scriptsReady}>
                    {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : <><TestTube className="mr-2 h-4 w-4" />Analyze</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {error && (
                <Alert variant="destructive" className="mb-8">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isAnalyzing && (
                <div className="text-center p-8">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 mb-4" />
                    <p className="text-slate-600">Running analyses... this may take a moment.</p>
                </div>
            )}
        </div>
        
        {generalStats && <GeneralStatsDisplay stats={generalStats} />}

        {results && (
          <div className="space-y-6">
            {Object.keys(results).map(key => {
              if (key === 'kl') return <KlDivergenceDisplay key={key} result={results.kl} />;
              if (key === 'ad') return <AndersonDarlingDisplay key={key} result={results.ad} />;
              if (key === 'qq') return (
                <TestResultCard key={key} title="Q-Q Plot">
                  <div className="relative h-80">
                    <ChartDisplay data={results.qq} type="qq" />
                  </div>
                </TestResultCard>
              );
              return null;
            })}
          </div>
        )}

      </main>
    </div>
  );
}