import React from 'react';
import { Rocket, LogOut } from 'lucide-react';

const TopNav = ({ userEmail, onLogout }) => {
  return (
    <header className="h-16 border-b border-ink-200/70 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <Rocket className="w-5 h-5" />
        </div>
        <span className="font-display font-bold text-ink-900 text-lg tracking-tight">
          CareerPilot <span className="text-primary-600">AI</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        {userEmail && (
          <>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-ink-50 border border-ink-200/30">
              <div className="w-6.5 h-6.5 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center border border-primary-200 uppercase" title={userEmail}>
                {userEmail.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-ink-600 max-w-[120px] truncate hidden sm:inline">{userEmail}</span>
            </div>
            <button 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-800 transition-colors py-2 px-3 rounded-lg hover:bg-ink-100 cursor-pointer"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default TopNav;
