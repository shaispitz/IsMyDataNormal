import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import FileUploadZone from '../components/FileUploadZone';
import DataProcessor from '../components/DataProcessor';
import ResultsDisplay from '../components/ResultsDisplay';
import StatisticalChart from '../components/StatisticalChart';

export default function DataNormalityChecker() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [data, setData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = useCallback((file) => {
    setUploadedFile(file);
    setError(null);
    setResults(null);
    setProgress(0);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const parsedData = parseCSV(csv);
        if (parsedData.length === 0) {
          setError("No valid numerical data found in the file.");
          return;
        }
        setData(parsedData);
        processData(parsedData);
      } catch (err) {
        setError("Error reading file. Please ensure it's a valid CSV file.");
      }
    };
    reader.readAsText(file);
  }, []);

  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const numbers = [];
    
    for (const line of lines) {
      const values = line.split(',').map(v => v.trim());
      for (const value of values) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          numbers.push(num);
        }
      }
    }
    
    return numbers;
  };

  const processData = async (dataArray) => {
    // FIX: Add guard clause for data length
    if (!dataArray || dataArray.length < 2) {
      setError("Not enough valid data points for analysis. Please provide at least 2 numbers.");
      setIsProcessing(false);
      setUploadedFile(null);
      setData(null);
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(25);
      
      const mean = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(50);
      
      const variance = dataArray.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dataArray.length;
      const stdDev = Math.max(Math.sqrt(variance), 0.0001);
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(75);
      
      const klDivergence = calculateKLDivergence(dataArray, mean, stdDev);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(100);
      
      const interpretation = interpretKLDivergence(klDivergence);
      
      setResults({
        mean,
        stdDev,
        klDivergence,
        interpretation,
        dataSize: dataArray.length,
        histogram: createHistogram(dataArray),
        normalDistribution: generateNormalDistribution(mean, stdDev, dataArray)
      });
      
    } catch (err) {
      setError("Error processing data: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateKLDivergence = (data, mean, stdDev) => {
    const bins = 20;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = max > min ? (max - min) / bins : 1;
    
    if (binWidth <= 0) {
      return Infinity;
    }
    
    const histogram = new Array(bins).fill(0);
    data.forEach(value => {
      const binIndex = value === max ? bins - 1 : Math.floor((value - min) / binWidth);
      histogram[binIndex]++;
    });
    
    const pData = histogram.map(count => count / data.length);
    
    const qNormal = new Array(bins).fill(0);
    for (let i = 0; i < bins; i++) {
      const x = min + (i + 0.5) * binWidth;
      qNormal[i] = normalPDF(x, mean, stdDev) * binWidth;
    }
    
    const qSum = qNormal.reduce((sum, val) => sum + val, 0);
    if (qSum <= 0) return Infinity;
    const qNormalized = qNormal.map(val => val / qSum);
    
    let klDiv = 0;
    for (let i = 0; i < bins; i++) {
      if (pData[i] > 0 && qNormalized[i] > 0) {
        klDiv += pData[i] * Math.log(pData[i] / qNormalized[i]);
      }
    }
    
    return Math.max(0, klDiv);
  };

  const normalPDF = (x, mean, stdDev) => {
    const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
    return coefficient * Math.exp(exponent);
  };

  const interpretKLDivergence = (kl) => {
    if (kl < 0.1) return { level: "very_close", message: "Your data is very close to normal distribution", color: "text-green-600" };
    if (kl < 0.3) return { level: "close", message: "Your data is reasonably close to normal distribution", color: "text-blue-600" };
    if (kl < 0.7) return { level: "moderate", message: "Your data shows moderate deviation from normal distribution", color: "text-yellow-600" };
    return { level: "far", message: "Your data significantly deviates from normal distribution", color: "text-red-600" };
  };

  const createHistogram = (data) => {
    const bins = 20;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = max > min ? (max - min) / bins : 1;

    if (binWidth <= 0) {
      return [{x: min, y: data.length, singlePoint: true}];
    }

    const histogram = new Array(bins).fill(0);
    data.forEach(value => {
      const binIndex = value === max ? bins - 1 : Math.floor((value - min) / binWidth);
      histogram[binIndex]++;
    });
    
    return histogram.map((count, index) => ({
      x: min + index * binWidth,
      y: count
    }));
  };

  const generateNormalDistribution = (mean, stdDev, data) => {
    const points = [];
    const numPoints = 100;

    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    
    const rangeMin = Math.min(dataMin, mean - 4 * stdDev);
    const rangeMax = Math.max(dataMax, mean + 4 * stdDev);
    
    const step = (rangeMax - rangeMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = rangeMin + i * step;
      const y = normalPDF(x, mean, stdDev);
      points.push({ x, y });
    }
    
    return points;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Is My Data Normal?
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your numerical data and discover how close it is to a normal distribution 
            using KL Divergence analysis
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Upload Your Data
                </CardTitle>
                <p className="text-slate-600 mt-2">
                  CSV file with numerical values arranged in rows or columns
                </p>
              </CardHeader>
              <CardContent>
                <FileUploadZone onFileUpload={handleFileUpload} />
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <DataProcessor progress={progress} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert variant="destructive" className="border-0 shadow-lg">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-slate-900">
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultsDisplay results={results} />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                      <BarChart3 className="w-6 h-6" />
                      Distribution Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StatisticalChart results={results} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
