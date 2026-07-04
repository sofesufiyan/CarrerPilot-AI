import React from 'react';
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
import { SectionCard } from './SectionCard';
import { ProgressRing } from './ProgressRing';

const Dashboard = ({ 
  resumeHistory, 
  interviewHistory, 
  historyLoading, 
  askAI, 
  viewFullReport, 
  user,
  setViewMode
}) => {
  const latestResume = resumeHistory?.[0] || null;
  const resumeScore = latestResume?.resume_score || 0;
  const atsScore = latestResume?.ats_score || 0;
  const skillsCount = (latestResume?.technical_skills?.length || 0) + (latestResume?.soft_skills?.length || 0);
  const interviewSessionsCount = interviewHistory?.length || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = user?.displayName 
    ? user.displayName.split(" ")[0] 
    : (user?.email ? user.email.split("@")[0] : "Mohammed");

  // Dynamic Today's Tasks
  const todaysTasks = [];
  if (latestResume) {
    const missing = latestResume.missing_skills || [];
    if (missing.length > 0) {
      todaysTasks.push({
        id: 1,
        label: `Learn missing skill: ${missing[0]}`,
        done: false,
        time: '30m'
      });
    }
    const suggestions = latestResume.suggestions || [];
    if (suggestions.length > 0) {
      todaysTasks.push({
        id: 2,
        label: suggestions[0],
        done: false,
        time: '20m'
      });
    }
    if (suggestions.length > 1) {
      todaysTasks.push({
        id: 3,
        label: suggestions[1],
        done: false,
        time: '15m'
      });
    }
    todaysTasks.push({
      id: 4,
      label: 'Practice mock interview sessions',
      done: interviewSessionsCount > 0,
      time: '15m'
    });
  } else {
    todaysTasks.push(
      { id: 1, label: 'Upload your resume for scoring', done: false, time: '5m' },
      { id: 2, label: 'Explore career advisor chat', done: false, time: '10m' },
      { id: 3, label: 'Configure your career profile', done: false, time: '5m' },
      { id: 4, label: 'Start your first mock interview', done: false, time: '15m' }
    );
  }

  const completedTasks = todaysTasks.filter((t) => t.done).length;
  const goalPct = Math.round((completedTasks / todaysTasks.length) * 100);

  // Dynamic Career Recommendations
  const recommendedRoles = latestResume?.recommended_roles || [];
  const displayRoles = recommendedRoles.length > 0 ? recommendedRoles : [
    { title: 'Full Stack Engineer', salary_range: '$100k - $140k', match_percentage: 85, tags: ['React', 'Node.js'] },
    { title: 'Backend Developer', salary_range: '$90k - $130k', match_percentage: 75, tags: ['Python', 'FastAPI'] }
  ];

  // Dynamic Roadmap Steps
  const rawRoadmap = latestResume?.roadmap || [];
  const roadmapSteps = rawRoadmap.length > 0 ? rawRoadmap.slice(0, 4).map((stepText, idx) => {
    const progressVal = idx === 0 ? 100 : idx === 1 ? 75 : idx === 2 ? 30 : 0;
    const colors = ['success', 'primary', 'accent', 'ink'];
    return {
      phase: `Phase ${idx + 1}`,
      title: stepText,
      progress: progressVal,
      color: colors[idx % colors.length]
    };
  }) : [
    { phase: 'Phase 1', title: 'Upload resume to generate customized roadmap', progress: 0, color: 'primary' }
  ];

  const colorMap = {
    success: 'bg-success-500',
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    ink: 'bg-ink-300',
  };

  // Dynamic Recent Conversations (matches active state)
  const conversations = [
    {
      id: 1,
      title: latestResume ? `Resume analysis for ${latestResume.filename}` : 'Start Chatting with Career AI',
      preview: latestResume ? `Overall resume score is ${resumeScore}/100.` : 'Ask questions about resume, interviews, or career paths...',
      time: latestResume ? new Date(latestResume.generated_at || Date.now()).toLocaleDateString() : 'Just now',
      unread: !latestResume
    }
  ];

  const handleUploadResumeClick = () => {
    // Emulate click on left sidebar's hidden file input
    const uploadInput = document.querySelector('input[type="file"]');
    if (uploadInput) {
      uploadInput.click();
    } else {
      setViewMode('analysis');
    }
  };

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
              {getGreeting()}, {firstName} 👋
            </h2>
            <p className="text-primary-100 mt-1.5 text-sm sm:text-base">Ready to move one step closer to your dream career?</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={() => setViewMode('chat')}
                className="btn bg-white text-primary-700 px-4 py-2.5 hover:bg-primary-50 active:scale-[0.98] shadow-sm font-medium rounded-xl"
              >
                <Sparkles className="w-4 h-4" />
                Ask Career AI
              </button>
              <button
                onClick={handleUploadResumeClick}
                className="btn bg-white/10 text-white border border-white/20 px-4 py-2.5 hover:bg-white/20 active:scale-[0.98] backdrop-blur-sm font-medium rounded-xl"
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
          { icon: FileText, label: 'Resume Score', value: resumeScore, suffix: '/100', trend: latestResume ? 'Active' : 'No Data', color: 'primary' },
          { icon: Target, label: 'Skills Tracked', value: skillsCount, suffix: '', trend: latestResume ? `${latestResume.technical_skills?.length || 0} tech` : '0 tech', color: 'accent' },
          { icon: MessageSquare, label: 'Mock Interviews', value: interviewSessionsCount, suffix: '', trend: `${interviewSessionsCount} run`, color: 'success' },
          { icon: TrendingUp, label: 'ATS Score', value: atsScore, suffix: '%', trend: latestResume ? 'Analyzed' : 'No Data', color: 'warning' },
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

      {/* Upload resume prompt card (prominently featured if empty/low score) */}
      {!latestResume && (
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
                onClick={handleUploadResumeClick}
                className="btn-primary w-full sm:w-auto shrink-0 font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload Resume
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex flex-col gap-5">
            <div className="flex justify-center py-2">
              <ProgressRing value={goalPct} size={110} label="complete" />
            </div>
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
                    title={task.label}
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
            latestResume ? (
              <button
                onClick={viewFullReport}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Explore <ArrowRight className="w-3 h-3" />
              </button>
            ) : null
          }
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            {displayRoles.map((rec, i) => (
              <div
                key={i}
                onClick={viewFullReport}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-ink-200/70 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200 group cursor-pointer animate-slide-in-right"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-ink-100 to-ink-200 text-ink-600 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900 text-sm truncate">{rec.title}</p>
                    <p className="text-xs text-ink-500 truncate">{rec.salary_range || '$80k - $120k'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(rec.tags || ['In-Demand', 'High Fit']).map((tag) => (
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
                          strokeDashoffset={94.2 - ((rec.match_percentage || 80) / 100) * 94.2}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-accent-600">{rec.match_percentage || 80}</span>
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
            latestResume ? (
              <button
                onClick={viewFullReport}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            ) : null
          }
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {roadmapSteps.map((step, i) => (
              <div key={step.title} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">{step.phase}</span>
                    <span className="font-medium text-ink-800 text-sm truncate max-w-xs md:max-w-md block" title={step.title}>{step.title}</span>
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
              onClick={() => setViewMode('chat')}
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
                onClick={() => setViewMode('chat')}
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
          { icon: Zap, label: 'Quick Chat', mode: 'chat' },
          { icon: FileText, label: 'Analyze Resume', mode: 'analysis' },
          { icon: Map, label: 'View Roadmap', mode: 'analysis' },
          { icon: Target, label: 'Skill Gaps', mode: 'analysis' },
        ].map((qa) => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.label}
              onClick={() => {
                if (qa.mode === 'analysis') {
                  if (latestResume) {
                    viewFullReport();
                  } else {
                    handleUploadResumeClick();
                  }
                } else {
                  setViewMode(qa.mode);
                }
              }}
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
};

export default Dashboard;
