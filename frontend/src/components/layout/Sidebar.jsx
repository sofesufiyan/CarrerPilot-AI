import React from 'react';
import UploadResume from './UploadResume';
import { LayoutDashboard, Map, Target, Mic, MessageSquare, Plus, FileText, History } from 'lucide-react';

const Sidebar = ({
  viewMode,
  setViewMode,
  loading,
  uploadResume,
  historyLoading,
  historyError,
  resumeHistory,
  activeAnalysis,
  setActiveAnalysis,
  setAnalysisTab,
  resetChat
}) => {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-ink-200/70 bg-white shrink-0 h-[calc(100vh-4rem)]">
      {/* Reset Chat Button */}
      <div className="p-4 border-b border-ink-200/70">
        <button 
          onClick={resetChat}
          className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 bg-primary-600 text-white px-4 py-2.5 hover:bg-primary-700 active:scale-[0.98] shadow-sm hover:shadow-glow text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      {/* Navigation Group */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
        <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-400">Navigation</p>
        
        <button 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 w-full text-left text-sm cursor-pointer ${
            viewMode === 'dashboard' ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
          }`}
          onClick={() => setViewMode('dashboard')}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </button>
        
        <button 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 w-full text-left text-sm cursor-pointer ${
            viewMode === 'roadmap' ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
          }`}
          onClick={() => setViewMode('roadmap')}
        >
          <Map className="w-4 h-4 shrink-0" />
          <span>Learning Roadmap</span>
        </button>

        <button 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 w-full text-left text-sm cursor-pointer ${
            viewMode === 'skillgap' ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
          }`}
          onClick={() => setViewMode('skillgap')}
        >
          <Target className="w-4 h-4 shrink-0" />
          <span>Skill Gap Analysis</span>
        </button>

        <button 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 w-full text-left text-sm cursor-pointer ${
            viewMode === 'interview' ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
          }`}
          onClick={() => setViewMode('interview')}
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>Interview Coach</span>
        </button>

        <button 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 w-full text-left text-sm cursor-pointer ${
            viewMode === 'chat' ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
          }`}
          onClick={() => setViewMode('chat')}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>AI Mentor Chat</span>
        </button>

        {/* AUTOMATIC RESUME SCORING ENGINE UPLOADER */}
        <div className="pt-4 border-t border-ink-100 mt-4">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-2">Resume Engine</p>
          <div className="px-2">
            <UploadResume onUpload={uploadResume} isUploading={loading} />
          </div>
        </div>

        {/* RESUME DATABASE HISTORY LIST */}
        <div className="pt-4 border-t border-ink-100 mt-4">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-400 flex items-center gap-1.5 mb-2">
            <History className="w-3.5 h-3.5" />
            Resume History
          </p>
          
          {historyLoading ? (
            <div className="flex items-center justify-center py-4 text-xs text-ink-400">
              <span className="w-3.5 h-3.5 border-2 border-ink-300 border-t-ink-600 rounded-full animate-spin mr-2"></span> 
              Loading history...
            </div>
          ) : historyError ? (
            <div className="text-xs text-error-600 px-3 py-2 bg-error-50 rounded-lg">{historyError}</div>
          ) : resumeHistory.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin px-1">
              {resumeHistory.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col gap-1 p-2 rounded-xl transition-all duration-200 cursor-pointer border ${
                    activeAnalysis?.id === item.id && viewMode === "analysis" 
                      ? 'border-primary-200 bg-primary-50/40' 
                      : 'border-transparent hover:bg-ink-50'
                  }`}
                  onClick={() => {
                    setActiveAnalysis(item);
                    setViewMode("analysis");
                    setAnalysisTab("overview");
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink-800 truncate max-w-[120px]" title={item.filename}>
                      {item.filename}
                    </span>
                    <span className="text-[9px] text-ink-400">
                      {item.generated_at ? new Date(item.generated_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-1.5 py-0.5 rounded">
                      Resume: {item.resume_score}
                    </span>
                    <span className="text-[10px] bg-accent-50 text-accent-700 font-bold px-1.5 py-0.5 rounded">
                      ATS: {item.ats_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-ink-400 px-3 py-2 text-center">No resumes analyzed yet</div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
