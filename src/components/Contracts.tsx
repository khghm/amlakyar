import { useState } from 'react';
import { useData, Contract } from '../store/DataContext';
import { formatPrice, getStatusBg, getStatusColor } from '../utils/helpers';

export default function Contracts() {
  const { contracts, properties, clients, agents, addContract, updateContract, deleteContract } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContracts = contracts.filter(c => {
    const matchFilter = filter === 'all' || 
      (filter === 'pending' && (c.status === 'در انتظار تایید' || c.status === 'پیش‌نویس')) ||
      (filter === 'approved' && c.status === 'تایید شده') ||
      (filter === 'rejected' && c.status === 'رد شده') ||
      c.type === filter;
    const matchSearch = !searchTerm || c.id.includes(searchTerm) || c.clientName.includes(searchTerm) || c.propertyTitle.includes(searchTerm);
    return matchFilter && matchSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این قرارداد مطمئن هستید؟')) {
      deleteContract(id);
    }
  };

  const handleSendToGov = (contract: Contract) => {
    const trackingCode = `GOV-${Math.floor(Math.random() * 900000) + 100000}`;
    updateContract(contract.id, { 
      govStatus: 'در حال بررسی', 
      trackingCode,
      status: 'در انتظار تایید' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">مدیریت قراردادها</h2>
          <p className="text-sm text-gray-500 mt-1">ثبت، پیگیری و ارسال خودکار به سامانه دولتی</p>
        </div>
        <button onClick={() => { setEditingContract(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
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
            <p className="text-xs text-blue-600 mt-0.5">آخرین همگام‌سازی: ۲ دقیقه پیش • {contracts.filter(c => c.trackingCode).length} قرارداد ارسال شده</p>
          </div>
        </div>
        <button className="btn-secondary text-xs hidden sm:flex items-center gap-1">
          <i className="fa-solid fa-sync-alt"></i>
          همگام‌سازی
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: 'همه' },
            { id: 'pending', label: 'در انتظار' },
            { id: 'approved', label: 'تایید شده' },
            { id: 'rejected', label: 'رد شده' },
            { id: 'فروش', label: 'فروش' },
            { id: 'اجاره', label: 'اجاره' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2 gap-2 border border-gray-200">
          <i className="fa-solid fa-search text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="جستجو در قراردادها..."
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">شماره</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">نوع</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">ملک</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">مشتری</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">مبلغ</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">کمیسیون</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">وضعیت</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">قولنامه</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">سامانه دولتی</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-400 text-sm">قراردادی یافت نشد</td>
                </tr>
              ) : filteredContracts.map((contract) => (
                <tr key={contract.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-800">{contract.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${
                      contract.type === 'فروش' ? 'bg-blue-50 text-blue-700' :
                      contract.type === 'اجاره' ? 'bg-green-50 text-green-700' :
                      contract.type === 'رهن' ? 'bg-purple-50 text-purple-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {contract.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">{contract.propertyTitle}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <span className="text-sm text-gray-700">{contract.clientName}</span>
                      <p className="text-xs text-gray-400">{contract.clientPhone}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-800">{formatPrice(contract.amount)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-green-700">{formatPrice(contract.commission)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={contract.status}
                      onChange={(e) => updateContract(contract.id, { status: e.target.value as Contract['status'] })}
                      className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer ${getStatusBg(getStatusColor(contract.status))}`}
                    >
                      <option value="پیش‌نویس">پیش‌نویس</option>
                      <option value="در انتظار تایید">در انتظار تایید</option>
                      <option value="تایید شده">تایید شده</option>
                      <option value="رد شده">رد شده</option>
                      <option value="لغو شده">لغو شده</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    {contract.agreementId ? (
                      <div className="flex items-center gap-1">
                        <i className="fa-solid fa-link text-indigo-500 text-xs"></i>
                        <span className="text-xs text-indigo-700 font-mono">متصل</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {contract.trackingCode ? (
                      <div>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-mono">{contract.trackingCode}</span>
                        <p className="text-[10px] text-gray-400 mt-1">{contract.govStatus}</p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleSendToGov(contract)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        ارسال به سامانه
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => { setEditingContract(contract); setShowModal(true); }}
                        className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(contract.id)}
                        className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                      >
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

      {/* New/Edit Contract Modal */}
      {showModal && (
        <ContractModal
          contract={editingContract}
          properties={properties}
          clients={clients}
          agents={agents}
          onClose={() => { setShowModal(false); setEditingContract(null); }}
          onSave={(data) => {
            if (editingContract) {
              updateContract(editingContract.id, data);
            } else {
              addContract(data as Omit<Contract, 'id' | 'createdAt'>);
            }
            setShowModal(false);
            setEditingContract(null);
          }}
        />
      )}
    </div>
  );
}

function ContractModal({ contract, properties, clients, agents, onClose, onSave }: {
  contract: Contract | null;
  properties: any[];
  clients: any[];
  agents: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [form, setForm] = useState({
    type: contract?.type || 'فروش' as Contract['type'],
    propertyId: contract?.propertyId || '',
    propertyTitle: contract?.propertyTitle || '',
    clientId: contract?.clientId || '',
    clientName: contract?.clientName || '',
    clientPhone: contract?.clientPhone || '',
    clientNationalId: contract?.clientNationalId || '',
    ownerName: contract?.ownerName || '',
    ownerPhone: contract?.ownerPhone || '',
    amount: contract?.amount || 0,
    deposit: contract?.deposit || 0,
    commissionRate: contract?.commissionRate || 0.5,
    commission: contract?.commission || 0,
    agentId: contract?.agentId || '',
    agentName: contract?.agentName || '',
    status: contract?.status || 'پیش‌نویس' as Contract['status'],
    notes: contract?.notes || '',
  });

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    setForm({ ...form, propertyId, propertyTitle: property?.title || '', ownerName: property?.ownerName || '', ownerPhone: property?.ownerPhone || '' });
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setForm({ ...form, clientId, clientName: client?.name || '', clientPhone: client?.phone || '', clientNationalId: client?.nationalId || '' });
  };

  const handleAgentChange = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    setForm({ ...form, agentId, agentName: agent?.name || '' });
  };

  const calculateCommission = () => {
    let comm = 0;
    if (form.type === 'فروش') {
      comm = form.amount * (form.commissionRate / 100);
    } else {
      comm = form.amount * (form.commissionRate / 100);
      if (form.deposit) {
        comm += form.deposit * 0.0004;
      }
    }
    setForm({ ...form, commission: Math.round(comm) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-gray-900">{contract ? 'ویرایش قرارداد' : 'ثبت قرارداد جدید'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">نوع قرارداد</label>
              <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value as Contract['type']})}>
                <option value="فروش">فروش</option>
                <option value="اجاره">اجاره</option>
                <option value="رهن">رهن</option>
                <option value="مشارکت">مشارکت</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">وضعیت</label>
              <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value as Contract['status']})}>
                <option value="پیش‌نویس">پیش‌نویس</option>
                <option value="در انتظار تایید">در انتظار تایید</option>
                <option value="تایید شده">تایید شده</option>
                <option value="رد شده">رد شده</option>
                <option value="لغو شده">لغو شده</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">ملک</label>
            <select className="input-field" value={form.propertyId} onChange={e => handlePropertyChange(e.target.value)}>
              <option value="">انتخاب ملک</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">مشتری</label>
              <select className="input-field" value={form.clientId} onChange={e => handleClientChange(e.target.value)}>
                <option value="">انتخاب مشتری</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">کد ملی مشتری</label>
              <input type="text" className="input-field" value={form.clientNationalId} onChange={e => setForm({...form, clientNationalId: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">نام مالک</label>
              <input type="text" className="input-field" value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">تلفن مالک</label>
              <input type="text" className="input-field" value={form.ownerPhone} onChange={e => setForm({...form, ownerPhone: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">مبلغ قرارداد (ریال)</label>
              <input type="number" className="input-field" value={form.amount || ''} onChange={e => setForm({...form, amount: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">نرخ کمیسیون (٪)</label>
              <input type="number" step="0.1" className="input-field" value={form.commissionRate || ''} onChange={e => setForm({...form, commissionRate: parseFloat(e.target.value) || 0})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">کمیسیون (ریال)</label>
              <div className="flex gap-2">
                <input type="number" className="input-field" value={form.commission || ''} onChange={e => setForm({...form, commission: parseInt(e.target.value) || 0})} />
                <button type="button" onClick={calculateCommission} className="btn-secondary px-3 text-xs whitespace-nowrap">محاسبه</button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">مشاور مسئول</label>
            <select className="input-field" value={form.agentId} onChange={e => handleAgentChange(e.target.value)}>
              <option value="">انتخاب مشاور</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name} - {a.role}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">یادداشت</label>
            <textarea className="input-field h-16 resize-none" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}></textarea>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
            <i className="fa-solid fa-circle-info text-amber-600 mt-0.5"></i>
            <div>
              <p className="text-sm font-medium text-amber-800">ارسال خودکار به سامانه دولتی</p>
              <p className="text-xs text-amber-600 mt-1">پس از ثبت و تایید، قرارداد به صورت خودکار به سامانه ثبت اسناد و املاک ارسال خواهد شد.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary">انصراف</button>
            <button type="submit" className="btn-primary">{contract ? 'ذخیره تغییرات' : 'ثبت قرارداد'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
