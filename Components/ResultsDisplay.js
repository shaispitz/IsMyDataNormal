import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, Database } from 'lucide-react';

export default function ResultsDisplay({ results }) {
  const { klDivergence, interpretation, mean, stdDev, dataSize } = results;

  const getScoreColor = (level) => {
    switch (level) {
      case 'very_close': return 'bg-green-100 text-green-800 border-green-200';
      case 'close': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'far': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main KL Divergence Result */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="inline-block p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-blue-100">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              KL Divergence Score
            </p>
            <p className="text-4xl font-bold text-slate-900">
              {klDivergence.toFixed(4)}
            </p>
          </div>
        </div>
        
        <Badge 
          variant="outline" 
          className={`${getScoreColor(interpretation.level)} text-base px-4 py-2 font-medium`}
        >
          {interpretation.message}
        </Badge>
      </motion.div>

      {/* Statistical Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Mean</p>
            <p className="text-xl font-bold text-slate-900">{mean.toFixed(3)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Std Deviation</p>
            <p className="text-xl font-bold text-slate-900">{stdDev.toFixed(3)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Database className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Data Points</p>
            <p className="text-xl font-bold text-slate-900">{dataSize}</p>
          </CardContent>
        </Card>
      </div>

 
