import {
  Upload,
  Target,
  Sparkles,
  Map,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  FileText,
  Briefcase,
  Zap,
} from 'lucide-react';
import { SectionCard } from '../components/SectionCard';
import { ProgressRing } from '../components/ProgressRing';
import type { PageId } from '../lib/nav';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

const todaysTasks = [
  { id: 1, label: 'Complete React hooks module', done: true, time: '15 min' },
  { id: 2, label: 'Review 2 job descriptions', done: true, time: '20 min' },
  { id: 3, label: 'Practice 1 mock interview question', done: false, time: '10 min' },
  { id: 4, label: 'Update resume skills section', done: false, time: '25 min' },
];

const roadmapSteps = [
  { phase: 'Phase 1', title: 'Foundations', progress: 100, color: 'success' },
  { phase: 'Phase 2', title: 'Frontend Mastery', progress: 65, color: 'primary' },
  { phase: 'Phase 3', title: 'System Design', progress: 20, color: 'accent' },
  { phase: 'Phase 4', title: 'Interview Ready', progress: 0, color: 'ink' },
];

const conversations = [
  { id: 1, title: 'How to transition to senior dev?', preview: 'Based on your current skills, focus on...', time: '2h ago', unread: true },
  { id: 2, title: 'Salary negotiation for remote roles', preview: 'Here are 3 strategies that work well...', time: '1d ago', unread: false },
  { id: 3, title: 'Best certifications for 2026', preview: 'For your target role, I recommend...', time: '3d ago', unread: false },
];

const colorMap: Record<string, string> = {
  success: 'bg-success-500',
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  ink: 'bg-ink-300',
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const completedTasks = todaysTasks.filter((t) => t.done).length;
  const goalPct = Math.round((completedTasks / todaysTasks.length) * 100);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      {/* Welcome hero */}
      <div className="mb-6 animate-fade-in">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-6 sm:p-8 text-white">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute right-20 -bottom-16 w-40 h-40 rounded-full bg-accent-400/10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-white/15 text-white backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-300 animate-pulse-soft" />
                AI Copilot active
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-balance">
              Welcome back, Mohammed 👋
            </h2>
            <p className="text-primary-100 mt-1.5 text-sm sm:text-base">Let's build your future.</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={() => onNavigate('career')}
                className="btn bg-white text-primary-700 px-4 py-2.5 hover:bg-primary-50 active:scale-[0.98] shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Ask Career AI
              </button>
              <button
                onClick={() => onNavigate('resume')}
                className="btn bg-white/10 text-white border border-white/20 px-4 py-2.5 hover:bg-white/20 active:scale-[0.98] backdrop-blur-sm"
              >
                <Upload className="w-4 h-4" />
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: FileText, label: 'Resume Score', value: '78', suffix: '/100', trend: '+12', color: 'primary' },
          { icon: Target, label: 'Skills Tracked', value: '24', suffix: '', trend: '+3', color: 'accent' },
          { icon: MessageSquare, label: 'AI Sessions', value: '47', suffix: '', trend: '+8', color: 'success' },
          { icon: TrendingUp, label: 'Career Match', value: '82', suffix: '%', trend: '+5', color: 'warning' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card card-hover p-4 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl bg-${stat.color}-50`}>
                  <Icon className={`w-4.5 h-4.5 text-${stat.color}-600`} strokeWidth={2.2} />
                </div>
                <span className="badge bg-success-50 text-success-700 text-[11px]">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>
              </div>
              <p className="text-ink-500 text-xs mt-3 font-medium">{stat.label}</p>
              <p className="font-display font-bold text-ink-900 text-2xl mt-0.5">
                {stat.value}
                <span className="text-ink-400 text-base font-semibold">{stat.suffix}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Upload resume prompt */}
      <div className="mb-6">
        <div className="card card-hover p-5 sm:p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 shrink-0">
              <Upload className="w-6 h-6 text-primary-600" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-ink-900 text-[15px]">Upload your resume</h3>
              <p className="text-sm text-ink-500 mt-0.5">
                Get an instant AI analysis, score, and personalized improvement suggestions.
              </p>
            </div>
            <button
              onClick={() => onNavigate('resume')}
              className="btn-primary w-full sm:w-auto shrink-0"
            >
              <Upload className="w-4 h-4" />
              Upload Resume
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Goal */}
        <SectionCard
          title="Today's Goal"
          icon={Target}
          action={
            <span className="badge bg-primary-50 text-primary-700">
              {completedTasks}/{todaysTasks.length} done
            </span>
          }
          className="lg:col-span-1"
        >
          <div className="flex items-center gap-5">
            <ProgressRing value={goalPct} size={110} label="complete" />
            <div className="flex-1 space-y-2 min-w-0">
              {todaysTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2.5 group">
                  {task.done ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-success-500 shrink-0" />
                  ) : (
                    <Circle className="w-4.5 h-4.5 text-ink-300 shrink-0 group-hover:text-primary-400 transition-colors" />
                  )}
                  <span
                    className={`text-sm flex-1 truncate ${
                      task.done ? 'text-ink-400 line-through' : 'text-ink-700'
                    }`}
                  >
                    {task.label}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-ink-400 shrink-0">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Career Recommendation */}
        <SectionCard
          title="Career Recommendation"
          icon={Sparkles}
          action={
            <button
              onClick={() => onNavigate('career')}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Explore <ArrowRight className="w-3 h-3" />
            </button>
          }
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            {[
              { role: 'Senior Frontend Engineer', company: 'Vercel', match: 94, tags: ['React', 'TypeScript', 'Next.js'], salary: '$140k–$180k' },
              { role: 'Full Stack Developer', company: 'Linear', match: 88, tags: ['Node.js', 'React', 'PostgreSQL'], salary: '$120k–$160k' },
            ].map((rec, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-ink-200/70 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200 group cursor-pointer animate-slide-in-right"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-ink-100 to-ink-200 text-ink-600 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900 text-sm truncate">{rec.role}</p>
                    <p className="text-xs text-ink-500 truncate">{rec.company} · {rec.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {rec.tags.map((tag) => (
                    <span key={tag} className="badge bg-ink-100 text-ink-600">{tag}</span>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                    <div className="relative w-9 h-9">
                      <svg className="w-9 h-9 -rotate-90">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-ink-100" />
                        <circle
                          cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3"
                          className="text-accent-500"
                          strokeDasharray={94.2}
                          strokeDashoffset={94.2 - (rec.match / 100) * 94.2}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-accent-600">{rec.match}</span>
                    </div>
                    <span className="text-[11px] text-ink-400 font-medium">match</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Roadmap Progress */}
        <SectionCard
          title="Roadmap Progress"
          icon={Map}
          action={
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          }
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {roadmapSteps.map((step, i) => (
              <div key={step.title} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">{step.phase}</span>
                    <span className="font-medium text-ink-800 text-sm">{step.title}</span>
                  </div>
                  <span className="text-sm font-semibold text-ink-700">{step.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorMap[step.color]} transition-all duration-700 ease-out`}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent AI Conversations */}
        <SectionCard
          title="Recent AI Conversations"
          icon={MessageSquare}
          action={
            <button
              onClick={() => onNavigate('career')}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              New chat <ArrowRight className="w-3 h-3" />
            </button>
          }
          className="lg:col-span-1"
        >
          <div className="space-y-2">
            {conversations.map((c, i) => (
              <button
                key={c.id}
                onClick={() => onNavigate('career')}
                className="w-full text-left p-3 rounded-xl hover:bg-ink-50 transition-colors group animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink-900 text-sm truncate">{c.title}</p>
                      {c.unread && <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-ink-500 truncate mt-0.5">{c.preview}</p>
                    <p className="text-[11px] text-ink-400 mt-1">{c.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Quick actions footer */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Zap, label: 'Quick Chat', page: 'career' as PageId },
          { icon: FileText, label: 'Analyze Resume', page: 'resume' as PageId },
          { icon: Map, label: 'View Roadmap', page: 'roadmap' as PageId },
          { icon: Target, label: 'Skill Gaps', page: 'skillgap' as PageId },
        ].map((qa) => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.label}
              onClick={() => onNavigate(qa.page)}
              className="card card-hover p-4 flex items-center gap-3 group animate-fade-in"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-ink-100 group-hover:bg-primary-50 transition-colors">
                <Icon className="w-4.5 h-4.5 text-ink-600 group-hover:text-primary-600 transition-colors" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-ink-700">{qa.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
