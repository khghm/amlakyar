import { ActivePage } from '../App';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

const menuItems = [
  { id: 'dashboard' as ActivePage, label: 'داشبورد', icon: 'fa-chart-line', section: 'main' },
  { id: 'properties' as ActivePage, label: 'املاک', icon: 'fa-building', section: 'main' },
  { id: 'agreement' as ActivePage, label: 'قولنامه', icon: 'fa-file-signature', section: 'main' },
  { id: 'contracts' as ActivePage, label: 'قراردادها', icon: 'fa-file-contract', section: 'main' },
  { id: 'crm' as ActivePage, label: 'مشتریان (CRM)', icon: 'fa-users', section: 'main' },
  { id: 'commissions' as ActivePage, label: 'کمیسیون‌ها', icon: 'fa-calculator', section: 'main' },
  { id: 'calendar' as ActivePage, label: 'تقویم', icon: 'fa-calendar-days', section: 'tools' },
  { id: 'reports' as ActivePage, label: 'گزارش‌ها', icon: 'fa-chart-pie', section: 'tools' },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const mainItems = menuItems.filter(i => i.section === 'main');
  const toolItems = menuItems.filter(i => i.section === 'tools');

  return (
    <div className="w-72 h-full bg-white border-l border-gray-100 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <i className="fa-solid fa-building text-white text-sm"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">املاک‌یار</h1>
            <p className="text-xs text-gray-400">سامانه مدیریت آژانس</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-medium text-gray-400 px-4 mb-3">منوی اصلی</p>
        {mainItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-item w-full ${
              activePage === item.id ? 'sidebar-item-active' : 'sidebar-item-inactive'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            <span>{item.label}</span>
          </button>
        ))}

        <p className="text-xs font-medium text-gray-400 px-4 mb-3 mt-6">ابزارها</p>
        {toolItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-item w-full ${
              activePage === item.id ? 'sidebar-item-active' : 'sidebar-item-inactive'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-shield-halved text-blue-600 text-sm"></i>
            <span className="text-xs font-medium text-blue-800">اتصال به سامانه دولتی</span>
          </div>
          <p className="text-xs text-blue-600 mb-3">وضعیت: متصل و فعال</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">آخرین sync: ۲ دقیقه پیش</span>
          </div>
        </div>
        
        {/* User */}
        <div className="flex items-center gap-3 mt-4 px-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            م
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">محمد احمدی</p>
            <p className="text-xs text-gray-400">مدیر آژانس</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
