import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Contracts from './components/Contracts';
import CRM from './components/CRM';
import Commissions from './components/Commissions';
import Header from './components/Header';

export type ActivePage = 'dashboard' | 'contracts' | 'crm' | 'commissions';

function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'contracts':
        return <Contracts />;
      case 'crm':
        return <CRM />;
      case 'commissions':
        return <Commissions />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 right-0 z-50 transform transition-transform duration-300 lg:transform-none ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar 
          activePage={activePage} 
          onNavigate={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
