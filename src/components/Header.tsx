interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden text-gray-600 hover:text-gray-800"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>
        <div className="hidden md:block">
          <h2 className="text-lg font-bold text-gray-900">خوش آمدید، محمد 👋</h2>
          <p className="text-sm text-gray-500">املاک احمدی - تهران، منطقه ۵</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 gap-2 border border-gray-100">
          <i className="fa-solid fa-search text-gray-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="جستجو..." 
            className="bg-transparent text-sm outline-none w-40 placeholder-gray-400"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100">
          <i className="fa-solid fa-bell text-gray-600"></i>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">۳</span>
        </button>
        
        {/* Settings */}
        <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-100">
          <i className="fa-solid fa-gear text-gray-600"></i>
        </button>
      </div>
    </header>
  );
}
