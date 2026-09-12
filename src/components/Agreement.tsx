import { useState, useRef } from 'react';
import { useData, Agreement, PaymentInstallment } from '../store/DataContext';
import { formatPrice, getStatusBg, getStatusColor, formatCurrency, parseCurrencyInput } from '../utils/helpers';
import { getTodayJalali } from '../utils/jalali';
import JalaliDatePicker from './JalaliDatePicker';
import CurrencyInput from './CurrencyInput';

type WizardStep = 'type' | 'parties' | 'property' | 'financial' | 'conditions' | 'signatures' | 'preview';

export default function AgreementPage() {
  const { agreements, addAgreement, deleteAgreement } = useData();
  const [showWizard, setShowWizard] = useState(false);
  const [viewingAgreement, setViewingAgreement] = useState<Agreement | null>(null);
  const [printingAgreement, setPrintingAgreement] = useState<Agreement | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این قولنامه مطمئن هستید؟')) deleteAgreement(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">مدیریت قولنامه‌ها</h2>
          <p className="text-sm text-gray-500 mt-1">صدور قولنامه رسمی مطابق با استانداردهای اتحادیه مشاوران املاک</p>
        </div>
        <button onClick={() => setShowWizard(true)} className="btn-primary flex items-center gap-2">
          <i className="fa-solid fa-file-signature"></i>
          <span>ایجاد قولنامه جدید</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-file-signature text-blue-600 text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">{agreements.length}</span>
          </div>
          <p className="text-xs text-gray-500">کل قولنامه‌ها</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-hourglass-half text-amber-600 text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">{agreements.filter(a => a.status === 'در حال اجرا').length}</span>
          </div>
          <p className="text-xs text-gray-500">در حال اجرا</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-circle-check text-green-600 text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">{agreements.filter(a => a.status === 'تکمیل شده').length}</span>
          </div>
          <p className="text-xs text-gray-500">تکمیل شده</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-coins text-purple-600 text-sm"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">{formatPrice(agreements.reduce((s, a) => s + a.commissionAmount, 0))}</span>
          </div>
          <p className="text-xs text-gray-500">مجموع کمیسیون</p>
        </div>
      </div>

      {/* Agreements List */}
      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">لیست قولنامه‌ها</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">شماره</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">نوع</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">طرفین</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">ملک</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">مبلغ</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">کد رهگیری</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">وضعیت</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {agreements.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-sm">قولنامه‌ای ثبت نشده است</td></tr>
              ) : agreements.map((agr) => (
                <tr key={agr.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-4 text-sm font-mono font-medium text-gray-800">{agr.agreementNumber}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${agr.type === 'فروش' ? 'bg-blue-50 text-blue-700' : agr.type === 'اجاره' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}`}>{agr.type}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-800">فروشنده: {agr.seller.name}</p>
                    <p className="text-sm text-gray-800">خریدار: {agr.buyer.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">{agr.property.type} - {agr.property.area} متر</p>
                    <p className="text-xs text-gray-500">پلاک: {agr.property.registrationPlaque}</p>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-800">{formatPrice(agr.totalPrice)}</td>
                  <td className="px-5 py-4"><span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-mono">{agr.trackingCode}</span></td>
                  <td className="px-5 py-4"><span className={`badge ${getStatusBg(getStatusColor(agr.status))}`}>{agr.status}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewingAgreement(agr)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-blue-50 text-gray-500 hover:text-blue-600" title="مشاهده">
                        <i className="fa-solid fa-eye text-xs"></i>
                      </button>
                      <button onClick={() => setPrintingAgreement(agr)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-green-50 text-gray-500 hover:text-green-600" title="چاپ">
                        <i className="fa-solid fa-print text-xs"></i>
                      </button>
                      <button onClick={() => handleDelete(agr.id)} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-red-50 text-gray-500 hover:text-red-600" title="حذف">
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

      {showWizard && <AgreementWizard onClose={() => setShowWizard(false)} onSave={(data) => { addAgreement(data as Omit<Agreement, 'id' | 'createdAt'>); setShowWizard(false); }} />}
      {viewingAgreement && <AgreementView agreement={viewingAgreement} onClose={() => setViewingAgreement(null)} onPrint={() => { setPrintingAgreement(viewingAgreement); setViewingAgreement(null); }} />}
      {printingAgreement && <AgreementPrint agreement={printingAgreement} onClose={() => setPrintingAgreement(null)} />}
    </div>
  );
}

// ============ Wizard ============
function AgreementWizard({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
  const { properties, clients } = useData();
  const [step, setStep] = useState<WizardStep>('type');
  const today = getTodayJalali();
  const [form, setForm] = useState<any>({
    type: 'فروش', date: today,
    seller: { name: '', nationalId: '', fatherName: '', birthCertificate: '', phone: '', address: '', postalCode: '', role: 'فروشنده' },
    buyer: { name: '', nationalId: '', fatherName: '', birthCertificate: '', phone: '', address: '', postalCode: '', role: 'خریدار' },
    property: { type: 'آپارتمان', registrationPlaque: '', registrationSection: '', area: 0, address: '', floor: 0, unit: '', hasParking: false, hasElevator: false, hasStorage: false, legalStatus: 'آزاد', usage: 'مسکونی', amenities: [] },
    totalPrice: 0, deposit: 0, installments: [],
    deliveryDate: '', transferDate: '', notaryOffice: '',
    penaltyPerDay: 0, commissionAmount: 0, commissionRate: 0.25,
    hasRightOfRescission: true, rescissionDeadline: '', rescissionPenalty: 0,
    forceMajeure: true, specialConditions: '',
    witness1Name: '', witness1NationalId: '',
    witness2Name: '', witness2NationalId: '',
    status: 'پیش‌نویس', notes: '',
  });

  const steps: { id: WizardStep; title: string; icon: string }[] = [
    { id: 'type', title: 'نوع قرارداد', icon: 'fa-file-contract' },
    { id: 'parties', title: 'طرفین', icon: 'fa-users' },
    { id: 'property', title: 'مشخصات ملک', icon: 'fa-building' },
    { id: 'financial', title: 'مالی', icon: 'fa-coins' },
    { id: 'conditions', title: 'شرایط', icon: 'fa-scale-balanced' },
    { id: 'signatures', title: 'شهود', icon: 'fa-pen-nib' },
    { id: 'preview', title: 'پیش‌نمایش', icon: 'fa-eye' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);
  const nextStep = () => { if (currentStepIndex < steps.length - 1) setStep(steps[currentStepIndex + 1].id); };
  const prevStep = () => { if (currentStepIndex > 0) setStep(steps[currentStepIndex - 1].id); };

  const handleSubmit = () => {
    const agreementNumber = `MB-${today.replace(/\//g, '-')}`;
    const trackingCode = `IR-${Math.floor(Math.random() * 900000000) + 100000000}`;
    onSave({ ...form, agreementNumber, trackingCode, sellerSignature: false, buyerSignature: false, witness1Signature: false, witness2Signature: false, agentSignature: false });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-l from-blue-50 to-indigo-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><i className="fa-solid fa-file-signature text-blue-600"></i> ایجاد قولنامه جدید</h3>
            <p className="text-xs text-gray-500 mt-1">مطابق با فرمت استاندارد اتحادیه مشاوران املاک کشور</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>

        <div className="px-5 py-4 border-b border-gray-100 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <button onClick={() => setStep(s.id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${step === s.id ? 'bg-blue-600 text-white shadow-sm' : i < currentStepIndex ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  <i className={`fa-solid ${i < currentStepIndex ? 'fa-check' : s.icon} text-xs`}></i>
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
                {i < steps.length - 1 && <div className="w-4 h-0.5 bg-gray-200 mx-1"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 'type' && <StepType form={form} setForm={setForm} />}
          {step === 'parties' && <StepParties form={form} setForm={setForm} clients={clients} />}
          {step === 'property' && <StepProperty form={form} setForm={setForm} properties={properties} />}
          {step === 'financial' && <StepFinancial form={form} setForm={setForm} />}
          {step === 'conditions' && <StepConditions form={form} setForm={setForm} />}
          {step === 'signatures' && <StepSignatures form={form} setForm={setForm} />}
          {step === 'preview' && <StepPreview form={form as Agreement} />}
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <button onClick={prevStep} disabled={step === 'type'} className="btn-secondary flex items-center gap-2 disabled:opacity-50">
            <i className="fa-solid fa-arrow-right"></i><span>مرحله قبل</span>
          </button>
          <span className="text-sm text-gray-500">مرحله {currentStepIndex + 1} از {steps.length}</span>
          {step === 'preview' ? (
            <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <i className="fa-solid fa-check"></i><span>ثبت و صدور قولنامه</span>
            </button>
          ) : (
            <button onClick={nextStep} className="btn-primary flex items-center gap-2">
              <span>مرحله بعد</span><i className="fa-solid fa-arrow-left"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Steps ============
function StepType({ form, setForm }: { form: any; setForm: any }) {
  const types = [
    { value: 'فروش', label: 'مبایعه‌نامه (فروش)', icon: 'fa-hand-holding-dollar', desc: 'قرارداد خرید و فروش ملک', color: 'blue' },
    { value: 'اجاره', label: 'اجاره‌نامه', icon: 'fa-key', desc: 'قرارداد اجاره ملک', color: 'green' },
    { value: 'رهن', label: 'رهن', icon: 'fa-lock', desc: 'قرارداد رهن کامل', color: 'purple' },
    { value: 'مشارکت', label: 'مشارکت در ساخت', icon: 'fa-helmet-safety', desc: 'قرارداد مشارکت مدنی', color: 'amber' },
    { value: 'صلح', label: 'صلح‌نامه', icon: 'fa-handshake', desc: 'قرارداد صلح حقوق', color: 'red' },
  ];

  return (
    <div>
      <h4 className="font-bold text-gray-900 mb-2">نوع قرارداد را انتخاب کنید</h4>
      <p className="text-sm text-gray-500 mb-6">نوع معامله مورد نظر خود را مشخص کنید.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map(t => (
          <button key={t.value} onClick={() => setForm({ ...form, type: t.value })} className={`p-5 rounded-xl border-2 text-right transition-all ${form.type === t.value ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${t.color === 'blue' ? 'bg-blue-100 text-blue-600' : t.color === 'green' ? 'bg-green-100 text-green-600' : t.color === 'purple' ? 'bg-purple-100 text-purple-600' : t.color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
              <i className={`fa-solid ${t.icon} text-lg`}></i>
            </div>
            <h5 className="font-bold text-gray-900 mb-1">{t.label}</h5>
            <p className="text-xs text-gray-500">{t.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepParties({ form, setForm, clients }: { form: any; setForm: any; clients: any[] }) {
  const updateSeller = (f: string, v: string) => setForm({ ...form, seller: { ...form.seller, [f]: v } });
  const updateBuyer = (f: string, v: string) => setForm({ ...form, buyer: { ...form.buyer, [f]: v } });
  const fillFromClient = (role: 'seller' | 'buyer', clientId: string) => {
    const c = clients.find(cl => cl.id === clientId);
    if (c) {
      const data = { name: c.name, nationalId: c.nationalId, phone: c.phone, address: '', postalCode: '', fatherName: '', birthCertificate: '' };
      if (role === 'seller') setForm({ ...form, seller: { ...form.seller, ...data } });
      else setForm({ ...form, buyer: { ...form.buyer, ...data } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50/30 border border-red-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900 flex items-center gap-2"><i className="fa-solid fa-user-tie text-red-600"></i> طرف اول (فروشنده / موجر)</h4>
          <select className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1" onChange={(e) => fillFromClient('seller', e.target.value)}>
            <option value="">انتخاب از مشتریان...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="نام و نام خانوادگی" value={form.seller.name} onChange={(v) => updateSeller('name', v)} required />
          <InputField label="کد ملی" value={form.seller.nationalId} onChange={(v) => updateSeller('nationalId', v)} required />
          <InputField label="نام پدر" value={form.seller.fatherName} onChange={(v) => updateSeller('fatherName', v)} required />
          <InputField label="شماره شناسنامه" value={form.seller.birthCertificate} onChange={(v) => updateSeller('birthCertificate', v)} />
          <InputField label="شماره تلفن" value={form.seller.phone} onChange={(v) => updateSeller('phone', v)} required />
          <InputField label="کد پستی" value={form.seller.postalCode} onChange={(v) => updateSeller('postalCode', v)} />
          <div className="md:col-span-2"><InputField label="نشانی" value={form.seller.address} onChange={(v) => updateSeller('address', v)} required /></div>
        </div>
      </div>
      <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900 flex items-center gap-2"><i className="fa-solid fa-user text-blue-600"></i> طرف دوم (خریدار / مستاجر)</h4>
          <select className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1" onChange={(e) => fillFromClient('buyer', e.target.value)}>
            <option value="">انتخاب از مشتریان...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="نام و نام خانوادگی" value={form.buyer.name} onChange={(v) => updateBuyer('name', v)} required />
          <InputField label="کد ملی" value={form.buyer.nationalId} onChange={(v) => updateBuyer('nationalId', v)} required />
          <InputField label="نام پدر" value={form.buyer.fatherName} onChange={(v) => updateBuyer('fatherName', v)} required />
          <InputField label="شماره شناسنامه" value={form.buyer.birthCertificate} onChange={(v) => updateBuyer('birthCertificate', v)} />
          <InputField label="شماره تلفن" value={form.buyer.phone} onChange={(v) => updateBuyer('phone', v)} required />
          <InputField label="کد پستی" value={form.buyer.postalCode} onChange={(v) => updateBuyer('postalCode', v)} />
          <div className="md:col-span-2"><InputField label="نشانی" value={form.buyer.address} onChange={(v) => updateBuyer('address', v)} required /></div>
        </div>
      </div>
    </div>
  );
}

function StepProperty({ form, setForm, properties }: { form: any; setForm: any; properties: any[] }) {
  const updateProperty = (f: string, v: any) => setForm({ ...form, property: { ...form.property, [f]: v } });
  const fillFromProperty = (propertyId: string) => {
    const p = properties.find(pr => pr.id === propertyId);
    if (p) setForm({ ...form, property: { ...form.property, type: p.type, area: p.area, address: p.address, floor: p.floor, hasParking: p.hasParking, hasElevator: p.hasElevator, hasStorage: p.hasStorage }, seller: { ...form.seller, name: p.ownerName, phone: p.ownerPhone } });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-900 flex items-center gap-2"><i className="fa-solid fa-building text-purple-600"></i> مشخصات ملک مورد معامله</h4>
        <select className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1" onChange={(e) => fillFromProperty(e.target.value)}>
          <option value="">انتخاب از ملک‌ها...</option>
          {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">نوع ملک</label>
          <select className="input-field" value={form.property.type} onChange={e => updateProperty('type', e.target.value)}>
            <option value="آپارتمان">آپارتمان</option><option value="ویلا">ویلا</option><option value="مغازه">مغازه</option><option value="زمین">زمین</option><option value="دفتر">دفتر</option><option value="انبار">انبار</option><option value="باغ">باغ</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">کاربری</label>
          <select className="input-field" value={form.property.usage} onChange={e => updateProperty('usage', e.target.value)}>
            <option value="مسکونی">مسکونی</option><option value="تجاری">تجاری</option><option value="اداری">اداری</option><option value="صنعتی">صنعتی</option><option value="کشاورزی">کشاورزی</option>
          </select>
        </div>
        <InputField label="پلاک ثبتی" value={form.property.registrationPlaque} onChange={(v) => updateProperty('registrationPlaque', v)} placeholder="مثال: ۱۲۳۴/۵۶" required />
        <InputField label="بخش ثبتی" value={form.property.registrationSection} onChange={(v) => updateProperty('registrationSection', v)} />
        <InputField label="مساحت (متر مربع)" value={form.property.area?.toString()} onChange={(v) => updateProperty('area', parseFloat(v) || 0)} type="number" required />
        <InputField label="طبقه" value={form.property.floor?.toString()} onChange={(v) => updateProperty('floor', parseInt(v) || 0)} type="number" />
        <InputField label="واحد / پلاک" value={form.property.unit} onChange={(v) => updateProperty('unit', v)} />
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">وضعیت حقوقی</label>
          <select className="input-field" value={form.property.legalStatus} onChange={e => updateProperty('legalStatus', e.target.value)}>
            <option value="آزاد">آزاد (بدون مانع)</option><option value="در رهن">در رهن بانک</option><option value="در بازداشت">در بازداشت</option><option value="موقوفه">موقوفه</option><option value="وصیتی">وصیتی</option>
          </select>
        </div>
        <div className="md:col-span-2"><InputField label="نشانی کامل ملک" value={form.property.address} onChange={(v) => updateProperty('address', v)} required /></div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">امکانات ملک</label>
        <div className="flex flex-wrap gap-3">
          {[{ key: 'hasParking', label: 'پارکینگ', icon: 'fa-car' }, { key: 'hasElevator', label: 'آسانسور', icon: 'fa-elevator' }, { key: 'hasStorage', label: 'انباری', icon: 'fa-box' }].map(a => (
            <label key={a.key} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100">
              <input type="checkbox" checked={form.property[a.key] || false} onChange={e => updateProperty(a.key, e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
              <i className={`fa-solid ${a.icon} text-gray-500 text-sm`}></i>
              <span className="text-sm text-gray-700">{a.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepFinancial({ form, setForm }: { form: any; setForm: any }) {
  const [newInst, setNewInst] = useState({ amount: 0, dueDate: '', description: '' });
  const addInstallment = () => {
    if (newInst.amount > 0 && newInst.dueDate) {
      setForm({ ...form, installments: [...(form.installments || []), { id: `INS-${Date.now()}`, amount: newInst.amount, dueDate: newInst.dueDate, description: newInst.description, paid: false }] });
      setNewInst({ amount: 0, dueDate: '', description: '' });
    }
  };
  const removeInstallment = (id: string) => setForm({ ...form, installments: form.installments.filter((i: PaymentInstallment) => i.id !== id) });
  const totalInst = (form.installments || []).reduce((s: number, i: PaymentInstallment) => s + i.amount, 0);
  const remaining = (form.totalPrice || 0) - totalInst;

  const autoCalcCommission = () => {
    const price = form.totalPrice || 0;
    let rate = 0.5;
    if (price > 10_000_000_000) rate = 0.3;
    else if (price > 5_000_000_000) rate = 0.4;
    setForm({ ...form, commissionRate: rate, commissionAmount: Math.round(price * (rate / 100)) });
  };

  return (
    <div className="space-y-5">
      <h4 className="font-bold text-gray-900 flex items-center gap-2"><i className="fa-solid fa-coins text-amber-600"></i> مبلغ و شرایط مالی (ثمن معامله)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CurrencyInput label="مبلغ کل معامله" value={form.totalPrice} onChange={(v) => setForm({ ...form, totalPrice: v })} required />
        <CurrencyInput label="پیش‌پرداخت / ودیعه" value={form.deposit} onChange={(v) => setForm({ ...form, deposit: v })} />
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-medium text-amber-900 text-sm">حق‌الزحمه مشاور املاک</h5>
          <button type="button" onClick={autoCalcCommission} className="text-xs bg-amber-600 text-white px-3 py-1 rounded-lg hover:bg-amber-700">محاسبه خودکار</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">نرخ کمیسیون (٪)</label>
            <input type="number" step="0.1" className="input-field" value={form.commissionRate || ''} onChange={e => setForm({ ...form, commissionRate: parseFloat(e.target.value) || 0 })} />
          </div>
          <CurrencyInput label="مبلغ کمیسیون" value={form.commissionAmount} onChange={(v) => setForm({ ...form, commissionAmount: v })} />
        </div>
      </div>
      <div>
        <h5 className="font-medium text-gray-900 text-sm mb-3">اقساط و نحوه پرداخت</h5>
        {(form.installments || []).length > 0 && (
          <div className="space-y-2 mb-4">
            {(form.installments || []).map((inst: PaymentInstallment, i: number) => (
              <div key={inst.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div className="flex-1"><p className="text-sm font-medium text-gray-800">{inst.description}</p><p className="text-xs text-gray-500">سررسید: {inst.dueDate}</p></div>
                <span className="text-sm font-bold text-gray-800">{formatPrice(inst.amount)}</span>
                <button onClick={() => removeInstallment(inst.id)} className="text-red-400 hover:text-red-600"><i className="fa-solid fa-xmark"></i></button>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">مجموع اقساط</span>
              <span className="text-sm font-bold text-blue-800">{formatPrice(totalInst)} ریال</span>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg ${remaining === 0 ? 'bg-green-50' : 'bg-amber-50'}`}>
              <span className={`text-sm font-medium ${remaining === 0 ? 'text-green-800' : 'text-amber-800'}`}>{remaining === 0 ? '✓ کامل' : 'باقیمانده'}</span>
              <span className={`text-sm font-bold ${remaining === 0 ? 'text-green-800' : 'text-amber-800'}`}>{formatPrice(Math.abs(remaining))} ریال</span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <CurrencyInput value={newInst.amount} onChange={(v) => setNewInst({ ...newInst, amount: v })} placeholder="مبلغ قسط" />
          <JalaliDatePicker value={newInst.dueDate} onChange={(v) => setNewInst({ ...newInst, dueDate: v })} placeholder="تاریخ سررسید" />
          <div className="flex gap-2">
            <input type="text" className="input-field flex-1" placeholder="توضیحات" value={newInst.description} onChange={e => setNewInst({ ...newInst, description: e.target.value })} />
            <button type="button" onClick={addInstallment} className="btn-primary px-3"><i className="fa-solid fa-plus"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepConditions({ form, setForm }: { form: any; setForm: any }) {
  return (
    <div className="space-y-5">
      <h4 className="font-bold text-gray-900 flex items-center gap-2"><i className="fa-solid fa-scale-balanced text-indigo-600"></i> شرایط و تعهدات قرارداد</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <JalaliDatePicker label="تاریخ تحویل ملک" value={form.deliveryDate} onChange={(v) => setForm({ ...form, deliveryDate: v })} />
        <JalaliDatePicker label="تاریخ تنظیم سند رسمی" value={form.transferDate} onChange={(v) => setForm({ ...form, transferDate: v })} />
        <div className="md:col-span-2"><InputField label="دفترخانه تنظیم سند" value={form.notaryOffice} onChange={(v) => setForm({ ...form, notaryOffice: v })} placeholder="دفترخانه شماره ..." /></div>
      </div>
      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
        <h5 className="font-medium text-red-900 text-sm mb-3 flex items-center gap-2"><i className="fa-solid fa-triangle-exclamation"></i> وجه التزام (خسارت تأخیر)</h5>
        <CurrencyInput label="خسارت روزانه تأخیر" value={form.penaltyPerDay} onChange={(v) => setForm({ ...form, penaltyPerDay: v })} />
        <p className="text-xs text-red-600 mt-2">در صورت عدم انجام تعهدات، طرف متخلف ملزم به پرداخت مبلغ فوق به ازای هر روز تأخیر می‌باشد.</p>
      </div>
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-medium text-purple-900 text-sm flex items-center gap-2"><i className="fa-solid fa-right-from-bracket"></i> حق فسخ (خیارات)</h5>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.hasRightOfRescission} onChange={e => setForm({ ...form, hasRightOfRescission: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-purple-600" />
            <span className="text-xs text-purple-700">فعال</span>
          </label>
        </div>
        {form.hasRightOfRescission && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <JalaliDatePicker label="مهلت استفاده از حق فسخ" value={form.rescissionDeadline} onChange={(v) => setForm({ ...form, rescissionDeadline: v })} />
            <CurrencyInput label="جریمه فسخ" value={form.rescissionPenalty} onChange={(v) => setForm({ ...form, rescissionPenalty: v })} />
          </div>
        )}
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.forceMajeure} onChange={e => setForm({ ...form, forceMajeure: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-gray-600" />
          <span className="text-sm font-medium text-gray-800">شرط فورس ماژور (حوادث قهری)</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">در صورت بروز حوادث غیرمترقبه، قرارداد به حالت تعلیق درآمده و پس از رفع مانع قابل اجرا خواهد بود.</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">شرایط خاص و توافقات جانبی</label>
        <textarea className="input-field h-24 resize-none" placeholder="هرگونه شرط یا توافق خاص..." value={form.specialConditions} onChange={e => setForm({ ...form, specialConditions: e.target.value })}></textarea>
      </div>
    </div>
  );
}

function StepSignatures({ form, setForm }: { form: any; setForm: any }) {
  return (
    <div className="space-y-5">
      <h4 className="font-bold text-gray-900 flex items-center gap-2"><i className="fa-solid fa-pen-nib text-green-600"></i> شهود و امضاکنندگان</h4>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <div className="flex items-start gap-3"><i className="fa-solid fa-circle-info text-amber-600 mt-1"></i><p className="text-xs text-amber-700">طبق قانون، قولنامه باید حداقل توسط دو شاهد معتبر امضا شود.</p></div>
      </div>
      <div className="border border-gray-200 rounded-xl p-4">
        <h5 className="font-medium text-gray-900 text-sm mb-3">شاهد اول</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="نام و نام خانوادگی" value={form.witness1Name} onChange={(v) => setForm({ ...form, witness1Name: v })} required />
          <InputField label="کد ملی" value={form.witness1NationalId} onChange={(v) => setForm({ ...form, witness1NationalId: v })} required />
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl p-4">
        <h5 className="font-medium text-gray-900 text-sm mb-3">شاهد دوم</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="نام و نام خانوادگی" value={form.witness2Name} onChange={(v) => setForm({ ...form, witness2Name: v })} required />
          <InputField label="کد ملی" value={form.witness2NationalId} onChange={(v) => setForm({ ...form, witness2NationalId: v })} required />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">یادداشت داخلی</label>
        <textarea className="input-field h-16 resize-none" placeholder="یادداشت‌های داخلی (در قولنامه چاپ نمی‌شود)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}></textarea>
      </div>
    </div>
  );
}

function StepPreview({ form }: { form: Agreement }) {
  return (
    <div id="agreement-preview" className="bg-white border-2 border-gray-300 rounded-xl p-6 max-h-[500px] overflow-y-auto">
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
        <h3 className="text-xl font-bold text-gray-900">بسمه تعالی</h3>
        <h4 className="text-lg font-bold text-gray-800 mt-2">قولنامه / {form.type === 'فروش' ? 'مبایعه‌نامه' : form.type === 'اجاره' ? 'اجاره‌نامه' : 'قرارداد ' + form.type}</h4>
        <p className="text-xs text-gray-500 mt-1">شماره: {form.agreementNumber || '...'} | کد رهگیری: {form.trackingCode || '...'} | تاریخ: {form.date}</p>
      </div>
      <div className="space-y-4 text-sm text-gray-800 leading-7">
        <div>
          <h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۱: طرفین قرارداد</h5>
          <p><strong>طرف اول (فروشنده):</strong> آقای/خانم {form.seller?.name} فرزند {form.seller?.fatherName} به شماره شناسنامه {form.seller?.birthCertificate} و کد ملی {form.seller?.nationalId} نشانی: {form.seller?.address}</p>
          <p className="mt-1"><strong>طرف دوم (خریدار):</strong> آقای/خانم {form.buyer?.name} فرزند {form.buyer?.fatherName} به شماره شناسنامه {form.buyer?.birthCertificate} و کد ملی {form.buyer?.nationalId} نشانی: {form.buyer?.address}</p>
        </div>
        <div>
          <h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۲: موضوع قرارداد و مشخصات ملک</h5>
          <p>{form.property?.type} به مساحت {form.property?.area} متر مربع، پلاک ثبتی {form.property?.registrationPlaque} بخش {form.property?.registrationSection}، واقع در {form.property?.address} با وضعیت حقوقی {form.property?.legalStatus}</p>
        </div>
        <div>
          <h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۳: ثمن معامله</h5>
          <p>مبلغ کل {formatPrice(form.totalPrice || 0)} ریال که به شرح زیر پرداخت می‌گردد:</p>
          <ul className="list-disc pr-5 mt-2">
            {(form.installments || []).map((inst, i) => (<li key={i}>قسط {i + 1}: مبلغ {formatPrice(inst.amount)} ریال در تاریخ {inst.dueDate} - {inst.description}</li>))}
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۴: تحویل و انتقال سند</h5>
          <p>فروشنده متعهد است ملک را در تاریخ {form.deliveryDate} تحویل دهد. طرفین در تاریخ {form.transferDate} در {form.notaryOffice} حاضر خواهند شد.</p>
        </div>
        <div>
          <h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۵: خسارت تأخیر</h5>
          <p>در صورت عدم انجام تعهدات، طرف متخلف روزانه مبلغ {formatPrice(form.penaltyPerDay || 0)} ریال خسارت پرداخت می‌نماید.</p>
        </div>
        {form.hasRightOfRescission && (<div><h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۶: حق فسخ</h5><p>طرفین تا تاریخ {form.rescissionDeadline} حق فسخ با پرداخت {formatPrice(form.rescissionPenalty || 0)} ریال دارند.</p></div>)}
        {form.forceMajeure && (<div><h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۷: فورس ماژور</h5><p>در صورت بروز حوادث قهری، قرارداد به حالت تعلیق درآمده و پس از رفع مانع قابل اجرا خواهد بود.</p></div>)}
        {form.specialConditions && (<div><h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۸: شرایط خاص</h5><p>{form.specialConditions}</p></div>)}
        <div>
          <h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۹: حق‌الزحمه مشاور</h5>
          <p>مبلغ {formatPrice(form.commissionAmount || 0)} ریال معادل {form.commissionRate}٪ به عنوان حق‌الزحمه پرداخت گردید.</p>
        </div>
        <div>
          <h5 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1">ماده ۱۰: حل اختلاف</h5>
          <p>اختلافات از طریق مذاکره و در صورت عدم سازش، از طریق مراجع قضایی پیگیری می‌شود.</p>
        </div>
        <div className="mt-6 pt-4 border-t-2 border-gray-300">
          <p className="text-xs text-gray-600 text-center mb-4">این قرارداد در ۱۰ ماده و در ۳ نسخه تنظیم گردید.</p>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="border border-gray-300 rounded-lg p-3"><p className="text-xs font-bold mb-8">امضاء فروشنده</p><p className="text-[10px] text-gray-500">{form.seller?.name}</p></div>
            <div className="border border-gray-300 rounded-lg p-3"><p className="text-xs font-bold mb-8">امضاء خریدار</p><p className="text-[10px] text-gray-500">{form.buyer?.name}</p></div>
            <div className="border border-gray-300 rounded-lg p-3"><p className="text-xs font-bold mb-8">امضاء شاهد ۱</p><p className="text-[10px] text-gray-500">{form.witness1Name}</p></div>
            <div className="border border-gray-300 rounded-lg p-3"><p className="text-xs font-bold mb-8">امضاء شاهد ۲</p><p className="text-[10px] text-gray-500">{form.witness2Name}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ View ============
function AgreementView({ agreement, onClose, onPrint }: { agreement: Agreement; onClose: () => void; onPrint: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div><h3 className="text-lg font-bold text-gray-900">مشاهده قولنامه {agreement.agreementNumber}</h3><p className="text-xs text-gray-500 mt-1">کد رهگیری: {agreement.trackingCode}</p></div>
          <div className="flex items-center gap-2">
            <button onClick={onPrint} className="btn-secondary flex items-center gap-2"><i className="fa-solid fa-print"></i> چاپ</button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6"><StepPreview form={agreement} /></div>
      </div>
    </div>
  );
}

// ============ Print ============
function AgreementPrint({ agreement, onClose }: { agreement: Agreement; onClose: () => void }) {
  const handlePrint = () => {
    const printContent = document.getElementById('agreement-print-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>قولنامه - ${agreement.agreementNumber}</title>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { font-family: 'Vazirmatn', sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
          body { padding: 40px; direction: rtl; line-height: 2; }
          .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { font-size: 24px; margin-bottom: 10px; }
          .header h2 { font-size: 18px; margin-bottom: 5px; }
          .header p { font-size: 12px; color: #666; }
          .section { margin-bottom: 20px; }
          .section h3 { font-size: 14px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
          .section p { font-size: 13px; text-align: justify; }
          .signatures { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 40px; border-top: 2px solid #333; padding-top: 20px; }
          .sig-box { border: 1px solid #999; padding: 15px; text-align: center; min-height: 120px; }
          .sig-box p { font-size: 11px; font-weight: bold; margin-bottom: 60px; }
          .sig-box span { font-size: 10px; color: #666; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>بسمه تعالی</h1>
          <h2>قولنامه / ${agreement.type === 'فروش' ? 'مبایعه‌نامه' : agreement.type === 'اجاره' ? 'اجاره‌نامه' : 'قرارداد ' + agreement.type}</h2>
          <p>شماره: ${agreement.agreementNumber} | کد رهگیری: ${agreement.trackingCode} | تاریخ: ${agreement.date}</p>
        </div>
        <div class="section">
          <h3>ماده ۱: طرفین قرارداد</h3>
          <p><strong>طرف اول (فروشنده):</strong> آقای/خانم ${agreement.seller?.name} فرزند ${agreement.seller?.fatherName} به شماره شناسنامه ${agreement.seller?.birthCertificate} و کد ملی ${agreement.seller?.nationalId} نشانی: ${agreement.seller?.address}</p>
          <p style="margin-top:8px"><strong>طرف دوم (خریدار):</strong> آقای/خانم ${agreement.buyer?.name} فرزند ${agreement.buyer?.fatherName} به شماره شناسنامه ${agreement.buyer?.birthCertificate} و کد ملی ${agreement.buyer?.nationalId} نشانی: ${agreement.buyer?.address}</p>
        </div>
        <div class="section">
          <h3>ماده ۲: موضوع قرارداد و مشخصات ملک</h3>
          <p>${agreement.property?.type} به مساحت ${agreement.property?.area} متر مربع، پلاک ثبتی ${agreement.property?.registrationPlaque} بخش ${agreement.property?.registrationSection}، واقع در ${agreement.property?.address} با وضعیت حقوقی ${agreement.property?.legalStatus}</p>
        </div>
        <div class="section">
          <h3>ماده ۳: ثمن معامله</h3>
          <p>مبلغ کل ${formatPrice(agreement.totalPrice || 0)} ریال که به شرح زیر پرداخت می‌گردد:</p>
          <ul style="padding-right:20px; margin-top:8px">
            ${(agreement.installments || []).map((inst, i) => `<li>قسط ${i + 1}: مبلغ ${formatPrice(inst.amount)} ریال در تاریخ ${inst.dueDate} - ${inst.description}</li>`).join('')}
          </ul>
        </div>
        <div class="section">
          <h3>ماده ۴: تحویل و انتقال سند</h3>
          <p>فروشنده متعهد است ملک را در تاریخ ${agreement.deliveryDate} تحویل دهد. طرفین در تاریخ ${agreement.transferDate} در ${agreement.notaryOffice} حاضر خواهند شد.</p>
        </div>
        <div class="section">
          <h3>ماده ۵: خسارت تأخیر</h3>
          <p>در صورت عدم انجام تعهدات، طرف متخلف روزانه مبلغ ${formatPrice(agreement.penaltyPerDay || 0)} ریال خسارت پرداخت می‌نماید.</p>
        </div>
        ${agreement.hasRightOfRescission ? `<div class="section"><h3>ماده ۶: حق فسخ</h3><p>طرفین تا تاریخ ${agreement.rescissionDeadline} حق فسخ با پرداخت ${formatPrice(agreement.rescissionPenalty || 0)} ریال دارند.</p></div>` : ''}
        ${agreement.forceMajeure ? `<div class="section"><h3>ماده ۷: فورس ماژور</h3><p>در صورت بروز حوادث قهری، قرارداد به حالت تعلیق درآمده و پس از رفع مانع قابل اجرا خواهد بود.</p></div>` : ''}
        ${agreement.specialConditions ? `<div class="section"><h3>ماده ۸: شرایط خاص</h3><p>${agreement.specialConditions}</p></div>` : ''}
        <div class="section">
          <h3>ماده ۹: حق‌الزحمه مشاور</h3>
          <p>مبلغ ${formatPrice(agreement.commissionAmount || 0)} ریال معادل ${agreement.commissionRate}٪ به عنوان حق‌الزحمه پرداخت گردید.</p>
        </div>
        <div class="section">
          <h3>ماده ۱۰: حل اختلاف</h3>
          <p>اختلافات از طریق مذاکره و در صورت عدم سازش، از طریق مراجع قضایی پیگیری می‌شود.</p>
        </div>
        <p style="text-align:center; font-size:12px; margin-top:30px; border-top:2px solid #333; padding-top:15px">این قرارداد در ۱۰ ماده و در ۳ نسخه تنظیم گردید که همگی دارای حکم واحد می‌باشند.</p>
        <div class="signatures">
          <div class="sig-box"><p>امضاء فروشنده</p><span>${agreement.seller?.name}</span></div>
          <div class="sig-box"><p>امضاء خریدار</p><span>${agreement.buyer?.name}</span></div>
          <div class="sig-box"><p>امضاء شاهد ۱</p><span>${agreement.witness1Name}</span></div>
          <div class="sig-box"><p>امضاء شاهد ۲</p><span>${agreement.witness2Name}</span></div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between print:hidden">
          <h3 className="text-lg font-bold text-gray-900">پیش‌نمایش چاپ قولنامه</h3>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="btn-primary flex items-center gap-2"><i className="fa-solid fa-print"></i> چاپ / ذخیره PDF</button>
            <button onClick={onClose} className="btn-secondary">بستن</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8" id="agreement-print-content">
            <StepPreview form={agreement} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Helpers ============
function InputField({ label, value, onChange, type = 'text', placeholder, required }: { label: string; value: string | number | undefined; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label} {required && <span className="text-red-500">*</span>}</label>
      <input type={type} className="input-field" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
