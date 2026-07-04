import { useState } from 'react';
import { Mic, Play, Star, Clock, CheckCircle2, TrendingUp, Video, Code2, MessageSquare } from 'lucide-react';

const sessions = [
  { id: 1, type: 'Behavioral', score: 8.5, date: '2 days ago', duration: '24 min', icon: MessageSquare },
  { id: 2, type: 'Live Coding', score: 7.0, date: '5 days ago', duration: '35 min', icon: Code2 },
  { id: 3, type: 'System Design', score: 6.5, date: '1 week ago', duration: '40 min', icon: Video },
];

const categories = [
  { id: 'behavioral', label: 'Behavioral', desc: 'STAR method & storytelling', icon: MessageSquare, count: 12, color: 'primary' },
  { id: 'coding', label: 'Live Coding', desc: 'Algorithms & data structures', icon: Code2, count: 18, color: 'accent' },
  { id: 'system', label: 'System Design', desc: 'Architecture & scalability', icon: Video, count: 8, color: 'success' },
];

export function Interview() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="card p-6 mb-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 shrink-0">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-ink-900 text-xl">AI Mock Interviews</h2>
            <p className="text-sm text-ink-500 mt-1">
              Practice with realistic interview scenarios. Get instant AI feedback on your answers.
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(isActive ? null : cat.id)}
              className={`card card-hover p-5 text-left animate-fade-in transition-all ${
                isActive ? 'ring-2 ring-primary-400 ring-offset-2' : ''
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-${cat.color}-50`}>
                <Icon className={`w-5 h-5 text-${cat.color}-600`} />
              </div>
              <p className="font-display font-semibold text-ink-900 text-sm mt-3">{cat.label}</p>
              <p className="text-xs text-ink-500 mt-0.5">{cat.desc}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-ink-400">{cat.count} questions</span>
                <Play className="w-4 h-4 text-primary-500" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Start session CTA */}
      {active && (
        <div className="card p-6 mb-6 animate-scale-in bg-gradient-to-br from-primary-50 to-accent-50/50 border-primary-200">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-soft shrink-0">
              <Mic className="w-7 h-7 text-primary-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display font-semibold text-ink-900">Ready to start?</h3>
              <p className="text-sm text-ink-500 mt-0.5">
                You'll get 5 questions with real-time AI feedback. Estimated time: 25 minutes.
              </p>
            </div>
            <button className="btn-primary shrink-0">
              <Mic className="w-4 h-4" />
              Start Session
            </button>
          </div>
        </div>
      )}

      {/* Recent sessions */}
      <div className="card p-5 animate-fade-in">
        <h3 className="font-display font-semibold text-ink-900 text-[15px] mb-4">Recent Sessions</h3>
        <div className="space-y-3">
          {sessions.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-ink-200/70 hover:border-primary-200 hover:bg-primary-50/30 transition-all cursor-pointer animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-ink-100 shrink-0">
                  <Icon className="w-5 h-5 text-ink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-900 text-sm">{s.type} Interview</p>
                  <div className="flex items-center gap-3 text-[11px] text-ink-400 mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration}</span>
                    <span>{s.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(s.score / 2) ? 'text-warning-400 fill-warning-400' : 'text-ink-200'}`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-ink-700 ml-1.5">{s.score}/10</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0 hidden sm:block" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Sessions Completed', value: '23', icon: CheckCircle2, color: 'success' },
          { label: 'Avg. Score', value: '7.4', icon: Star, color: 'warning' },
          { label: 'Improvement', value: '+18%', icon: TrendingUp, color: 'primary' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-4 text-center animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`flex items-center justify-center w-9 h-9 rounded-xl bg-${stat.color}-50 mx-auto`}>
                <Icon className={`w-4.5 h-4.5 text-${stat.color}-600`} />
              </div>
              <p className="font-display font-bold text-ink-900 text-2xl mt-2">{stat.value}</p>
              <p className="text-[11px] text-ink-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
