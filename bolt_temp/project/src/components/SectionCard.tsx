import type { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, icon: Icon, action, children, className = '' }: SectionCardProps) {
  return (
    <section className={`card card-hover p-5 sm:p-6 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50">
            <Icon className="w-4 h-4 text-primary-600" strokeWidth={2.2} />
          </div>
          <h3 className="font-display font-semibold text-ink-900 text-[15px]">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
