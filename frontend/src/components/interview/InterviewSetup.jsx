import React, { useState } from 'react';
import { Mic, ChevronRight, Zap, GraduationCap, ShieldAlert } from 'lucide-react';

const InterviewSetup = ({ onStart, loading }) => {
  const [role, setRole] = useState('AI Engineer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [type, setType] = useState('Mixed');

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ role, difficulty, type });
  };

  const difficultyOptions = [
    { value: 'Beginner', label: 'Beginner', desc: 'Junior roles', icon: GraduationCap },
    { value: 'Intermediate', label: 'Intermediate', desc: 'Mid-level roles', icon: Zap },
    { value: 'Advanced', label: 'Advanced', desc: 'Senior/Staff roles', icon: ShieldAlert },
  ];

  const typeOptions = [
    { value: 'Technical', label: 'Technical Only', desc: 'Algorithms & Core concepts' },
    { value: 'HR', label: 'HR / Behavioral', desc: 'STAR method & fit' },
    { value: 'Mixed', label: 'Mixed Mode', desc: 'Technical + Behavioral fit' },
  ];

  return (
    <div className="card p-6 sm:p-8 animate-fade-in max-w-2xl mx-auto border border-ink-200/70 shadow-soft bg-white">
      <h3 className="font-display font-bold text-ink-900 text-lg mb-6">Configure Mock Interview</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Target Role */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-ink-700 block">Target Job Role</label>
          <input 
            type="text" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., AI Engineer, Frontend Dev, Product Manager"
            className="input"
            required
            disabled={loading}
          />
        </div>

        {/* Difficulty Selection Cards */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-ink-700 block">Difficulty Level</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {difficultyOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = difficulty === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  disabled={loading}
                  className={`card p-4 text-left transition-all cursor-pointer flex flex-col items-start gap-1 group ${
                    isActive ? 'border-primary-500 ring-2 ring-primary-100 bg-primary-50/10' : 'hover:border-ink-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-ink-400 group-hover:text-ink-600'}`} />
                  <span className="text-sm font-semibold text-ink-900 mt-2">{opt.label}</span>
                  <span className="text-xs text-ink-500 leading-normal">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interview Type Selection List */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-ink-700 block">Interview Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {typeOptions.map((opt) => {
              const isActive = type === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  disabled={loading}
                  className={`card p-4 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive ? 'border-primary-500 ring-2 ring-primary-100 bg-primary-50/10' : 'hover:border-ink-300'
                  }`}
                >
                  <span className="text-sm font-semibold text-ink-900">{opt.label}</span>
                  <span className="text-xs text-ink-500 mt-1 leading-normal">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trigger Button */}
        <button 
          type="submit" 
          disabled={loading || !role.trim()}
          className="btn-primary w-full py-3 mt-4 text-sm font-medium rounded-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              Setting up session...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Start Mock Interview
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InterviewSetup;
