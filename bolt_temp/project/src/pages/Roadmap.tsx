import { CheckCircle2, Circle, Clock, Lock, Map, Sparkles, TrendingUp } from 'lucide-react';

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  progress: number;
  status: 'done' | 'active' | 'locked';
  duration: string;
  skills: string[];
  modules: { name: string; done: boolean }[];
}

const phases: Phase[] = [
  {
    id: 1,
    title: 'Foundations',
    subtitle: 'Core web development fundamentals',
    progress: 100,
    status: 'done',
    duration: '4 weeks',
    skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git'],
    modules: [
      { name: 'Semantic HTML & accessibility', done: true },
      { name: 'Modern CSS & Flexbox/Grid', done: true },
      { name: 'JavaScript ES6+ deep dive', done: true },
      { name: 'Git workflows & collaboration', done: true },
    ],
  },
  {
    id: 2,
    title: 'Frontend Mastery',
    subtitle: 'React ecosystem and modern patterns',
    progress: 65,
    status: 'active',
    duration: '6 weeks',
    skills: ['React', 'TypeScript', 'State Management', 'Testing'],
    modules: [
      { name: 'React hooks & patterns', done: true },
      { name: 'TypeScript for React apps', done: true },
      { name: 'State management (Zustand/Redux)', done: false },
      { name: 'Testing with Vitest & RTL', done: false },
    ],
  },
  {
    id: 3,
    title: 'System Design',
    subtitle: 'Architecture and scalability',
    progress: 20,
    status: 'locked',
    duration: '5 weeks',
    skills: ['System Design', 'API Design', 'Caching', 'Microservices'],
    modules: [
      { name: 'Scalability fundamentals', done: true },
      { name: 'API design patterns', done: false },
      { name: 'Caching strategies', done: false },
      { name: 'Microservices architecture', done: false },
    ],
  },
  {
    id: 4,
    title: 'Interview Ready',
    subtitle: 'Mock interviews and behavioral prep',
    progress: 0,
    status: 'locked',
    duration: '3 weeks',
    skills: ['Behavioral', 'Live Coding', 'System Design Interviews'],
    modules: [
      { name: 'STAR method mastery', done: false },
      { name: 'Live coding practice', done: false },
      { name: 'System design interviews', done: false },
    ],
  },
];

const statusConfig = {
  done: { ring: 'border-success-300 bg-success-50', icon: CheckCircle2, iconColor: 'text-success-600', label: 'Completed', labelColor: 'bg-success-100 text-success-700' },
  active: { ring: 'border-primary-400 bg-primary-50', icon: Sparkles, iconColor: 'text-primary-600', label: 'In Progress', labelColor: 'bg-primary-100 text-primary-700' },
  locked: { ring: 'border-ink-200 bg-ink-50', icon: Lock, iconColor: 'text-ink-400', label: 'Locked', labelColor: 'bg-ink-100 text-ink-500' },
};

export function Roadmap() {
  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="card p-6 mb-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shrink-0">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-ink-900 text-xl">Your Career Roadmap</h2>
            <p className="text-sm text-ink-500 mt-1">
              A personalized path from Frontend Developer to Senior Engineer. Complete phases to unlock the next.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display font-bold text-ink-900">46%</span>
                <span className="text-xs text-ink-500">Overall progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-ink-400" />
                <span className="text-xs text-ink-500">~14 weeks remaining</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success-500" />
                <span className="text-xs text-ink-500">On track</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-ink-200" />

        <div className="space-y-6">
          {phases.map((phase, i) => {
            const cfg = statusConfig[phase.status];
            const Icon = cfg.icon;
            return (
              <div key={phase.id} className="relative pl-16 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Node */}
                <div
                  className={`absolute left-0 top-1 flex items-center justify-center w-12 h-12 rounded-full border-2 ${cfg.ring} bg-white z-10`}
                >
                  <Icon className={`w-5 h-5 ${cfg.iconColor}`} strokeWidth={2.2} />
                </div>

                {/* Card */}
                <div className={`card card-hover p-5 ${phase.status === 'locked' ? 'opacity-70' : ''}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">
                          Phase {phase.id}
                        </span>
                        <span className={`badge ${cfg.labelColor}`}>{cfg.label}</span>
                      </div>
                      <h3 className="font-display font-bold text-ink-900 text-lg mt-1">{phase.title}</h3>
                      <p className="text-sm text-ink-500">{phase.subtitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display font-bold text-ink-900 text-2xl">{phase.progress}%</p>
                      <p className="text-[11px] text-ink-400">{phase.duration}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-ink-100 overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        phase.status === 'done' ? 'bg-success-500' : phase.status === 'active' ? 'bg-primary-500' : 'bg-ink-300'
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {phase.skills.map((s) => (
                      <span key={s} className="badge bg-ink-100 text-ink-600 py-1.5 px-2.5">{s}</span>
                    ))}
                  </div>

                  {/* Modules */}
                  <div className="space-y-2">
                    {phase.modules.map((m, mi) => (
                      <div key={mi} className="flex items-center gap-2.5">
                        {m.done ? (
                          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-ink-300 shrink-0" />
                        )}
                        <span className={`text-sm ${m.done ? 'text-ink-400 line-through' : 'text-ink-700'}`}>
                          {m.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {phase.status === 'active' && (
                    <button className="btn-primary mt-4 w-full sm:w-auto">
                      <Sparkles className="w-4 h-4" />
                      Continue Learning
                    </button>
                  )}
                  {phase.status === 'locked' && (
                    <div className="flex items-center gap-2 mt-4 text-xs text-ink-400">
                      <Lock className="w-3.5 h-3.5" />
                      Complete previous phase to unlock
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
