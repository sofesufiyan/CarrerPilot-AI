import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  Wrench,
  Users
} from 'lucide-react';
import { ProgressRing } from './ProgressRing';

const ResumeAnalysis = ({ 
  activeAnalysis, 
  generateResumePDF, 
  analysisTab, 
  setAnalysisTab 
}) => {
  if (!activeAnalysis) return null;

  const handleUploadAnotherClick = () => {
    // Emulate click on left sidebar's hidden file input
    const uploadInput = document.querySelector('input[type="file"]');
    if (uploadInput) {
      uploadInput.click();
    }
  };

  // Maps suggestions into Bolt UI's visual priority format
  const suggestions = activeAnalysis.suggestions || [];
  const weaknesses = activeAnalysis.weaknesses || [];
  
  // Combine dynamic weaknesses and suggestions for the Areas to Improve section
  const improvements = [
    ...weaknesses.map((w, i) => ({
      text: w,
      severity: i === 0 ? 'high' : 'medium'
    })),
    ...suggestions.map(s => ({
      text: s,
      severity: 'low'
    }))
  ];

  const severityMap = {
    high: { icon: XCircle, bg: 'bg-error-50', text: 'text-error-700' },
    medium: { icon: AlertCircle, bg: 'bg-warning-50', text: 'text-warning-700' },
    low: { icon: AlertCircle, bg: 'bg-primary-50', text: 'text-primary-700' },
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Score Header Card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing value={activeAnalysis.resume_score} size={130} label="resume score" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <FileText className="w-5 h-5 text-ink-400" />
              <span className="font-medium text-ink-900 text-sm truncate max-w-xs">{activeAnalysis.filename}</span>
              <span className="badge bg-success-50 text-success-700">Analyzed</span>
            </div>
            <h3 className="font-display font-bold text-ink-900 text-xl mt-2">
              Resume Analysis Complete
            </h3>
            <p className="text-sm text-ink-500 mt-1">
              {activeAnalysis.ai_explanation || "Your resume has been parsed and evaluated against standard ATS rules and job requirements."}
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <button 
                onClick={() => generateResumePDF(activeAnalysis)}
                className="btn bg-primary-600 text-white px-4 py-2.5 hover:bg-primary-700 active:scale-[0.98] shadow-sm hover:shadow-glow font-medium rounded-xl flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button
                onClick={handleUploadAnotherClick}
                className="btn bg-white text-ink-700 border border-ink-200 px-4 py-2.5 hover:bg-ink-50 hover:border-ink-300 active:scale-[0.98] font-medium rounded-xl flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Analyze Another
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success-50">
              <CheckCircle2 className="w-4 h-4 text-success-600" />
            </div>
            <h3 className="font-display font-semibold text-ink-900 text-[15px]">Strengths</h3>
          </div>
          <div className="space-y-3">
            {activeAnalysis.strengths?.length > 0 ? (
              activeAnalysis.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <CheckCircle2 className="w-4.5 h-4.5 text-success-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-ink-700 leading-relaxed">{s}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink-400">No specific strengths listed.</p>
            )}
          </div>
        </div>

        {/* Improvements */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning-50">
              <AlertCircle className="w-4 h-4 text-warning-600" />
            </div>
            <h3 className="font-display font-semibold text-ink-900 text-[15px]">Areas to Improve</h3>
          </div>
          <div className="space-y-3">
            {improvements.length > 0 ? (
              improvements.map((imp, i) => {
                const s = severityMap[imp.severity] || severityMap.low;
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <Icon className={`w-4.5 h-4.5 ${s.text} shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-sm text-ink-700 leading-relaxed">{imp.text}</p>
                      <span className={`badge ${s.bg} ${s.text} mt-1 text-[10px]`}>{imp.severity} priority</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-ink-400">No major areas of improvement suggested.</p>
            )}
          </div>
        </div>

        {/* Technical Skills Found */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50">
              <Wrench className="w-4 h-4 text-primary-600" />
            </div>
            <h3 className="font-display font-semibold text-ink-900 text-[15px]">Technical Skills Found</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeAnalysis.technical_skills?.length > 0 ? (
              activeAnalysis.technical_skills.map((k) => (
                <span key={k} className="badge bg-primary-50 text-primary-700 py-1.5 px-3 font-medium rounded-full">{k}</span>
              ))
            ) : (
              <span className="text-xs text-ink-400">No technical skills detected.</span>
            )}
          </div>
        </div>

        {/* Soft Skills Found */}
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success-50">
              <Users className="w-4 h-4 text-success-600" />
            </div>
            <h3 className="font-display font-semibold text-ink-900 text-[15px]">Soft Skills Found</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeAnalysis.soft_skills?.length > 0 ? (
              activeAnalysis.soft_skills.map((k) => (
                <span key={k} className="badge bg-success-50 text-success-700 py-1.5 px-3 font-medium rounded-full">{k}</span>
              ))
            ) : (
              <span className="text-xs text-ink-400">No soft skills detected.</span>
            )}
          </div>
        </div>

        {/* Missing Keywords (Skill Gaps) */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-error-50">
              <XCircle className="w-4 h-4 text-error-600" />
            </div>
            <h3 className="font-display font-semibold text-ink-900 text-[15px]">Missing Keywords (Skill Gaps)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeAnalysis.missing_skills?.length > 0 ? (
              activeAnalysis.missing_skills.map((k) => (
                <span key={k} className="badge bg-error-50 text-error-700 py-1.5 px-3 font-medium rounded-full">{k}</span>
              ))
            ) : (
              <span className="text-xs text-success-700 font-medium bg-success-50 py-1 px-3 rounded-full">All matching keywords found!</span>
            )}
          </div>
          <p className="text-xs text-ink-500 mt-3">
            These keywords frequently appear in job postings for your target role. Adding evidence of these skills will improve your ATS ranking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysis;
