import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Play } from 'lucide-react';

const ActiveInterview = ({ 
  question, 
  feedback, 
  onAnswer, 
  loading, 
  currentIndex, 
  totalQuestions 
}) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim() && !loading) {
      onAnswer(answer);
      setAnswer('');
    }
  };

  const progressPct = Math.round(((currentIndex) / totalQuestions) * 100);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Interview Question Progress Header */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Interview Progress</span>
          <span className="text-xs font-bold text-ink-500">Question {currentIndex + 1} of {totalQuestions}</span>
        </div>
        <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Previous Answer Evaluation (If Feedback Exists) */}
      {feedback && (
        <div className="card p-5 border-l-4 border-l-primary-500 bg-primary-50/5 animate-scale-in">
          <div className="flex items-center justify-between pb-3 border-b border-ink-100">
            <h4 className="font-display font-semibold text-ink-900 text-[14px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              Previous Question Feedback
            </h4>
            <span className="badge bg-primary-100 text-primary-800 text-[11px] font-bold">
              Score: {feedback.score}/10
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3.5">
            <div className="space-y-1">
              <h5 className="text-[12px] font-bold text-success-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
              </h5>
              <p className="text-xs text-ink-600 leading-relaxed">{feedback.feedback_strengths}</p>
            </div>
            <div className="space-y-1">
              <h5 className="text-[12px] font-bold text-warning-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Suggestions
              </h5>
              <p className="text-xs text-ink-600 leading-relaxed">{feedback.feedback_improvements}</p>
            </div>
          </div>
        </div>
      )}

      {/* Current Active Question Display */}
      <div className="card p-6 bg-gradient-to-br from-ink-900 to-ink-950 text-white animate-fade-in">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-primary-200 px-2 py-0.5 rounded-md">
          Current Question
        </span>
        <h3 className="font-display font-semibold text-white text-[16px] mt-3 leading-relaxed">
          {question}
        </h3>
      </div>

      {/* Answer Inputs Textarea */}
      <div className="card p-5 space-y-4">
        <textarea 
          placeholder="Speak or type your answer here as if you were responding to the interviewer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={loading}
          rows={6}
          className="input resize-none w-full border-ink-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
        />
        <div className="flex items-center justify-end">
          <button 
            onClick={handleSubmit} 
            disabled={loading || !answer.trim()}
            className="btn-primary px-5 py-2.5 font-medium rounded-xl flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Evaluating answer...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Submit Answer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveInterview;
