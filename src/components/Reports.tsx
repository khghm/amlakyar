import { useData } from '../store/DataContext';
import { formatPrice, formatNumber } from '../utils/helpers';

export default function Reports() {
  const { properties, contracts, clients, events, agents } = useData();

  const totalRevenue = contracts.filter(c => c.status === 'تایید شده').reduce((sum, c) => sum + c.commission, 0);
  const pendingRevenue = contracts.filter(c => c.status === 'در انتظار تایید' || c.status === 'پیش‌نویس').reduce((sum, c) => sum + c.commission, 0);
  const totalDeals = contracts.filter(c => c.status === 'تایید شده').length;
  const conversionRate = clients.length > 0 ? Math.round((totalDeals / clients.length) * 100) : 0;

  const monthlyData = [
    { month: 'فروردین', deals: 3, revenue: 45000000 },
    { month: 'اردیبهشت', deals: 5, revenue: 78000000 },
    { month: 'خرداد', deals: 4, revenue: 62000000 },
    { month: 'تیر', deals: 6, revenue: 95000000 },
    { month: 'مرداد', deals: 7, revenue: 110000000 },
    { month: 'شهریور', deals: 5, revenue: 85000000 },
    { month: 'مهر', deals: 8, revenue: 130000000 },
    { month: 'آبان', deals: 6, revenue: 98000000 },
    { month: 'آذر', deals: totalDeals, revenue: totalRevenue },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  const dealTypes = [
    { type: 'فروش', count: contracts.filter(c => c.type === 'فروش').length, color: 'blue' },
    { type: 'اجاره', count: contracts.filter(c => c.type === 'اجاره').length, color: 'green' },
    { type: 'رهن', count: contracts.filter(c => c.type === 'رهن').length, color: 'purple' },
    { type: 'مشارکت', count: contracts.filter(c => c.type === 'مشارکت').length, color: 'amber' },
  ];

  const clientSources = [
    { source: 'وب‌سایت', count: clients.filter(c => c.source === 'وب‌سایت').length, color: 'blue' },
    { source: 'معرفی', count: clients.filter(c => c.source === 'معرفی').length, color: 'green' },
    { source: 'تبلیغات', count: clients.filter(c => c.source === 'تبلیغات').length, color: 'amber' },
    { source: 'حضوری', count: clients.filter(c => c.source === 'حضوری').length, color: 'purple' },
    { source: 'تلفنی', count: clients.filter(c => c.source === 'تلفنی').length, color: 'red' },
  ];

  const totalClients = clients.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">گزارش‌ها و آمار</h2>
          <p className="text-sm text-gray-500 mt-1">تحلیل عملکرد آژانس و مشاورین</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input-field w-auto">
            <option>سال ۱۴۰۲</option>
            <option>سال ۱۴۰۱</option>
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <i className="fa-solid fa-download"></i>
            <span>خروجی PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card border-r-4 border-r-blue-500">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-money-bill-trend-up text-blue-600"></i>
            </div>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+۱۲٪</span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-gray-500">درآمد کل (ریال)</p>
        </div>
        <div className="stat-card border-r-4 border-r-green-500">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-handshake text-green-600"></i>
            </div>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+۸٪</span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2">{formatNumber(totalDeals)}</p>
          <p className="text-xs text-gray-500">معاملات موفق</p>
        </div>
        <div className="stat-card border-r-4 border-r-amber-500">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-clock text-amber-600"></i>
            </div>
            <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full">در انتظار</span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2">{formatPrice(pendingRevenue)}</p>
          <p className="text-xs text-gray-500">درآمد در انتظار (ریال)</p>
        </div>
        <div className="stat-card border-r-4 border-r-purple-500">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-percent text-purple-600"></i>
            </div>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+۵٪</span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-2">{formatNumber(conversionRate)}٪</p>
          <p className="text-xs text-gray-500">نرخ تبدیل</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-blue-600"></i>
            روند درآمد ماهانه
          </h3>
          <div className="space-y-3">
            {monthlyData.map((data, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">{data.month}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-l from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700 w-20 text-left">{formatPrice(data.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deals Chart */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-bar text-green-600"></i>
            تعداد معاملات ماهانه
          </h3>
          <div className="flex items-end justify-between h-48 gap-2 px-4">
            {monthlyData.map((data, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[10px] font-medium text-gray-600">{data.deals}</span>
                <div 
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 min-h-[4px]"
                  style={{ height: `${(data.deals / 10) * 100}%` }}
                ></div>
                <span className="text-[9px] text-gray-400 mt-1">{data.month.slice(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Types */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-purple-600"></i>
            توزیع نوع معاملات
          </h3>
          <div className="space-y-3">
            {dealTypes.map((dt) => (
              <div key={dt.type} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  dt.color === 'blue' ? 'bg-blue-500' :
                  dt.color === 'green' ? 'bg-green-500' :
                  dt.color === 'purple' ? 'bg-purple-500' :
                  'bg-amber-500'
                }`}></div>
                <span className="text-sm text-gray-700 flex-1">{dt.type}</span>
                <span className="text-sm font-bold text-gray-900">{dt.count}</span>
                <span className="text-xs text-gray-400">
                  ({totalDeals > 0 ? Math.round((dt.count / totalDeals) * 100) : 0}٪)
                </span>
              </div>
            ))}
          </div>
          {/* Pie Chart Visual */}
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-gray-100 relative">
              <div className="absolute inset-0 rounded-full" style={{
                background: `conic-gradient(
                  #3b82f6 0deg ${totalDeals > 0 ? (dealTypes[0].count / totalDeals) * 360 : 0}deg,
                  #22c55e ${totalDeals > 0 ? (dealTypes[0].count / totalDeals) * 360 : 0}deg ${totalDeals > 0 ? ((dealTypes[0].count + dealTypes[1].count) / totalDeals) * 360 : 0}deg,
                  #a855f7 ${totalDeals > 0 ? ((dealTypes[0].count + dealTypes[1].count) / totalDeals) * 360 : 0}deg ${totalDeals > 0 ? ((dealTypes[0].count + dealTypes[1].count + dealTypes[2].count) / totalDeals) * 360 : 0}deg,
                  #f59e0b ${totalDeals > 0 ? ((dealTypes[0].count + dealTypes[1].count + dealTypes[2].count) / totalDeals) * 360 : 0}deg 360deg
                )`
              }}></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{totalDeals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Sources */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-bullseye text-amber-600"></i>
            منبع جذب مشتریان
          </h3>
          <div className="space-y-3">
            {clientSources.map((cs) => (
              <div key={cs.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{cs.source}</span>
                  <span className="text-xs font-medium text-gray-600">{cs.count} ({totalClients > 0 ? Math.round((cs.count / totalClients) * 100) : 0}٪)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      cs.color === 'blue' ? 'bg-blue-500' :
                      cs.color === 'green' ? 'bg-green-500' :
                      cs.color === 'amber' ? 'bg-amber-500' :
                      cs.color === 'purple' ? 'bg-purple-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${totalClients > 0 ? (cs.count / totalClients) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-ranking-star text-red-600"></i>
            رتبه‌بندی مشاورین
          </h3>
          <div className="space-y-3">
            {agents.sort((a, b) => b.totalCommission - a.totalCommission).map((agent, i) => (
              <div key={agent.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-gray-200 text-gray-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.role} • {agent.deals} معامله</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-green-700">{formatPrice(agent.totalCommission)}</p>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>
                    <span className="text-[10px] text-gray-500">{agent.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Stats */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-building text-indigo-600"></i>
          آمار ملک‌ها
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-700">{properties.length}</p>
            <p className="text-xs text-blue-600 mt-1">کل ملک‌ها</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-700">{properties.filter(p => p.status === 'فعال').length}</p>
            <p className="text-xs text-green-600 mt-1">فعال</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <p className="text-2xl font-bold text-amber-700">{properties.filter(p => p.dealType === 'فروش').length}</p>
            <p className="text-xs text-amber-600 mt-1">فروشی</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-700">{properties.filter(p => p.dealType === 'اجاره').length}</p>
            <p className="text-xs text-purple-600 mt-1">اجاره‌ای</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-2xl font-bold text-red-700">{properties.filter(p => p.status === 'فروش رفته' || p.status === 'اجاره رفته').length}</p>
            <p className="text-xs text-red-600 mt-1">معامله شده</p>
          </div>
        </div>
      </div>
    </div>
  );
}
