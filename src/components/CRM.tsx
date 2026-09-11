import { useState } from 'react';

interface Client {
  id: number;
  name: string;
  phone: string;
  type: string;
  interest: string;
  budget: string;
  status: string;
  statusColor: string;
  lastContact: string;
  notes: string;
  avatar: string;
}

const clients: Client[] = [
  { id: 1, name: 'علی رضایی', phone: '۰۹۱۲۳۴۵۶۷۸۹', type: 'خریدار', interest: 'آپارتمان ۱۰۰-۱۵۰ متری', budget: '۵-۱۰ میلیارد', status: 'فعال', statusColor: 'green', lastContact: '۲ روز پیش', notes: 'منطقه سعادت‌آباد و ونک', avatar: 'ع' },
  { id: 2, name: 'مریم حسینی', phone: '۰۹۱۲۱۱۱۲۲۲۳', type: 'مستاجر', interest: 'آپارتمان ۸۰-۱۰۰ متری', budget: 'رهن ۳۰۰ + اجاره ۱۵M', status: 'فعال', statusColor: 'green', lastContact: '۱ روز پیش', notes: 'ترجیحاً طبقه بالا، پارکینگ', avatar: 'م' },
  { id: 3, name: 'رضا کریمی', phone: '۰۹۱۲۴۴۴۵۵۵۶', type: 'فروشنده', interest: 'مغازه ۴۰-۶۰ متری', budget: '۳-۴ میلیارد', status: 'در حال مذاکره', statusColor: 'amber', lastContact: '۳ روز پیش', notes: 'عجله‌ای برای فروش', avatar: 'ر' },
  { id: 4, name: 'زهرا محمدی', phone: '۰۹۱۲۷۷۷۸۸۸۹', type: 'خریدار', interest: 'ویلایی ۲۰۰+ متری', budget: '۱۵-۲۰ میلیارد', status: 'فعال', statusColor: 'green', lastContact: '۵ روز پیش', notes: 'لواسان یا فشم', avatar: 'ز' },
  { id: 5, name: 'امیر جعفری', phone: '۰۹۱۲۳۳۳۴۴۴۵', type: 'سرمایه‌گذار', interest: 'زمین تجاری', budget: '۱۰+ میلیارد', status: 'پیگیری', statusColor: 'blue', lastContact: '۱ هفته پیش', notes: 'منطقه ۲۲ تهران', avatar: 'ا' },
  { id: 6, name: 'سارا نوری', phone: '۰۹۱۲۶۶۶۷۷۷۸', type: 'مستاجر', interest: 'آپارتمان ۷۰-۹۰ متری', budget: 'رهن ۲۰۰ + اجاره ۱۰M', status: 'غیرفعال', statusColor: 'red', lastContact: '۲ هفته پیش', notes: 'منطقه تجریش و قیطریه', avatar: 'س' },
];

export default function CRM() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [view, setView] = useState<'list' | 'pipeline'>('list');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">مدیریت مشتریان (CRM)</h2>
          <p className="text-sm text-gray-500 mt-1">پیگیری و مدیریت ارتباطات با مشتریان</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button 
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
            >
              <i className="fa-solid fa-list ml-1"></i> لیست
            </button>
            <button 
              onClick={() => setView('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'pipeline' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
            >
              <i className="fa-solid fa-chart-bar ml-1"></i> پایپلاین
            </button>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <i className="fa-solid fa-plus"></i>
            <span>مشتری جدید</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-user-check text-green-600 text-sm"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">۱۸</span>
          </div>
          <p className="text-xs text-gray-500">مشتریان فعال</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-handshake text-amber-600 text-sm"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">۷</span>
          </div>
          <p className="text-xs text-gray-500">در حال مذاکره</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-phone text-blue-600 text-sm"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">۱۲</span>
          </div>
          <p className="text-xs text-gray-500">پیگیری امروز</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-star text-purple-600 text-sm"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">۴</span>
          </div>
          <p className="text-xs text-gray-500">مشتری VIP</p>
        </div>
      </div>

      {view === 'list' ? (
        /* Client List View */
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">مشتری</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">نوع</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">علاقه‌مندی</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">بودجه</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">وضعیت</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">آخرین تماس</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {client.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{client.name}</p>
                          <p className="text-xs text-gray-500">{client.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${
                        client.type === 'خریدار' ? 'bg-blue-50 text-blue-700' :
                        client.type === 'مستاجر' ? 'bg-green-50 text-green-700' :
                        client.type === 'فروشنده' ? 'bg-amber-50 text-amber-700' :
                        'bg-purple-50 text-purple-700'
                      }`}>
                        {client.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">{client.interest}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">{client.budget}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${
                        client.statusColor === 'green' ? 'bg-green-50 text-green-700' :
                        client.statusColor === 'amber' ? 'bg-amber-50 text-amber-700' :
                        client.statusColor === 'blue' ? 'bg-blue-50 text-blue-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">{client.lastContact}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors">
                          <i className="fa-solid fa-phone text-xs"></i>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors">
                          <i className="fa-solid fa-comment text-xs"></i>
                        </button>
                        <button 
                          onClick={() => setSelectedClient(client)}
                          className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-purple-50 text-gray-500 hover:text-purple-600 transition-colors"
                        >
                          <i className="fa-solid fa-eye text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'مشتریان جدید', color: 'blue', items: clients.filter(c => c.status === 'فعال') },
            { title: 'در حال مذاکره', color: 'amber', items: clients.filter(c => c.status === 'در حال مذاکره') },
            { title: 'پیگیری', color: 'purple', items: clients.filter(c => c.status === 'پیگیری') },
            { title: 'تکمیل شده', color: 'green', items: clients.filter(c => c.status === 'غیرفعال') },
          ].map((col, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-800">{col.title}</h4>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  col.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  col.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                  col.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                  'bg-green-100 text-green-700'
                }`}>{col.items.length}</span>
              </div>
              <div className="space-y-3">
                {col.items.map((client) => (
                  <div key={client.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {client.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{client.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{client.interest}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <span className={`badge text-[10px] ${
                        client.type === 'خریدار' ? 'bg-blue-50 text-blue-700' :
                        client.type === 'مستاجر' ? 'bg-green-50 text-green-700' :
                        client.type === 'فروشنده' ? 'bg-amber-50 text-amber-700' :
                        'bg-purple-50 text-purple-700'
                      }`}>{client.type}</span>
                      <span className="text-[10px] text-gray-400">{client.lastContact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">جزئیات مشتری</h3>
              <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedClient.avatar}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedClient.name}</h4>
                  <p className="text-sm text-gray-500">{selectedClient.phone}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">نوع مشتری</span>
                  <span className="text-sm font-medium text-gray-800">{selectedClient.type}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">علاقه‌مندی</span>
                  <span className="text-sm font-medium text-gray-800">{selectedClient.interest}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">بودجه</span>
                  <span className="text-sm font-medium text-gray-800">{selectedClient.budget}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">آخرین تماس</span>
                  <span className="text-sm font-medium text-gray-800">{selectedClient.lastContact}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 block mb-1">یادداشت‌ها</span>
                  <span className="text-sm text-gray-800">{selectedClient.notes}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button onClick={() => setSelectedClient(null)} className="btn-secondary">بستن</button>
              <button className="btn-primary">
                <i className="fa-solid fa-phone ml-1"></i>
                تماس
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
