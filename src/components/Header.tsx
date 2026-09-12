import { useState, useRef, useEffect } from 'react';
import { useData } from '../store/DataContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, properties, clients, contracts } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Search results
  const searchResults = searchQuery.length > 1 ? [
    ...properties.filter(p => p.title.includes(searchQuery) || p.address.includes(searchQuery)).map(p => ({ type: 'ملک', title: p.title, sub: p.address, icon: 'fa-building', color: 'blue' })),
    ...clients.filter(c => c.name.includes(searchQuery) || c.phone.includes(searchQuery)).map(c => ({ type: 'مشتری', title: c.name, sub: c.phone, icon: 'fa-user', color: 'green' })),
    ...contracts.filter(c => c.id.includes(searchQuery) || c.clientName.includes(searchQuery)).map(c => ({ type: 'قرارداد', title: c.id, sub: c.clientName, icon: 'fa-file-contract', color: 'amber' })),
  ].slice(0, 8) : [];

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="lg:hidden text-gray-600 hover:text-gray-800">
          <i className="fa-solid fa-bars text-lg"></i>
        </button>
        <div className="hidden md:block">
          <h2 className="text-lg font-bold text-gray-900">خوش آمدید، محمد 👋</h2>
          <p className="text-sm text-gray-500">املاک احمدی - تهران، منطقه ۵</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 gap-2 border border-gray-100 focus-within:border-blue-300 focus-within:bg-white transition-all">
            <i className="fa-solid fa-search text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="جستجوی ملک، مشتری، قرارداد..."
              className="bg-transparent text-sm outline-none w-48 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setShowSearch(false); }} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            )}
          </div>
          {/* Search Results Dropdown */}
          {showSearch && searchQuery.length > 1 && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-100 shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-400">نتیجه‌ای یافت نشد</div>
              ) : (
                <div className="p-2">
                  <p className="text-xs text-gray-400 px-3 py-2">{searchResults.length} نتیجه</p>
                  {searchResults.map((result, i) => (
                    <button key={i} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-right">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        result.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                        result.color === 'green' ? 'bg-green-50 text-green-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        <i className={`fa-solid ${result.icon} text-xs`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{result.title}</p>
                        <p className="text-xs text-gray-500 truncate">{result.sub}</p>
                      </div>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{result.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Search Button */}
        <button className="md:hidden w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
          <i className="fa-solid fa-search text-gray-600"></i>
        </button>
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100"
          >
            <i className="fa-solid fa-bell text-gray-600"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-100 shadow-lg z-50 max-h-96 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm">اعلان‌ها</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    خواندن همه
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-400">اعلانی وجود ندارد</div>
                ) : (
                  notifications.slice(0, 10).map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                      onClick={() => markNotificationRead(notif.id)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'success' ? 'bg-green-50 text-green-600' :
                        notif.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                        notif.type === 'error' ? 'bg-red-50 text-red-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <i className={`fa-solid ${
                          notif.type === 'success' ? 'fa-circle-check' :
                          notif.type === 'warning' ? 'fa-triangle-exclamation' :
                          notif.type === 'error' ? 'fa-circle-xmark' :
                          'fa-circle-info'
                        } text-xs`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.text}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{notif.date}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                        className="text-gray-300 hover:text-red-500 flex-shrink-0"
                      >
                        <i className="fa-solid fa-xmark text-xs"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Settings */}
        <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100">
          <i className="fa-solid fa-gear text-gray-600"></i>
        </button>
      </div>
    </header>
  );
}
