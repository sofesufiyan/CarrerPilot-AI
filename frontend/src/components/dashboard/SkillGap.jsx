import React from 'react';
import { Target, TrendingUp, TrendingDown, Sparkles, ArrowRight, Upload } from 'lucide-react';

const statusConfig = {
  strong: { label: 'Strong', color: 'success', bg: 'bg-success-500', badge: 'bg-success-50 text-success-700' },
  developing: { label: 'Developing', color: 'warning', bg: 'bg-warning-500', badge: 'bg-warning-50 text-warning-700' },
  gap: { label: 'Gap', color: 'error', bg: 'bg-error-500', badge: 'bg-error-50 text-error-700' },
};

export function SkillGap({ resumeHistory, setViewMode }) {
  const latestResume = resumeHistory?.[0] || null;
  const technicalSkills = latestResume?.technical_skills || [];
  const missingSkills = latestResume?.missing_skills || [];
  const softSkills = latestResume?.soft_skills || [];

  const handleUploadResumeClick = () => {
    const uploadInput = document.querySelector('input[type="file"]');
    if (uploadInput) {
      uploadInput.click();
    }
  };

  // Construct dynamic skill list from real API response data
  const skillsList = [
    ...technicalSkills.slice(0, 5).map((sk) => ({
      name: sk,
      level: 90,
      target: 80,
      status: 'strong',
    })),
    ...softSkills.slice(0, 2).map((sk) => ({
      name: sk,
      level: 80,
      target: 75,
      status: 'developing',
    })),
    ...missingSkills.slice(0, 4).map((sk) => ({
      name: sk,
      level: 25,
      target: 75,
      status: 'gap',
    })),
  ];

  const gaps = skillsList.filter((s) => s.status === 'gap');
  const strong = skillsList.filter((s) => s.status === 'strong');

  const matchPercentage = latestResume ? latestResume.ats_score : 0;

  if (!latestResume) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto text-center animate-fade-in">
        <div className="card p-10 sm:p-16">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 mx-auto">
            <Target className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="font-display font-semibold text-ink-900 text-lg mt-6">
            No Skill Gap Analysis Generated
          </h3>
          <p className="text-sm text-ink-500 mt-2 max-w-sm mx-auto">
            Please upload a resume first. We will analyze your skills against standard industry roles to map out your competencies and gaps.
          </p>
          <button 
            onClick={handleUploadResumeClick}
            className="btn-primary mt-6 mx-auto font-medium"
          >
            <Upload className="w-4 h-4" />
            Upload Resume
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="card p-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-error-400 to-error-600 shrink-0 text-white">
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-ink-900 text-xl">Skill Gap Analysis</h2>
            <p className="text-sm text-ink-500 mt-1">
              Your parsed profile skills mapped against industry-standard targets for similar roles.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Strong Skills', value: strong.length, icon: TrendingUp, color: 'success' },
          { label: 'Critical Gaps', value: gaps.length, icon: TrendingDown, color: 'error' },
          { label: 'Overall Match', value: `${matchPercentage}%`, icon: Target, color: 'primary' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`flex items-center justify-center w-9 h-9 rounded-xl bg-${s.color}-50`}>
                <Icon className={`w-4.5 h-4.5 text-${s.color}-600`} />
              </div>
              <p className="font-display font-bold text-ink-900 text-2xl mt-2">{s.value}</p>
              <p className="text-[11px] text-ink-500 font-medium">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Skill Level Bars */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-ink-900 text-[15px] mb-4">Competency Map</h3>
        <div className="space-y-4">
          {skillsList.map((skill, i) => {
            const cfg = statusConfig[skill.status] || statusConfig.gap;
            return (
              <div key={skill.name} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink-800 text-sm">{skill.name}</span>
                    <span className={`badge ${cfg.badge} text-[10px]`}>{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-ink-700 font-semibold">{skill.level}%</span>
                    <span className="text-ink-400">/ {skill.target}% target</span>
                  </div>
                </div>
                <div className="relative h-2.5 rounded-full bg-ink-100 overflow-hidden">
                  {/* Target line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-ink-400 z-10"
                    style={{ left: `${skill.target}%` }}
                  />
                  {/* Current fill */}
                  <div
                    className={`h-full rounded-full ${cfg.bg} transition-all duration-700 ease-out`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-ink-100">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-ink-400" />
            <span className="text-[11px] text-ink-500">Target Level</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success-500" />
            <span className="text-[11px] text-ink-500">Your Level</span>
          </div>
        </div>
      </div>

      {/* AI recommendation panel */}
      {gaps.length > 0 && (
        <div className="card p-5 bg-gradient-to-br from-primary-50 to-accent-50/40 border-primary-200">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-soft shrink-0">
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-ink-900 text-[15px]">AI Recommendations</h3>
              <p className="text-sm text-ink-600 mt-1.5 leading-relaxed">
                Your primary missing competencies are: <span className="font-semibold text-ink-800">{gaps.map(g => g.name).slice(0, 3).join(', ')}</span>. Focus on bridging these gaps through structured roadmap milestones.
              </p>
              <button 
                onClick={() => setViewMode('roadmap')}
                className="btn-primary mt-4 font-medium flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                View Learning Roadmap
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillGap;
