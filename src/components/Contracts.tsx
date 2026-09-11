import { useState } from 'react';

interface Contract {
  id: string;
  type: string;
  property: string;
  client: string;
  owner: string;
  amount: string;
  status: string;
  statusColor: string;
  date: string;
  trackingCode?: string;
}

const contracts: Contract[] = [
  { id: 'C-1402-089', type: 'فروش', property: 'آپارتمان ۱۲۰ متری - سعادت‌آباد', client: 'علی رضایی', owner: 'حسن موسوی', amount: '۸,۵۰۰,۰۰۰,۰۰۰', status: 'در انتظار تایید', statusColor: 'amber', date: '۱۴۰۲/۰۹/۱۵', trackingCode: 'GOV-887432' },
  { id: 'C-1402-088', type: 'اجاره', property: 'ویلا ۲۵۰ متری - لواسان', client: 'مریم حسینی', owner: 'اکبر صادقی', amount: '۴۵,۰۰۰,۰۰۰', status: 'تایید شده', statusColor: 'green', date: '۱۴۰۲/۰۹/۱۴', trackingCode: 'GOV-887102' },
  { id: 'C-1402-087', type: 'فروش', property: 'مغازه ۴۵ متری - ونک', client: 'رضا کریمی', owner: 'فاطمه نوری', amount: '۳,۲۰۰,۰۰۰,۰۰۰', status: 'تایید شده', statusColor: 'green', date: '۱۴۰۲/۰۹/۱۳', trackingCode: 'GOV-886955' },
  { id: 'C-1402-086', type: 'رهن', property: 'آپارتمان ۸۵ متری - پونک', client: 'زهرا محمدی', owner: 'مجید عباسی', amount: '۵۰۰,۰۰۰,۰۰۰', status: 'در حال بررسی', statusColor: 'blue', date: '۱۴۰۲/۰۹/۱۲' },
  { id: 'C-1402-085', type: 'فروش', property: 'زمین ۳۰۰ متری - شهریار', client: 'امیر جعفری', owner: 'نرگس کاظمی', amount: '۱,۸۰۰,۰۰۰,۰۰۰', status: 'رد شده', statusColor: 'red', date: '۱۴۰۲/۰۹/۱۰' },
  { id: 'C-1402-084', type: 'اجاره', property: 'آپارتمان ۹۵ متری - تجریش', client: 'سارا نوری', owner: 'بهروز شریفی', amount: '۲۵,۰۰۰,۰۰۰', status: 'تایید شده', statusColor: 'green', date: '۱۴۰۲/۰۹/۰۸', trackingCode: 'GOV-886420' },
];

export default function Contracts() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredContracts = filter === 'all' ? contracts : contracts.filter(c => {
    if (filter === 'pending') return c.statusColor === 'amber' || c.statusColor === 'blue';
    if (filter === 'approved') return c.statusColor === 'green';
    if (filter === 'rejected') return c.statusColor === 'red';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">مدیریت قراردادها</h2>
          <p className="text-sm text-gray-500 mt-1">ثبت، پیگیری و ارسال خودکار به سامانه دولتی</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          <span>قرارداد جدید</span>
        </button>
      </div>

      {/* Government System Integration Banner */}
      <div className="bg-gradient-to-l from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-link text-blue-600"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">اتصال به سامانه ثبت اسناد و املاک</p>
            <p className="text-xs text-blue-600 mt-0.5">آخرین همگام‌سازی: ۲ دقیقه پیش • ۱۲ قرارداد ارسال شده</p>
          </div>
        </div>
        <button className="btn-secondary text-xs hidden sm:block">
          <i className="fa-solid fa-sync-alt ml-1"></i>
          همگام‌سازی
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'all', label: 'همه', count: '۲۴' },
          { id: 'pending', label: 'در انتظار', count: '۸' },
          { id: 'approved', label: 'تایید شده', count: '۱۴' },
          { id: 'rejected', label: 'رد شده', count: '۲' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Contracts Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">شماره قرارداد</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">نوع</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">ملک</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">مشتری</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">مبلغ (ریال)</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">کد رهگیری</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">وضعیت</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-800">{contract.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${
                      contract.type === 'فروش' ? 'bg-blue-50 text-blue-700' :
                      contract.type === 'اجاره' ? 'bg-green-50 text-green-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {contract.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">{contract.property}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">{contract.client}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-800">{contract.amount}</span>
                  </td>
                  <td className="px-5 py-4">
                    {contract.trackingCode ? (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-mono">{contract.trackingCode}</span>
                    ) : (
                      <span className="text-xs text-gray-400">در انتظار</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${
                      contract.statusColor === 'green' ? 'bg-green-50 text-green-700' :
                      contract.statusColor === 'amber' ? 'bg-amber-50 text-amber-700' :
                      contract.statusColor === 'blue' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors">
                        <i className="fa-solid fa-eye text-xs"></i>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors">
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Contract Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">ثبت قرارداد جدید</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">نوع قرارداد</label>
                  <select className="input-field">
                    <option>فروش</option>
                    <option>اجاره</option>
                    <option>رهن</option>
                    <option>مشارکت</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">شماره قرارداد</label>
                  <input type="text" className="input-field" placeholder="C-1402-090" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">مشخصات ملک</label>
                <input type="text" className="input-field" placeholder="آپارتمان ۱۲۰ متری - سعادت‌آباد" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">نام مشتری</label>
                  <input type="text" className="input-field" placeholder="نام و نام خانوادگی" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">کد ملی مشتری</label>
                  <input type="text" className="input-field" placeholder="۰۰۱۲۳۴۵۶۷۸" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">نام مالک</label>
                  <input type="text" className="input-field" placeholder="نام و نام خانوادگی مالک" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">مبلغ قرارداد (ریال)</label>
                  <input type="text" className="input-field" placeholder="۰۰۰,۰۰۰,۰۰۰,۰۰۰" />
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-amber-600 mt-0.5"></i>
                <div>
                  <p className="text-sm font-medium text-amber-800">ارسال خودکار به سامانه دولتی</p>
                  <p className="text-xs text-amber-600 mt-1">پس از ثبت، قرارداد به صورت خودکار به سامانه ثبت اسناد و املاک ارسال خواهد شد.</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary">انصراف</button>
              <button onClick={() => setShowModal(false)} className="btn-primary">ثبت قرارداد</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
