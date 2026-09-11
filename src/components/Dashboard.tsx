import { ActivePage } from '../App';
import { useData } from '../store/DataContext';
import { formatPrice, getStatusBg, getStatusColor } from '../utils/helpers';

interface DashboardProps {
  onNavigate: (page: ActivePage) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { properties, contracts, clients, events, notifications } = useData();

  const activeContracts = contracts.filter(c => c.status === 'تایید شده' || c.status === 'در انتظار تایید');
  const totalCommission = contracts.filter(c => c.status === 'تایید شده').reduce((sum, c) => sum + c.commission, 0);
  const activeClients = clients.filter(c => c.status === 'فعال' || c.status === 'در حال مذاکره');
  const upcomingEvents = events.filter(e => e.status === 'برنامه‌ریزی شده');
  const unreadNotifs = notifications.filter(n => !n.read);

  const stats = [
    { label: 'قرارداد فعال', value: activeContracts.length.toString(), icon: 'fa-file-contract', color: 'blue', page: 'contracts' as ActivePage },
    { label: 'مشتریان فعال', value: activeClients.length.toString(), icon: 'fa-user-plus', color: 'green', page: 'crm' as ActivePage },
    { label: 'کمیسیون ماهانه', value: formatPrice(totalCommission), icon: 'fa-coins', color: 'amber', page: 'commissions' as ActivePage },
    { label: 'ملک‌های ثبت‌شده', value: properties.length.toString(), icon: 'fa-building', color: 'purple', page: 'properties' as ActivePage },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} onClick={() => onNavigate(stat.page)} className="stat-card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                'bg-purple-50 text-purple-600'
              }`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contracts */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">قراردادهای اخیر</h3>
            <button onClick={() => onNavigate('contracts')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {contracts.slice(0, 5).map((contract) => (
              <div key={contract.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    contract.type === 'فروش' ? 'bg-blue-50 text-blue-600' :
                    contract.type === 'اجاره' ? 'bg-green-50 text-green-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    <i className="fa-solid fa-house text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{contract.propertyTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{contract.clientName} • {contract.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-700">{formatPrice(contract.commission)}</span>
                  <span className={`badge ${getStatusBg(getStatusColor(contract.status))}`}>{contract.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">رویدادهای پیش رو</h3>
            <button onClick={() => onNavigate('calendar')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">تقویم</button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  event.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  event.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  event.color === 'green' ? 'bg-green-50 text-green-600' :
                  event.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  <i className={`fa-solid ${
                    event.type === 'بازدید' ? 'fa-eye' :
                    event.type === 'جلسه' ? 'fa-handshake' :
                    event.type === 'پیگیری' ? 'fa-phone' :
                    event.type === 'امضا' ? 'fa-pen' :
                    'fa-key'
                  } text-xs`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{event.date} - {event.time}</p>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">رویدادی برنامه‌ریزی نشده</p>
            )}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">آخرین اعلان‌ها</h3>
            {unreadNotifs.length > 0 && (
              <span className="badge bg-red-50 text-red-700">{unreadNotifs.length} جدید</span>
            )}
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notif) => (
              <div key={notif.id} className={`flex items-start gap-3 p-2 rounded-lg ${!notif.read ? 'bg-blue-50/30' : ''}`}>
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
                  <p className="text-sm text-gray-700">{notif.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{notif.date}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">دسترسی سریع</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onNavigate('contracts')} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-plus text-blue-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-700">قرارداد جدید</span>
            </button>
            <button onClick={() => onNavigate('crm')} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-user-plus text-green-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-700">مشتری جدید</span>
            </button>
            <button onClick={() => onNavigate('properties')} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-building text-purple-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-700">ثبت ملک</span>
            </button>
            <button onClick={() => onNavigate('commissions')} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-calculator text-amber-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-700">محاسبه کمیسیون</span>
            </button>
            <button onClick={() => onNavigate('calendar')} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/50 transition-all">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-calendar-plus text-red-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-700">رویداد جدید</span>
            </button>
            <button onClick={() => onNavigate('reports')} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-chart-pie text-indigo-600"></i>
              </div>
              <span className="text-sm font-medium text-gray-700">گزارش‌ها</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
