import { Rocket } from 'lucide-react';
import { NAV_ITEMS, type PageId } from '../lib/nav';

interface SidebarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm lg:hidden animate-fade-in-fast"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 flex flex-col bg-white border-r border-ink-200/70 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-ink-200/70">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-glow">
            <Rocket className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-ink-900 text-[15px]">CareerPilot</span>
            <span className="text-[11px] font-medium text-primary-600 tracking-wide">AI COPILOT</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-item w-full text-left ${active ? 'nav-item-active' : ''}`}
              >
                <Icon className={`w-[18px] h-[18px] ${active ? 'text-primary-600' : 'text-ink-400'}`} strokeWidth={2} />
                <span className="text-sm">{item.label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
              </button>
            );
          })}
        </nav>

        {/* Upgrade card */}
        <div className="p-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-4 text-white">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5" />
            <div className="relative">
              <p className="font-display font-semibold text-sm">Upgrade to Pro</p>
              <p className="text-[12px] text-primary-100 mt-1 leading-relaxed">
                Unlock unlimited AI sessions & mock interviews.
              </p>
              <button className="mt-3 w-full bg-white text-primary-700 text-xs font-semibold py-2 rounded-lg hover:bg-primary-50 transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
