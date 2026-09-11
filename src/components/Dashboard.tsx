import { ActivePage } from '../App';

interface DashboardProps {
  onNavigate: (page: ActivePage) => void;
}

const stats = [
  { label: 'قرارداد فعال', value: '۲۴', change: '+۳', icon: 'fa-file-contract', color: 'blue', trend: 'up' },
  { label: 'مشتریان جدید', value: '۱۸', change: '+۷', icon: 'fa-user-plus', color: 'green', trend: 'up' },
  { label: 'کمیسیون ماهانه', value: '۱۴۵M', change: '+۱۲%', icon: 'fa-coins', color: 'amber', trend: 'up' },
  { label: 'ملک‌های ثبت‌شده', value: '۶۷', change: '+۵', icon: 'fa-building', color: 'purple', trend: 'up' },
];

const recentContracts = [
  { id: 'C-1402-089', type: 'فروش', property: 'آپارتمان ۱۲۰ متری - سعادت‌آباد', client: 'علی رضایی', status: 'در انتظار تایید', statusColor: 'amber', date: '۱۴۰۲/۰۹/۱۵' },
  { id: 'C-1402-088', type: 'اجاره', property: 'ویلا ۲۵۰ متری - لواسان', client: 'مریم حسینی', status: 'تایید شده', statusColor: 'green', date: '۱۴۰۲/۰۹/۱۴' },
  { id: 'C-1402-087', type: 'فروش', property: 'مغازه ۴۵ متری - ونک', client: 'رضا کریمی', status: 'تایید شده', statusColor: 'green', date: '۱۴۰۲/۰۹/۱۳' },
  { id: 'C-1402-086', type: 'رهن', property: 'آپارتمان ۸۵ متری - پونک', client: 'زهرا محمدی', status: 'در حال بررسی', statusColor: 'blue', date: '۱۴۰۲/۰۹/۱۲' },
];

const recentActivities = [
  { text: 'قرارداد C-1402-089 ثبت شد', time: '۱۰ دقیقه پیش', icon: 'fa-file-circle-plus', color: 'blue' },
  { text: 'مشتری جدید: سارا نوری اضافه شد', time: '۳۰ دقیقه پیش', icon: 'fa-user-plus', color: 'green' },
  { text: 'کمیسیون قرارداد C-1402-088 محاسبه شد', time: '۱ ساعت پیش', icon: 'fa-calculator', color: 'amber' },
  { text: 'سند ملک #۴۵۶ از سامانه ثبت دریافت شد', time: '۲ ساعت پیش', icon: 'fa-file-import', color: 'purple' },
  { text: 'پیگیری مشتری: علی رضایی', time: '۳ ساعت پیش', icon: 'fa-phone', color: 'red' },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                'bg-purple-50 text-purple-600'
              }`}>
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
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
            <button 
              onClick={() => onNavigate('contracts')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              مشاهده همه
            </button>
          </div>
          <div className="space-y-3">
            {recentContracts.map((contract, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    contract.type === 'فروش' ? 'bg-blue-50 text-blue-600' :
                    contract.type === 'اجاره' ? 'bg-green-50 text-green-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    <i className="fa-solid fa-house text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{contract.property}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{contract.client} • {contract.date}</p>
                  </div>
                </div>
                <span className={`badge ${
                  contract.statusColor === 'green' ? 'bg-green-50 text-green-700' :
                  contract.statusColor === 'amber' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {contract.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-5">فعالیت‌های اخیر</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  activity.color === 'green' ? 'bg-green-50 text-green-600' :
                  activity.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  activity.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  <i className={`fa-solid ${activity.icon} text-xs`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">دسترسی سریع</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => onNavigate('contracts')}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-plus text-blue-600"></i>
            </div>
            <span className="text-sm font-medium text-gray-700">قرارداد جدید</span>
          </button>
          <button 
            onClick={() => onNavigate('crm')}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-user-plus text-green-600"></i>
            </div>
            <span className="text-sm font-medium text-gray-700">مشتری جدید</span>
          </button>
          <button 
            onClick={() => onNavigate('commissions')}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-calculator text-amber-600"></i>
            </div>
            <span className="text-sm font-medium text-gray-700">محاسبه کمیسیون</span>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-file-export text-purple-600"></i>
            </div>
            <span className="text-sm font-medium text-gray-700">گزارش‌گیری</span>
          </button>
        </div>
      </div>
    </div>
  );
}
