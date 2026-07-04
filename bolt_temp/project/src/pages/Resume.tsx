import { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  Download,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { ProgressRing } from '../components/ProgressRing';

type Status = 'idle' | 'uploading' | 'analyzing' | 'done';

const analysisData = {
  score: 78,
  strengths: [
    'Strong technical skills section with relevant keywords',
    'Clear career progression and quantified achievements',
    'Well-structured experience with action verbs',
  ],
  improvements: [
    { severity: 'high', text: 'Add a professional summary at the top' },
    { severity: 'medium', text: 'Include metrics for 3 bullet points in latest role' },
    { severity: 'low', text: 'Consider adding a projects section' },
  ],
  keywords: {
    found: ['React', 'TypeScript', 'Node.js', 'REST API', 'Git', 'Agile'],
    missing: ['System Design', 'CI/CD', 'AWS', 'GraphQL', 'Leadership'],
  },
};

const severityMap = {
  high: { icon: XCircle, color: 'error', bg: 'bg-error-50', text: 'text-error-700' },
  medium: { icon: AlertCircle, color: 'warning', bg: 'bg-warning-50', text: 'text-warning-700' },
  low: { icon: AlertCircle, color: 'primary', bg: 'bg-primary-50', text: 'text-primary-700' },
};

export function Resume() {
  const [status, setStatus] = useState<Status>('idle');
  const [fileName, setFileName] = useState('');

  const handleUpload = () => {
    setFileName('mohammed_ali_resume.pdf');
    setStatus('uploading');
    setTimeout(() => setStatus('analyzing'), 1200);
    setTimeout(() => setStatus('done'), 3200);
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      {/* Upload zone */}
      {status === 'idle' && (
        <div className="animate-fade-in">
          <div
            onClick={handleUpload}
            onDrop={(e) => {
              e.preventDefault();
              handleUpload();
            }}
            onDragOver={(e) => e.preventDefault()}
            className="card card-hover p-10 sm:p-16 text-center cursor-pointer border-2 border-dashed border-ink-300 hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 text-primary-600" strokeWidth={1.8} />
            </div>
            <h3 className="font-display font-semibold text-ink-900 text-lg mt-5">
              Upload your resume
            </h3>
            <p className="text-sm text-ink-500 mt-1.5 max-w-sm mx-auto">
              Drag and drop your PDF or DOCX file here, or click to browse. Get instant AI analysis.
            </p>
            <button className="btn-primary mt-6 mx-auto">
              <Upload className="w-4 h-4" />
              Choose File
            </button>
            <p className="text-[11px] text-ink-400 mt-4">Supports PDF, DOCX · Max 5MB</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { icon: Sparkles, title: 'AI Analysis', desc: 'Get a detailed score and breakdown' },
              { icon: TrendingUp, title: 'Keyword Match', desc: 'See how you match job requirements' },
              { icon: CheckCircle2, title: 'Smart Suggestions', desc: 'Actionable improvements instantly' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card p-4 animate-fade-in">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <p className="font-semibold text-ink-900 text-sm mt-3">{f.title}</p>
                  <p className="text-xs text-ink-500 mt-1">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Uploading / Analyzing */}
      {(status === 'uploading' || status === 'analyzing') && (
        <div className="card p-10 text-center animate-scale-in">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 mx-auto">
            <RefreshCw className={`w-8 h-8 text-primary-600 ${status === 'analyzing' ? 'animate-spin' : ''}`} />
          </div>
          <h3 className="font-display font-semibold text-ink-900 text-lg mt-5">
            {status === 'uploading' ? 'Uploading...' : 'Analyzing your resume...'}
          </h3>
          <p className="text-sm text-ink-500 mt-1.5">{fileName}</p>
          <div className="max-w-xs mx-auto mt-6">
            <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000 ease-out"
                style={{ width: status === 'uploading' ? '40%' : '85%' }}
              />
            </div>
            <p className="text-xs text-ink-400 mt-2">
              {status === 'uploading' ? 'Uploading file...' : 'AI is reviewing your content...'}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {status === 'done' && (
        <div className="space-y-6 animate-fade-in">
          {/* Score header */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ProgressRing value={analysisData.score} size={130} label="resume score" />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <FileText className="w-5 h-5 text-ink-400" />
                  <span className="font-medium text-ink-900 text-sm">{fileName}</span>
                  <span className="badge bg-success-50 text-success-700">Analyzed</span>
                </div>
                <h3 className="font-display font-bold text-ink-900 text-xl mt-2">
                  Good start — let's make it great
                </h3>
                <p className="text-sm text-ink-500 mt-1">
                  Your resume scores above average. A few targeted improvements could push it to 90+.
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                  <button className="btn-primary">
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-secondary"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Analyze Another
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                {analysisData.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <CheckCircle2 className="w-4.5 h-4.5 text-success-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-ink-700 leading-relaxed">{s}</p>
                  </div>
                ))}
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
                {analysisData.improvements.map((imp, i) => {
                  const s = severityMap[imp.severity as keyof typeof severityMap];
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
                })}
              </div>
            </div>

            {/* Keywords found */}
            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success-50">
                  <CheckCircle2 className="w-4 h-4 text-success-600" />
                </div>
                <h3 className="font-display font-semibold text-ink-900 text-[15px]">Keywords Found</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisData.keywords.found.map((k) => (
                  <span key={k} className="badge bg-success-50 text-success-700 py-1.5 px-3">{k}</span>
                ))}
              </div>
            </div>

            {/* Keywords missing */}
            <div className="card p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-error-50">
                  <XCircle className="w-4 h-4 text-error-600" />
                </div>
                <h3 className="font-display font-semibold text-ink-900 text-[15px]">Missing Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisData.keywords.missing.map((k) => (
                  <span key={k} className="badge bg-error-50 text-error-700 py-1.5 px-3">{k}</span>
                ))}
              </div>
              <p className="text-xs text-ink-500 mt-3">
                These keywords appear frequently in senior-level job postings for your target role.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
