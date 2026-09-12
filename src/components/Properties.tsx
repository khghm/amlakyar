import { useState } from 'react';
import { useData, Property } from '../store/DataContext';
import { formatPrice, getStatusBg, getStatusColor } from '../utils/helpers';

export default function Properties() {
  const { properties, addProperty, updateProperty, deleteProperty } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProperties = properties.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter || p.dealType === filter || p.type === filter;
    const matchSearch = !searchTerm || p.title.includes(searchTerm) || p.address.includes(searchTerm) || p.district.includes(searchTerm);
    return matchFilter && matchSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این ملک مطمئن هستید؟')) {
      deleteProperty(id);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">مدیریت املاک</h2>
          <p className="text-sm text-gray-500 mt-1">لیست تمام ملک‌های ثبت شده در آژانس</p>
        </div>
        <button onClick={() => { setEditingProperty(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          <span>ثبت ملک جدید</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-building text-blue-600 text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">{properties.length}</span>
          </div>
          <p className="text-xs text-gray-500">کل ملک‌ها</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-circle-check text-green-600 text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">{properties.filter(p => p.status === 'فعال').length}</span>
          </div>
          <p className="text-xs text-gray-500">فعال</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-tag text-amber-600 text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">{properties.filter(p => p.dealType === 'فروش').length}</span>
          </div>
          <p className="text-xs text-gray-500">فروشی</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-key text-purple-600 text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">{properties.filter(p => p.dealType === 'اجاره' || p.dealType === 'رهن').length}</span>
          </div>
          <p className="text-xs text-gray-500">اجاره‌ای</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 border border-gray-200">
          <i className="fa-solid fa-search text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="جستجو در ملک‌ها..."
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input-field w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">همه</option>
            <option value="فعال">فعال</option>
            <option value="فروش">فروشی</option>
            <option value="اجاره">اجاره‌ای</option>
            <option value="آپارتمان">آپارتمان</option>
            <option value="ویلا">ویلا</option>
            <option value="مغازه">مغازه</option>
            <option value="زمین">زمین</option>
          </select>
          <div className="flex bg-white rounded-xl border border-gray-200 p-1">
            <button onClick={() => setViewMode('grid')} className={`w-8 h-8 rounded-lg flex items-center justify-center ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}>
              <i className="fa-solid fa-grid-2 text-sm"></i>
            </button>
            <button onClick={() => setViewMode('list')} className={`w-8 h-8 rounded-lg flex items-center justify-center ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}>
              <i className="fa-solid fa-list text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <div key={property.id} className="card hover:shadow-md transition-shadow cursor-pointer group">
              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <i className="fa-solid fa-house text-blue-300 text-4xl"></i>
                <div className="absolute top-3 right-3">
                  <span className={`badge ${getStatusBg(getStatusColor(property.status))}`}>{property.status}</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`badge ${
                    property.dealType === 'فروش' ? 'bg-blue-500 text-white' :
                    property.dealType === 'اجاره' ? 'bg-green-500 text-white' :
                    'bg-purple-500 text-white'
                  }`}>{property.dealType}</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{property.title}</h4>
              <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                <i className="fa-solid fa-location-dot text-xs"></i>
                {property.address}
              </p>
              <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><i className="fa-solid fa-ruler-combined"></i> {property.area} متر</span>
                {property.rooms > 0 && <span className="flex items-center gap-1"><i className="fa-solid fa-bed"></i> {property.rooms} خواب</span>}
                {property.hasParking && <span className="flex items-center gap-1"><i className="fa-solid fa-car"></i></span>}
                {property.hasElevator && <span className="flex items-center gap-1"><i className="fa-solid fa-elevator"></i></span>}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <p className="text-lg font-bold text-blue-600">
                  {formatPrice(property.price)}
                  {property.dealType !== 'فروش' && <span className="text-xs font-normal text-gray-500 mr-1">/ ماهانه</span>}
                </p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(property)} className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100">
                    <i className="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button onClick={() => handleDelete(property.id)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100">
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">عنوان</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">نوع</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">متراژ</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">آدرس</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">قیمت</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">وضعیت</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">{property.title}</td>
                    <td className="px-5 py-4"><span className={`badge ${property.dealType === 'فروش' ? 'bg-blue-50 text-blue-700' : property.dealType === 'اجاره' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}`}>{property.dealType}</span></td>
                    <td className="px-5 py-4 text-sm text-gray-700">{property.area} متر</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{property.district}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">{formatPrice(property.price)}</td>
                    <td className="px-5 py-4"><span className={`badge ${getStatusBg(getStatusColor(property.status))}`}>{property.status}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(property)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-gray-500 hover:text-blue-600">
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onClick={() => handleDelete(property.id)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-red-50 text-gray-500 hover:text-red-600">
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
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <PropertyModal
          property={editingProperty}
          onClose={() => { setShowModal(false); setEditingProperty(null); }}
          onSave={(data) => {
            if (editingProperty) {
              updateProperty(editingProperty.id, data);
            } else {
              addProperty(data as Omit<Property, 'id' | 'createdAt'>);
            }
            setShowModal(false);
            setEditingProperty(null);
          }}
        />
      )}
    </div>
  );
}

function PropertyModal({ property, onClose, onSave }: { property: Property | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    title: property?.title || '',
    type: property?.type || 'آپارتمان' as Property['type'],
    dealType: property?.dealType || 'فروش' as Property['dealType'],
    area: property?.area || 0,
    rooms: property?.rooms || 0,
    price: property?.price || 0,
    deposit: property?.deposit || 0,
    address: property?.address || '',
    district: property?.district || '',
    floor: property?.floor || 0,
    hasParking: property?.hasParking || false,
    hasElevator: property?.hasElevator || false,
    hasStorage: property?.hasStorage || false,
    description: property?.description || '',
    status: property?.status || 'فعال' as Property['status'],
    ownerName: property?.ownerName || '',
    ownerPhone: property?.ownerPhone || '',
    ownerId: property?.ownerId || '',
    images: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-gray-900">{property ? 'ویرایش ملک' : 'ثبت ملک جدید'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">عنوان ملک</label>
              <input type="text" className="input-field" placeholder="مثال: آپارتمان ۱۲۰ متری سعادت‌آباد" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">نوع ملک</label>
              <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value as Property['type']})}>
                <option value="آپارتمان">آپارتمان</option>
                <option value="ویلا">ویلا</option>
                <option value="مغازه">مغازه</option>
                <option value="زمین">زمین</option>
                <option value="دفتر">دفتر</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">نوع معامله</label>
              <select className="input-field" value={form.dealType} onChange={e => setForm({...form, dealType: e.target.value as Property['dealType']})}>
                <option value="فروش">فروش</option>
                <option value="اجاره">اجاره</option>
                <option value="رهن">رهن</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">متراژ (متر مربع)</label>
              <input type="number" className="input-field" value={form.area || ''} onChange={e => setForm({...form, area: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">تعداد اتاق</label>
              <input type="number" className="input-field" value={form.rooms || ''} onChange={e => setForm({...form, rooms: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">قیمت (ریال)</label>
              <input type="number" className="input-field" value={form.price || ''} onChange={e => setForm({...form, price: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">پول پیش / رهن (ریال)</label>
              <input type="number" className="input-field" value={form.deposit || ''} onChange={e => setForm({...form, deposit: parseInt(e.target.value) || 0})} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">آدرس</label>
              <input type="text" className="input-field" placeholder="آدرس کامل" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">منطقه</label>
              <input type="text" className="input-field" placeholder="مثال: منطقه ۲" value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">طبقه</label>
              <input type="number" className="input-field" value={form.floor || ''} onChange={e => setForm({...form, floor: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          
          {/* Amenities */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">امکانات</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.hasParking} onChange={e => setForm({...form, hasParking: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-700">پارکینگ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.hasElevator} onChange={e => setForm({...form, hasElevator: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-700">آسانسور</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.hasStorage} onChange={e => setForm({...form, hasStorage: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-700">انباری</span>
              </label>
            </div>
          </div>

          {/* Owner Info */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">اطلاعات مالک</h4>
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
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">توضیحات</label>
            <textarea className="input-field h-20 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary">انصراف</button>
            <button type="submit" className="btn-primary">{property ? 'ذخیره تغییرات' : 'ثبت ملک'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
