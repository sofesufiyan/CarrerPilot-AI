import { Target, TrendingUp, TrendingDown, Sparkles, ArrowRight } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  target: number;
  status: 'strong' | 'developing' | 'gap';
}

const skills: Skill[] = [
  { name: 'React', level: 90, target: 85, status: 'strong' },
  { name: 'TypeScript', level: 82, target: 85, status: 'developing' },
  { name: 'System Design', level: 25, target: 75, status: 'gap' },
  { name: 'Node.js', level: 70, target: 75, status: 'developing' },
  { name: 'AWS / Cloud', level: 15, target: 60, status: 'gap' },
  { name: 'CSS / Tailwind', level: 88, target: 80, status: 'strong' },
  { name: 'Testing', level: 45, target: 70, status: 'gap' },
  { name: 'CI/CD', level: 20, target: 55, status: 'gap' },
];

const statusConfig = {
  strong: { label: 'Strong', color: 'success', bg: 'bg-success-500', badge: 'bg-success-50 text-success-700' },
  developing: { label: 'Developing', color: 'warning', bg: 'bg-warning-500', badge: 'bg-warning-50 text-warning-700' },
  gap: { label: 'Gap', color: 'error', bg: 'bg-error-500', badge: 'bg-error-50 text-error-700' },
};

export function SkillGap() {
  const gaps = skills.filter((s) => s.status === 'gap');
  const strong = skills.filter((s) => s.status === 'strong');

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="card p-6 mb-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-error-400 to-error-600 shrink-0">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-ink-900 text-xl">Skill Gap Analysis</h2>
            <p className="text-sm text-ink-500 mt-1">
              Your current skills vs. what's needed for your target role: <span className="font-medium text-ink-700">Senior Frontend Engineer</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Strong Skills', value: strong.length, icon: TrendingUp, color: 'success' },
          { label: 'Skill Gaps', value: gaps.length, icon: TrendingDown, color: 'error' },
          { label: 'Overall Match', value: '62%', icon: Target, color: 'primary' },
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

      {/* Skill bars */}
      <div className="card p-5 mb-6 animate-fade-in">
        <h3 className="font-display font-semibold text-ink-900 text-[15px] mb-4">Skill Levels</h3>
        <div className="space-y-4">
          {skills.map((skill, i) => {
            const cfg = statusConfig[skill.status];
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
                  {/* Target marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-ink-400 z-10"
                    style={{ left: `${skill.target}%` }}
                  />
                  {/* Current level */}
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
            <span className="text-[11px] text-ink-500">Target level</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success-500" />
            <span className="text-[11px] text-ink-500">Your level</span>
          </div>
        </div>
      </div>

      {/* AI recommendation */}
      <div className="card p-5 animate-fade-in bg-gradient-to-br from-primary-50 to-accent-50/40 border-primary-200">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-soft shrink-0">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-ink-900 text-[15px]">AI Recommendation</h3>
            <p className="text-sm text-ink-600 mt-1.5 leading-relaxed">
              Your biggest gaps are <span className="font-semibold text-ink-800">System Design</span>, <span className="font-semibold text-ink-800">AWS/Cloud</span>, and <span className="font-semibold text-ink-800">CI/CD</span>. I recommend starting with System Design — it's the highest-impact skill for senior roles and appears in 87% of senior frontend job postings.
            </p>
            <button className="btn-primary mt-4">
              <Sparkles className="w-4 h-4" />
              Generate Learning Plan
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
