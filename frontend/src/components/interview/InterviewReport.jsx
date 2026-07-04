import React from 'react';
import { Star, CheckCircle2, AlertCircle, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

const InterviewReport = ({ report, onRestart }) => {
  if (!report) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Core Score Banner */}
      <div className="card p-6 sm:p-8 text-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mx-auto mb-4 border border-white/20">
            <Star className="w-8 h-8 text-warning-400 fill-warning-400" />
          </div>
          <span className="text-[10px] font-bold bg-white/15 text-white py-1 px-3 rounded-full uppercase tracking-wider">
            Performance Index
          </span>
          <h2 className="font-display font-extrabold text-white text-4xl sm:text-5xl mt-3 tracking-tight">
            {report.average_score}
            <span className="text-xl font-normal opacity-60">/10</span>
          </h2>
          <p className="text-sm text-primary-100 max-w-md mx-auto mt-4 leading-relaxed font-medium">
            "{report.overall_feedback}"
          </p>
        </div>
      </div>

      {/* Grid: Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success-50">
              <CheckCircle2 className="w-4 h-4 text-success-600" />
            </div>
            <h3 className="font-display font-semibold text-ink-900 text-[15px]">Top Strengths</h3>
          </div>
          <ul className="space-y-3">
            {(report.top_strengths || []).map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Areas to Improve */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning-50">
              <AlertCircle className="w-4 h-4 text-warning-600" />
            </div>
            <h3 className="font-display font-semibold text-ink-900 text-[15px]">Key Weaknesses</h3>
          </div>
          <ul className="space-y-3">
            {(report.key_weaknesses || []).map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink-700 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-warning-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Plan Detail */}
        <div className="card p-5 md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50">
              <BookOpen className="w-4 h-4 text-primary-600" />
            </div>
            <h3 className="font-display font-semibold text-ink-900 text-[15px]">Improvement Plan</h3>
          </div>
          <ul className="space-y-3">
            {(report.improvement_plan || []).map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink-700 leading-relaxed">
                <Sparkles className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Restart Button */}
      <div className="flex items-center justify-center pt-4">
        <button 
          onClick={onRestart}
          className="btn bg-white text-ink-700 border border-ink-200 px-5 py-3 hover:bg-ink-50 hover:border-ink-300 active:scale-[0.98] font-semibold rounded-xl flex items-center gap-2 text-sm shadow-soft"
        >
          <RefreshCw className="w-4.5 h-4.5" />
          Start Another Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewReport;
