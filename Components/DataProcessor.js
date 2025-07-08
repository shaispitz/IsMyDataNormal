import React from 'react';
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { Calculator, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function DataProcessor({ progress }) {
  const getProcessingStep = () => {
    if (progress < 25) return { icon: Calculator, text: "Parsing data...", color: "text-blue-600" };
    if (progress < 50) return { icon: BarChart3, text: "Calculating mean...", color: "text-indigo-600" };
    if (progress < 75) return { icon: TrendingUp, text: "Computing standard deviation...", color: "text-purple-600" };
    return { icon: CheckCircle2, text: "Analyzing distribution...", color: "text-green-600" };
  };

  const { icon: Icon, text, color } = getProcessingStep();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Processing Your Data
        </h3>
        <p className={`text-sm font-medium ${color}`}>
          {text}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Progress</span>
          <span className="text-sm font-medium text-slate-900">{progress}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-2 bg-slate-200"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { step: 1, name: "Parse", done: progress > 0 },
          { step: 2, name: "Calculate", done: progress > 25 },
          { step: 3, name: "Analyze", done: progress > 50 },
          { step: 4, name: "Results", done: progress >= 100 }
        ].map((item) => (
          <motion.div
            key={item.step}
            className={`text-center p-3 rounded-lg border-2 transition-all duration-300 ${
              item.done 
                ? 'border-green-200 bg-green-50' 
                : 'border-slate-200 bg-slate-50'
            }`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: item.done ? 1 : 0.5 }}
          >
            <div className={`w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center ${
              item.done 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-300 text-slate-500'
            }`}>
              {item.done ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span className="text-xs font-bold">{item.step}</span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-700">{item.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
