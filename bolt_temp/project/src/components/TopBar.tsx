import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle: string;
  onOpenMobile: () => void;
}

export function TopBar({ title, subtitle, onOpenMobile }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-xl border-b border-ink-200/70">
      <button
        onClick={onOpenMobile}
        className="lg:hidden btn-ghost p-2 -ml-2"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden sm:block min-w-0">
        <h1 className="font-display font-bold text-ink-900 text-lg leading-tight truncate">{title}</h1>
        <p className="text-xs text-ink-500 truncate">{subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-ink-50 border border-ink-200 text-ink-400 w-64">
          <Search className="w-4 h-4" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-ink-700 placeholder:text-ink-400 w-full"
          />
          <kbd className="text-[10px] font-medium text-ink-400 bg-white border border-ink-200 rounded px-1.5 py-0.5">⌘K</kbd>
        </div>

        <button className="relative btn-ghost p-2.5" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-white" />
        </button>

        <button className="flex items-center gap-2.5 pl-1 pr-2 sm:pr-3 py-1 rounded-xl hover:bg-ink-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-primary-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            M
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-ink-900">Mohammed</span>
            <span className="text-[11px] text-ink-500">Free plan</span>
          </div>
          <ChevronDown className="hidden sm:block w-4 h-4 text-ink-400" />
        </button>
      </div>
    </header>
  );
}
