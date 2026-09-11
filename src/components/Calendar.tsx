import { useState } from 'react';
import { useData, CalendarEvent } from '../store/DataContext';

export default function Calendar() {
  const { events, addEvent, updateEvent, deleteEvent, clients, properties } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این رویداد مطمئن هستید؟')) {
      deleteEvent(id);
    }
  };

  const todayEvents = events.filter(e => e.status === 'برنامه‌ریزی شده');
  const completedEvents = events.filter(e => e.status === 'انجام شده');

  const eventTypes = [
    { type: 'بازدید', color: 'blue', icon: 'fa-eye' },
    { type: 'جلسه', color: 'amber', icon: 'fa-handshake' },
    { type: 'پیگیری', color: 'purple', icon: 'fa-phone' },
    { type: 'امضا', color: 'green', icon: 'fa-pen' },
    { type: 'تسلیمر', color: 'red', icon: 'fa-key' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">تقویم و قرار ملاقات‌ها</h2>
          <p className="text-sm text-gray-500 mt-1">مدیریت بازدیدها، جلسات و پیگیری‌ها</p>
        </div>
        <button onClick={() => { setEditingEvent(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <i className="fa-solid fa-plus"></i>
          <span>رویداد جدید</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {eventTypes.map((et) => (
          <div key={et.type} className="stat-card">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                et.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                et.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                et.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                et.color === 'green' ? 'bg-green-50 text-green-600' :
                'bg-red-50 text-red-600'
              }`}>
                <i className={`fa-solid ${et.icon} text-sm`}></i>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {events.filter(e => e.type === et.type && e.status === 'برنامه‌ریزی شده').length}
              </span>
            </div>
            <p className="text-xs text-gray-500">{et.type}</p>
          </div>
        ))}
      </div>

      {/* Events Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-calendar-days text-blue-600"></i>
            رویدادهای پیش رو
          </h3>
          {todayEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <i className="fa-solid fa-calendar-xmark text-4xl mb-3"></i>
              <p>رویدادی برنامه‌ریزی نشده است</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    event.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    event.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                    event.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                    event.color === 'green' ? 'bg-green-50 text-green-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    <i className={`fa-solid ${eventTypes.find(t => t.type === event.type)?.icon || 'fa-calendar'} text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-gray-800">{event.title}</h4>
                      <span className={`badge ${
                        event.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                        event.color === 'amber' ? 'bg-amber-50 text-amber-700' :
                        event.color === 'purple' ? 'bg-purple-50 text-purple-700' :
                        event.color === 'green' ? 'bg-green-50 text-green-700' :
                        'bg-red-50 text-red-700'
                      }`}>{event.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1"><i className="fa-regular fa-calendar"></i> {event.date}</span>
                      <span className="flex items-center gap-1"><i className="fa-regular fa-clock"></i> {event.time}</span>
                      <span className="flex items-center gap-1"><i className="fa-regular fa-hourglass"></i> {event.duration} دقیقه</span>
                    </div>
                    {event.clientName && (
                      <p className="text-xs text-gray-600 mb-1"><i className="fa-solid fa-user ml-1"></i> {event.clientName}</p>
                    )}
                    {event.propertyTitle && (
                      <p className="text-xs text-gray-600 mb-1"><i className="fa-solid fa-house ml-1"></i> {event.propertyTitle}</p>
                    )}
                    {event.notes && <p className="text-xs text-gray-500 mt-1">{event.notes}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => updateEvent(event.id, { status: 'انجام شده' })}
                      className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100"
                      title="انجام شد"
                    >
                      <i className="fa-solid fa-check text-xs"></i>
                    </button>
                    <button 
                      onClick={() => { setEditingEvent(event); setShowModal(true); }}
                      className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100"
                      title="ویرایش"
                    >
                      <i className="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100"
                      title="حذف"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed & Summary */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-chart-simple text-green-600"></i>
              خلاصه عملکرد
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm text-green-700">انجام شده</span>
                <span className="font-bold text-green-800">{completedEvents.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700">برنامه‌ریزی شده</span>
                <span className="font-bold text-blue-800">{todayEvents.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="text-sm text-amber-700">امروز</span>
                <span className="font-bold text-amber-800">{events.filter(e => e.date === '۱۴۰۲/۰۹/۲۰').length}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left text-amber-600"></i>
              رویدادهای انجام شده
            </h3>
            <div className="space-y-2">
              {completedEvents.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">هنوز رویدادی انجام نشده</p>
              ) : (
                completedEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{event.title}</p>
                      <p className="text-[10px] text-gray-400">{event.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <EventModal
          event={editingEvent}
          clients={clients}
          properties={properties}
          onClose={() => { setShowModal(false); setEditingEvent(null); }}
          onSave={(data) => {
            if (editingEvent) {
              updateEvent(editingEvent.id, data);
            } else {
              addEvent(data as Omit<CalendarEvent, 'id'>);
            }
            setShowModal(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}

function EventModal({ event, clients, properties, onClose, onSave }: { 
  event: CalendarEvent | null; 
  clients: any[]; 
  properties: any[];
  onClose: () => void; 
  onSave: (data: any) => void; 
}) {
  const [form, setForm] = useState({
    title: event?.title || '',
    type: event?.type || 'بازدید' as CalendarEvent['type'],
    clientId: event?.clientId || '',
    clientName: event?.clientName || '',
    propertyId: event?.propertyId || '',
    propertyTitle: event?.propertyTitle || '',
    date: event?.date || '',
    time: event?.time || '',
    duration: event?.duration || 60,
    notes: event?.notes || '',
    status: event?.status || 'برنامه‌ریزی شده' as CalendarEvent['status'],
    color: event?.color || 'blue',
  });

  const typeColors: Record<string, string> = {
    'بازدید': 'blue', 'جلسه': 'amber', 'پیگیری': 'purple', 'امضا': 'green', 'تسلیمر': 'red'
  };

  const handleTypeChange = (type: string) => {
    setForm({ ...form, type: type as CalendarEvent['type'], color: typeColors[type] || 'blue' });
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setForm({ ...form, clientId, clientName: client?.name || '' });
  };

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    setForm({ ...form, propertyId, propertyTitle: property?.title || '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{event ? 'ویرایش رویداد' : 'رویداد جدید'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">عنوان رویداد</label>
            <input type="text" className="input-field" placeholder="مثال: بازدید آپارتمان" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">نوع رویداد</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeColors).map(([type, color]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.type === type ? `bg-${color}-100 text-${color}-700 ring-2 ring-${color}-200` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={form.type === type ? { backgroundColor: color === 'blue' ? '#dbeafe' : color === 'amber' ? '#fef3c7' : color === 'purple' ? '#f3e8ff' : color === 'green' ? '#dcfce7' : '#fee2e2' } : {}}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">تاریخ</label>
              <input type="text" className="input-field" placeholder="۱۴۰۲/۰۹/۲۰" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">ساعت</label>
              <input type="text" className="input-field" placeholder="۱۰:۰۰" value={form.time} onChange={e => setForm({...form, time: e.target.value})} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">مدت زمان (دقیقه)</label>
            <input type="number" className="input-field" value={form.duration || ''} onChange={e => setForm({...form, duration: parseInt(e.target.value) || 0})} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">مشتری</label>
            <select className="input-field" value={form.clientId} onChange={e => handleClientChange(e.target.value)}>
              <option value="">انتخاب مشتری (اختیاری)</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">ملک</label>
            <select className="input-field" value={form.propertyId} onChange={e => handlePropertyChange(e.target.value)}>
              <option value="">انتخاب ملک (اختیاری)</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">یادداشت</label>
            <textarea className="input-field h-16 resize-none" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}></textarea>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary">انصراف</button>
            <button type="submit" className="btn-primary">{event ? 'ذخیره' : 'ثبت رویداد'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
