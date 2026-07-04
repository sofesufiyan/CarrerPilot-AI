import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { CareerAI } from './pages/CareerAI';
import { Resume } from './pages/Resume';
import { Roadmap } from './pages/Roadmap';
import { Interview } from './pages/Interview';
import { SkillGap } from './pages/SkillGap';
import { Settings } from './pages/Settings';
import { NAV_ITEMS, type PageId } from './lib/nav';

function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = NAV_ITEMS.find((n) => n.id === page)!;

  const navigate = (p: PageId) => {
    setPage(p);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={navigate} />;
      case 'career': return <CareerAI />;
      case 'resume': return <Resume />;
      case 'roadmap': return <Roadmap />;
      case 'interview': return <Interview />;
      case 'skillgap': return <SkillGap />;
      case 'settings': return <Settings />;
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar
        current={page}
        onNavigate={navigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={current.label}
          subtitle={current.description}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 min-w-0">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
