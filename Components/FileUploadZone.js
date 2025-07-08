import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Upload, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUploadZone({ onFileUpload }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      onFileUpload(csvFile);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="space-y-6">
      {/* Drag and Drop Zone */}
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50/50 scale-105' 
            : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isDragOver ? 'bg-blue-100' : 'bg-slate-100'
          }`}>
            <FileText className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-slate-600'}`} />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-slate-900">
              {isDragOver ? 'Drop your CSV file here' : 'Drag & drop your CSV file'}
            </p>
            <p className="text-sm text-slate-600">
              or click the button below to browse
            </p>
          </div>
        </div>
      </motion.div>

      {/* File Input Button */}
      <div className="flex justify-center">
        <label htmlFor="file-input">
          <Button
            type="button"
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            asChild
          >
            <span className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Choose File
            </span>
          </Button>
        </label>
        <input
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* File Requirements */}
      <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">File Requirements:</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• CSV format only</li>
              <li>• Numerical values arranged in rows or columns</li>
              <li>• Minimum 10 data points recommended</li>
              <li>• File size limit: 5MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
