import { useState } from 'react';

interface CommissionRecord {
  id: string;
  contractId: string;
  type: string;
  property: string;
  amount: string;
  commission: string;
  agent: string;
  status: string;
  statusColor: string;
  date: string;
}

const commissionRecords: CommissionRecord[] = [
  { id: 'COM-001', contractId: 'C-1402-089', type: 'فروش', property: 'آپارتمان سعادت‌آباد', amount: '۸,۵۰۰,۰۰۰,۰۰۰', commission: '۱۲۷,۵۰۰,۰۰۰', agent: 'محمد احمدی', status: 'دریافت شده', statusColor: 'green', date: '۱۴۰۲/۰۹/۱۵' },
  { id: 'COM-002', contractId: 'C-1402-088', type: 'اجاره', property: 'ویلا لواسان', amount: '۴۵,۰۰۰,۰۰۰', commission: '۲۲,۵۰۰,۰۰۰', agent: 'سارا رحیمی', status: 'دریافت شده', statusColor: 'green', date: '۱۴۰۲/۰۹/۱۴' },
  { id: 'COM-003', contractId: 'C-1402-087', type: 'فروش', property: 'مغازه ونک', amount: '۳,۲۰۰,۰۰۰,۰۰۰', commission: '۴۸,۰۰۰,۰۰۰', agent: 'محمد احمدی', status: 'در انتظار', statusColor: 'amber', date: '۱۴۰۲/۰۹/۱۳' },
  { id: 'COM-004', contractId: 'C-1402-084', type: 'اجاره', property: 'آپارتمان تجریش', amount: '۲۵,۰۰۰,۰۰۰', commission: '۱۲,۵۰۰,۰۰۰', agent: 'علی موسوی', status: 'دریافت شده', statusColor: 'green', date: '۱۴۰۲/۰۹/۰۸' },
];

export default function Commissions() {
  const [calcType, setCalcType] = useState<'sale' | 'rent'>('sale');
  const [propertyPrice, setPropertyPrice] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [deposit, setDeposit] = useState('');
  const [calculatedCommission, setCalculatedCommission] = useState<string | null>(null);

  const calculateCommission = () => {
    if (calcType === 'sale') {
      const price = parseFloat(propertyPrice.replace(/,/g, '')) || 0;
      // Commission rate: 0.5% for sale (standard in Iran)
      const commission = price * 0.005;
      setCalculatedCommission(formatNumber(commission));
    } else {
      const rent = parseFloat(rentAmount.replace(/,/g, '')) || 0;
      const dep = parseFloat(deposit.replace(/,/g, '')) || 0;
      // Commission for rent: convert deposit to monthly equivalent, then calculate
      // Standard: 1/4 of monthly rent + deposit conversion
      const monthlyEquiv = dep / 1000000 * 0.04; // Simplified conversion
      const commission = (rent * 0.25) + (monthlyEquiv * 1000000);
      setCalculatedCommission(formatNumber(commission));
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('fa-IR');
  };

  const totalCommission = '۲۱۰,۵۰۰,۰۰۰';
  const receivedCommission = '۱۶۲,۵۰۰,۰۰۰';
  const pendingCommission = '۴۸,۰۰۰,۰۰۰';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">محاسبه و مدیریت کمیسیون</h2>
        <p className="text-sm text-gray-500 mt-1">محاسبه خودکار کمیسیون بر اساس نرخ اتحادیه</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card border-r-4 border-r-green-500">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-coins text-green-600"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{totalCommission}</p>
              <p className="text-xs text-gray-500">کل کمیسیون ماهانه (ریال)</p>
            </div>
          </div>
        </div>
        <div className="stat-card border-r-4 border-r-blue-500">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-circle-check text-blue-600"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{receivedCommission}</p>
              <p className="text-xs text-gray-500">دریافت شده (ریال)</p>
            </div>
          </div>
        </div>
        <div className="stat-card border-r-4 border-r-amber-500">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-clock text-amber-600"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{pendingCommission}</p>
              <p className="text-xs text-gray-500">در انتظار دریافت (ریال)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-calculator text-blue-600"></i>
            ماشین حساب کمیسیون
          </h3>
          
          {/* Type Selector */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
            <button
              onClick={() => { setCalcType('sale'); setCalculatedCommission(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                calcType === 'sale' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
              }`}
            >
              فروش / خرید
            </button>
            <button
              onClick={() => { setCalcType('rent'); setCalculatedCommission(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                calcType === 'rent' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
              }`}
            >
              اجاره / رهن
            </button>
          </div>

          <div className="space-y-4">
            {calcType === 'sale' ? (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">مبلغ معامله (ریال)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="مثال: ۸,۵۰۰,۰۰۰,۰۰۰"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">نرخ کمیسیون: ۰.۵٪ مبلغ کل معامله</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">مبلغ اجاره ماهانه (ریال)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="مثال: ۲۵,۰۰۰,۰۰۰"
                    value={rentAmount}
                    onChange={(e) => setRentAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">مبلغ رهن / ودیعه (ریال)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="مثال: ۳۰۰,۰۰۰,۰۰۰"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">نرخ تبدیل: هر ۱ میلیون تومان رهن = ۴۰ هزار تومان اجاره ماهانه</p>
                </div>
              </>
            )}
            
            <button onClick={calculateCommission} className="btn-primary w-full">
              <i className="fa-solid fa-calculator ml-2"></i>
              محاسبه کمیسیون
            </button>

            {calculatedCommission && (
              <div className="bg-gradient-to-l from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">کمیسیون محاسبه شده</p>
                    <p className="text-xs text-green-600 mt-0.5">سهم هر طرف (خریدار/فروشنده)</p>
                  </div>
                  <p className="text-xl font-bold text-green-800">{calculatedCommission} <span className="text-sm font-normal">ریال</span></p>
                </div>
              </div>
            )}
          </div>

          {/* Rate Table */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">نرخ‌نامه اتحادیه</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">فروش تا ۵ میلیارد</span>
                <span className="font-medium text-gray-800">۰.۵٪</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">فروش ۵ تا ۱۰ میلیارد</span>
                <span className="font-medium text-gray-800">۰.۴٪</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">فروش بالای ۱۰ میلیارد</span>
                <span className="font-medium text-gray-800">۰.۳٪</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">اجاره (ماهانه)</span>
                <span className="font-medium text-gray-800">۲۵٪ اجاره</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">تبدیل رهن به اجاره</span>
                <span className="font-medium text-gray-800">ضریب ۰.۰۴</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Records */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-amber-600"></i>
            سوابق کمیسیون
          </h3>
          <div className="space-y-3">
            {commissionRecords.map((record) => (
              <div key={record.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${
                      record.type === 'فروش' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                    }`}>
                      {record.type}
                    </span>
                    <span className="text-xs text-gray-400">{record.contractId}</span>
                  </div>
                  <span className={`badge ${
                    record.statusColor === 'green' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800">{record.property}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400">مبلغ قرارداد</p>
                      <p className="text-xs font-medium text-gray-700">{record.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">کمیسیون</p>
                      <p className="text-xs font-bold text-green-700">{record.commission}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">مشاور</p>
                    <p className="text-xs text-gray-700">{record.agent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chart-pie text-purple-600"></i>
          عملکرد مشاورین
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'محمد احمدی', deals: 8, commission: '۱۲۷.۵M', percentage: 60, color: 'blue' },
            { name: 'سارا رحیمی', deals: 5, commission: '۵۵M', percentage: 26, color: 'green' },
            { name: 'علی موسوی', deals: 3, commission: '۲۸M', percentage: 14, color: 'amber' },
          ].map((agent, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  agent.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  agent.color === 'green' ? 'bg-green-100 text-green-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  <i className="fa-solid fa-user text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.deals} معامله</p>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">سهم از کل کمیسیون</span>
                  <span className="font-medium text-gray-700">{agent.percentage}٪</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      agent.color === 'blue' ? 'bg-blue-500' :
                      agent.color === 'green' ? 'bg-green-500' :
                      'bg-amber-500'
                    }`}
                    style={{ width: `${agent.percentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-800 mt-2">{agent.commission} <span className="text-xs font-normal text-gray-500">ریال</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
