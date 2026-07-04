import { useState } from 'react';
import { User, Bell, Shield, Palette, CreditCard, Check } from 'lucide-react';

type Tab = 'profile' | 'notifications' | 'security' | 'appearance' | 'billing';

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export function Settings() {
  const [tab, setTab] = useState<Tab>('profile');
  const [notifications, setNotifications] = useState({ daily: true, weekly: true, ai: false, product: true });
  const [theme, setTheme] = useState('light');

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
      <div className="mb-6 animate-fade-in">
        <h2 className="font-display font-bold text-ink-900 text-xl">Settings</h2>
        <p className="text-sm text-ink-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tabs */}
        <div className="sm:w-48 shrink-0">
          <div className="flex sm:flex-col gap-1 overflow-x-auto scrollbar-thin pb-2 sm:pb-0">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`nav-item whitespace-nowrap ${active ? 'nav-item-active' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-primary-600' : 'text-ink-400'}`} />
                  <span className="text-sm">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === 'profile' && (
            <div className="card p-6 animate-fade-in">
              <h3 className="font-display font-semibold text-ink-900 text-[15px] mb-4">Profile Information</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-400 to-primary-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                  M
                </div>
                <div>
                  <button className="btn-secondary text-sm">Change Avatar</button>
                  <p className="text-[11px] text-ink-400 mt-1.5">JPG or PNG. Max 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-ink-600 mb-1.5 block">Full Name</label>
                  <input className="input" defaultValue="Mohammed Ali" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-600 mb-1.5 block">Email</label>
                  <input className="input" defaultValue="mohammed@example.com" type="email" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-600 mb-1.5 block">Current Role</label>
                  <input className="input" defaultValue="Frontend Developer" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-600 mb-1.5 block">Target Role</label>
                  <input className="input" defaultValue="Senior Frontend Engineer" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card p-6 animate-fade-in">
              <h3 className="font-display font-semibold text-ink-900 text-[15px] mb-4">Notification Preferences</h3>
              <div className="space-y-1">
                {[
                  { key: 'daily', label: 'Daily goal reminders', desc: 'Get reminded about your daily career tasks' },
                  { key: 'weekly', label: 'Weekly progress report', desc: 'A summary of your week every Sunday' },
                  { key: 'ai', label: 'AI insights', desc: 'Career recommendations and new job matches' },
                  { key: 'product', label: 'Product updates', desc: 'New features and improvements' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-ink-100 last:border-0">
                    <div>
                      <p className="font-medium text-ink-800 text-sm">{n.label}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                        notifications[n.key as keyof typeof notifications] ? 'bg-primary-500' : 'bg-ink-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          notifications[n.key as keyof typeof notifications] ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="card p-6 animate-fade-in">
              <h3 className="font-display font-semibold text-ink-900 text-[15px] mb-4">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-ink-600 mb-1.5 block">Current Password</label>
                  <input className="input" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-600 mb-1.5 block">New Password</label>
                  <input className="input" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-600 mb-1.5 block">Confirm New Password</label>
                  <input className="input" type="password" placeholder="••••••••" />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-ink-100 mt-2">
                  <div>
                    <p className="font-medium text-ink-800 text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-ink-500 mt-0.5">Add an extra layer of security</p>
                  </div>
                  <button className="btn-secondary text-sm">Enable</button>
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'appearance' && (
            <div className="card p-6 animate-fade-in">
              <h3 className="font-display font-semibold text-ink-900 text-[15px] mb-4">Appearance</h3>
              <p className="text-sm text-ink-500 mb-4">Choose how CareerPilot looks to you.</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'light', label: 'Light', bg: 'bg-white', border: 'border-ink-200' },
                  { id: 'dark', label: 'Dark', bg: 'bg-ink-900', border: 'border-ink-700' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all ${
                      theme === t.id ? 'border-primary-400 ring-4 ring-primary-100' : 'border-ink-200 hover:border-ink-300'
                    }`}
                  >
                    <div className={`h-20 rounded-xl ${t.bg} ${t.border} border flex items-center justify-center`}>
                      <span className={`text-sm font-medium ${t.id === 'dark' ? 'text-white' : 'text-ink-700'}`}>
                        {t.label}
                      </span>
                    </div>
                    {theme === t.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-400 mt-4">Dark mode coming soon.</p>
            </div>
          )}

          {tab === 'billing' && (
            <div className="space-y-4 animate-fade-in">
              <div className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="badge bg-ink-100 text-ink-600">Current Plan</span>
                    <h3 className="font-display font-bold text-ink-900 text-xl mt-2">Free</h3>
                    <p className="text-sm text-ink-500 mt-1">3 AI sessions per day · Basic resume analysis</p>
                  </div>
                  <button className="btn-primary">Upgrade to Pro</button>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="font-display font-semibold text-ink-900 text-[15px] mb-4">Compare Plans</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Free', price: '$0', features: ['3 AI sessions/day', '1 resume analysis', 'Basic roadmap'], current: true },
                    { name: 'Pro', price: '$19/mo', features: ['Unlimited AI sessions', 'Unlimited resume analysis', 'Mock interviews', 'Priority support'], current: false },
                    { name: 'Team', price: '$49/mo', features: ['Everything in Pro', '5 team members', 'Shared roadmaps', 'Analytics'], current: false },
                  ].map((plan) => (
                    <div
                      key={plan.name}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        plan.current ? 'border-ink-200 bg-ink-50' : 'border-primary-200 bg-primary-50/30'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-semibold text-ink-900">{plan.name}</p>
                          {plan.current && <span className="badge bg-ink-200 text-ink-600 text-[10px]">Current</span>}
                        </div>
                        <p className="font-display font-bold text-ink-900 text-lg mt-0.5">{plan.price}</p>
                      </div>
                      <div className="hidden sm:flex flex-wrap gap-1.5 justify-end max-w-[50%]">
                        {plan.features.map((f) => (
                          <span key={f} className="badge bg-white text-ink-600 text-[10px] border border-ink-200">{f}</span>
                        ))}
                      </div>
                      {!plan.current && <button className="btn-primary ml-4 shrink-0">Choose</button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
