import { useState } from 'react';
import { useData, Client } from '../store/DataContext';
import { getStatusBg, getStatusColor } from '../utils/helpers';

export default function CRM() {
  const { clients, addClient, updateClient, deleteClient, addClientActivity } = useData();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [view, setView] = useState<'list' | 'pipeline'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredClients = clients.filter(c => {
    const matchSearch = !searchTerm || c.name.includes(searchTerm) || c.phone.includes(searchTerm);
    const matchType = filterType === 'all' || c.type === filterType || c.status === filterType;
    return matchSearch && matchType;
  });

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این مشتری مطمئن هستید؟')) {
      deleteClient(id);
    }
  };

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
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}>
              <i className="fa-solid fa-list ml-1"></i> لیست
            </button>
            <button onClick={() => setView('pipeline')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'pipeline' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}>
              <i className="fa-solid fa-chart-bar ml-1"></i> پایپلاین
            </button>
          </div>
          <button onClick={() => { setEditingClient(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
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
            <span className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'فعال').length}</span>
          </div>
          <p className="text-xs text-gray-500">مشتریان فعال</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-handshake text-amber-600 text-sm"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'در حال مذاکره').length}</span>
          </div>
          <p className="text-xs text-gray-500">در حال مذاکره</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-phone text-blue-600 text-sm"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'پیگیری').length}</span>
          </div>
          <p className="text-xs text-gray-500">نیاز به پیگیری</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-star text-purple-600 text-sm"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">{clients.filter(c => c.tags.includes('VIP')).length}</span>
          </div>
          <p className="text-xs text-gray-500">مشتری VIP</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 border border-gray-200">
          <i className="fa-solid fa-search text-gray-400 text-sm"></i>
          <input type="text" placeholder="جستجوی مشتری..." className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">همه</option>
          <option value="خریدار">خریدار</option>
          <option value="فروشنده">فروشنده</option>
          <option value="مستاجر">مستاجر</option>
          <option value="موجر">موجر</option>
          <option value="سرمایه‌گذار">سرمایه‌گذار</option>
          <option value="فعال">فعال</option>
          <option value="در حال مذاکره">در حال مذاکره</option>
          <option value="پیگیری">پیگیری</option>
        </select>
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
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">منبع</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">مشتری‌ای یافت نشد</td></tr>
                ) : filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {client.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{client.name}</p>
                          <p className="text-xs text-gray-500">{client.phone}</p>
                        </div>
                        {client.tags.includes('VIP') && <span className="badge bg-amber-50 text-amber-700 text-[10px]">VIP</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${
                        client.type === 'خریدار' ? 'bg-blue-50 text-blue-700' :
                        client.type === 'مستاجر' ? 'bg-green-50 text-green-700' :
                        client.type === 'فروشنده' ? 'bg-amber-50 text-amber-700' :
                        client.type === 'سرمایه‌گذار' ? 'bg-purple-50 text-purple-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>{client.type}</span>
                    </td>
                    <td className="px-5 py-4"><span className="text-sm text-gray-700">{client.interest}</span></td>
                    <td className="px-5 py-4"><span className="text-sm text-gray-700">{client.budget}</span></td>
                    <td className="px-5 py-4">
                      <span className={`badge ${getStatusBg(getStatusColor(client.status))}`}>{client.status}</span>
                    </td>
                    <td className="px-5 py-4"><span className="text-xs text-gray-500">{client.source}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedClient(client); }} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-gray-500 hover:text-blue-600" title="مشاهده">
                          <i className="fa-solid fa-eye text-xs"></i>
                        </button>
                        <button onClick={() => { setSelectedClient(client); setShowActivityModal(true); }} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-green-50 text-gray-500 hover:text-green-600" title="ثبت فعالیت">
                          <i className="fa-solid fa-plus text-xs"></i>
                        </button>
                        <button onClick={() => { setEditingClient(client); setShowModal(true); }} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-amber-50 text-gray-500 hover:text-amber-600" title="ویرایش">
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-red-50 text-gray-500 hover:text-red-600" title="حذف">
                          <i className="fa-solid fa-trash text-xs"></i>
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
            { title: 'مشتریان جدید', statuses: ['فعال'], color: 'blue' },
            { title: 'در حال مذاکره', statuses: ['در حال مذاکره'], color: 'amber' },
            { title: 'پیگیری', statuses: ['پیگیری'], color: 'purple' },
            { title: 'تکمیل شده', statuses: ['تکمیل شده', 'غیرفعال'], color: 'green' },
          ].map((col, i) => {
            const colClients = filteredClients.filter(c => col.statuses.includes(c.status));
            return (
              <div key={i} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-800">{col.title}</h4>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    col.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                    col.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                    col.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>{colClients.length}</span>
                </div>
                <div className="space-y-3">
                  {colClients.map((client) => (
                    <div key={client.id} onClick={() => setSelectedClient(client)} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {client.name[0]}
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
            );
          })}
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && !showActivityModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">جزئیات مشتری</h3>
              <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedClient.name[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedClient.name}</h4>
                  <p className="text-sm text-gray-500">{selectedClient.phone}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${getStatusBg(getStatusColor(selectedClient.status))}`}>{selectedClient.status}</span>
                    {selectedClient.tags.map(tag => (
                      <span key={tag} className="badge bg-amber-50 text-amber-700">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">نوع مشتری</span>
                  <span className="text-sm font-medium text-gray-800">{selectedClient.type}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">کد ملی</span>
                  <span className="text-sm font-medium text-gray-800">{selectedClient.nationalId}</span>
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
                  <span className="text-sm text-gray-600">منبع جذب</span>
                  <span className="text-sm font-medium text-gray-800">{selectedClient.source}</span>
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

              {/* Activities */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900 text-sm">تاریخچه فعالیت‌ها</h4>
                  <button onClick={() => setShowActivityModal(true)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    + ثبت فعالیت
                  </button>
                </div>
                {selectedClient.activities.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">فعالیتی ثبت نشده</p>
                ) : (
                  <div className="space-y-2">
                    {selectedClient.activities.map((act) => (
                      <div key={act.id} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          act.type === 'تماس' ? 'bg-green-50 text-green-600' :
                          act.type === 'بازدید' ? 'bg-blue-50 text-blue-600' :
                          act.type === 'جلسه' ? 'bg-amber-50 text-amber-600' :
                          act.type === 'پیام' ? 'bg-purple-50 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <i className={`fa-solid ${
                            act.type === 'تماس' ? 'fa-phone' :
                            act.type === 'بازدید' ? 'fa-eye' :
                            act.type === 'جلسه' ? 'fa-handshake' :
                            act.type === 'پیام' ? 'fa-comment' :
                            'fa-note-sticky'
                          } text-xs`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700">{act.text}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{act.date} • {act.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button onClick={() => setSelectedClient(null)} className="btn-secondary">بستن</button>
              <button onClick={() => { setEditingClient(selectedClient); setShowModal(true); setSelectedClient(null); }} className="btn-secondary">
                <i className="fa-solid fa-pen ml-1"></i> ویرایش
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showActivityModal && selectedClient && (
        <ActivityModal
          client={selectedClient}
          onClose={() => setShowActivityModal(false)}
          onSave={(activity) => {
            addClientActivity(selectedClient.id, activity);
            setShowActivityModal(false);
          }}
        />
      )}

      {/* Add/Edit Client Modal */}
      {showModal && (
        <ClientModal
          client={editingClient}
          onClose={() => { setShowModal(false); setEditingClient(null); }}
          onSave={(data) => {
            if (editingClient) {
              updateClient(editingClient.id, data);
            } else {
              addClient(data as Omit<Client, 'id' | 'createdAt' | 'activities'>);
            }
            setShowModal(false);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
}

function ClientModal({ client, onClose, onSave }: { client: Client | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    nationalId: client?.nationalId || '',
    type: client?.type || 'خریدار' as Client['type'],
    interest: client?.interest || '',
    budget: client?.budget || '',
    budgetValue: client?.budgetValue || 0,
    status: client?.status || 'فعال' as Client['status'],
    source: client?.source || 'حضوری' as Client['source'],
    notes: client?.notes || '',
    tags: client?.tags || [] as string[],
    lastContact: client?.lastContact || 'همین الان',
    nextFollowUp: client?.nextFollowUp || '',
  });

  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-gray-900">{client ? 'ویرایش مشتری' : 'مشتری جدید'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">نام و نام خانوادگی</label>
              <input type="text" className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">شماره تلفن</label>
              <input type="text" className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">کد ملی</label>
              <input type="text" className="input-field" value={form.nationalId} onChange={e => setForm({...form, nationalId: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">نوع مشتری</label>
              <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value as Client['type']})}>
                <option value="خریدار">خریدار</option>
                <option value="فروشنده">فروشنده</option>
                <option value="مستاجر">مستاجر</option>
                <option value="موجر">موجر</option>
                <option value="سرمایه‌گذار">سرمایه‌گذار</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">وضعیت</label>
              <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value as Client['status']})}>
                <option value="فعال">فعال</option>
                <option value="در حال مذاکره">در حال مذاکره</option>
                <option value="پیگیری">پیگیری</option>
                <option value="تکمیل شده">تکمیل شده</option>
                <option value="غیرفعال">غیرفعال</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">منبع جذب</label>
              <select className="input-field" value={form.source} onChange={e => setForm({...form, source: e.target.value as Client['source']})}>
                <option value="وب‌سایت">وب‌سایت</option>
                <option value="معرفی">معرفی</option>
                <option value="تبلیغات">تبلیغات</option>
                <option value="حضوری">حضوری</option>
                <option value="تلفنی">تلفنی</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">علاقه‌مندی</label>
            <input type="text" className="input-field" placeholder="مثال: آپارتمان ۱۰۰-۱۵۰ متری" value={form.interest} onChange={e => setForm({...form, interest: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">بودجه (توضیح)</label>
              <input type="text" className="input-field" placeholder="مثال: ۵-۱۰ میلیارد" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">مقدار بودجه (ریال)</label>
              <input type="number" className="input-field" value={form.budgetValue || ''} onChange={e => setForm({...form, budgetValue: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">برچسب‌ها</label>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="badge bg-blue-50 text-blue-700 flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => setForm({...form, tags: form.tags.filter(t => t !== tag)})} className="text-blue-400 hover:text-blue-600">
                    <i className="fa-solid fa-xmark text-[10px]"></i>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" className="input-field flex-1" placeholder="برچسب جدید (مثل VIP)" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
              <button type="button" onClick={addTag} className="btn-secondary text-xs">افزودن</button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">یادداشت</label>
            <textarea className="input-field h-16 resize-none" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}></textarea>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary">انصراف</button>
            <button type="submit" className="btn-primary">{client ? 'ذخیره' : 'ثبت مشتری'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ActivityModal({ client, onClose, onSave }: { client: Client; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    type: 'تماس' as 'تماس' | 'بازدید' | 'پیام' | 'جلسه' | 'یادداشت',
    text: '',
    date: new Date().toLocaleDateString('fa-IR'),
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">ثبت فعالیت جدید</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">مشتری: <span className="font-medium text-gray-800">{client.name}</span></p>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">نوع فعالیت</label>
            <div className="flex flex-wrap gap-2">
              {(['تماس', 'بازدید', 'پیام', 'جلسه', 'یادداشت'] as const).map(type => (
                <button key={type} type="button" onClick={() => setForm({...form, type})}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.type === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">توضیحات</label>
            <textarea className="input-field h-20 resize-none" placeholder="توضیح فعالیت..." value={form.text} onChange={e => setForm({...form, text: e.target.value})} required></textarea>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">تاریخ</label>
            <input type="text" className="input-field" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary">انصراف</button>
            <button type="submit" className="btn-primary">ثبت فعالیت</button>
          </div>
        </form>
      </div>
    </div>
  );
}
