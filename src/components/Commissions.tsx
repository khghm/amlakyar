import { useState } from 'react';
import { useData } from '../store/DataContext';
import { formatPrice, formatNumber } from '../utils/helpers';

export default function Commissions() {
  const { contracts, agents, updateContract } = useData();
  const [calcType, setCalcType] = useState<'sale' | 'rent'>('sale');
  const [propertyPrice, setPropertyPrice] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [deposit, setDeposit] = useState('');
  const [calculatedCommission, setCalculatedCommission] = useState<{total: number; perSide: number} | null>(null);

  const approvedContracts = contracts.filter(c => c.status === 'تایید شده');
  const pendingContracts = contracts.filter(c => c.status === 'در انتظار تایید' || c.status === 'پیش‌نویس');
  
  const totalCommission = approvedContracts.reduce((sum, c) => sum + c.commission, 0);
  const pendingCommission = pendingContracts.reduce((sum, c) => sum + c.commission, 0);
  const receivedCommission = totalCommission;

  const calculateCommission = () => {
    if (calcType === 'sale') {
      const price = parseFloat(propertyPrice.replace(/,/g, '')) || 0;
      let rate = 0.5;
      if (price > 10_000_000_000) rate = 0.3;
      else if (price > 5_000_000_000) rate = 0.4;
      const total = price * (rate / 100);
      setCalculatedCommission({ total, perSide: total / 2 });
    } else {
      const rent = parseFloat(rentAmount.replace(/,/g, '')) || 0;
      const dep = parseFloat(deposit.replace(/,/g, '')) || 0;
      const monthlyEquiv = dep * 0.0004;
      const totalMonthly = rent + monthlyEquiv;
      const total = totalMonthly * 0.25;
      setCalculatedCommission({ total, perSide: total / 2 });
    }
  };

  const resetCalculator = () => {
    setPropertyPrice('');
    setRentAmount('');
    setDeposit('');
    setCalculatedCommission(null);
  };

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-coins text-green-600 text-lg"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{formatPrice(totalCommission)}</p>
              <p className="text-xs text-gray-500">کل کمیسیون (ریال)</p>
            </div>
          </div>
        </div>
        <div className="stat-card border-r-4 border-r-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-circle-check text-blue-600 text-lg"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{formatPrice(receivedCommission)}</p>
              <p className="text-xs text-gray-500">دریافت شده (ریال)</p>
            </div>
          </div>
        </div>
        <div className="stat-card border-r-4 border-r-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-clock text-amber-600 text-lg"></i>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{formatPrice(pendingCommission)}</p>
              <p className="text-xs text-gray-500">در انتظار (ریال)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator & Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-calculator text-blue-600"></i>
            ماشین حساب کمیسیون
          </h3>
          
          {/* Type Selector */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
            <button
              onClick={() => { setCalcType('sale'); resetCalculator(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${calcType === 'sale' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              فروش / خرید
            </button>
            <button
              onClick={() => { setCalcType('rent'); resetCalculator(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${calcType === 'rent' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
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
                  className="input-field text-lg"
                  placeholder="مثال: ۸,۵۰۰,۰۰۰,۰۰۰"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  نرخ کمیسیون: {
                    (() => {
                      const price = parseFloat(propertyPrice.replace(/,/g, '')) || 0;
                      if (price > 10_000_000_000) return '۰.۳٪';
                      if (price > 5_000_000_000) return '۰.۴٪';
                      return '۰.۵٪';
                    })()
                  } مبلغ کل معامله
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">مبلغ اجاره ماهانه (ریال)</label>
                  <input type="text" className="input-field text-lg" placeholder="مثال: ۲۵,۰۰۰,۰۰۰" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">مبلغ رهن / ودیعه (ریال)</label>
                  <input type="text" className="input-field text-lg" placeholder="مثال: ۳۰۰,۰۰۰,۰۰۰" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">ضریب تبدیل: هر ۱ ریال رهن = ۰.۰۰۰۴ ریال اجاره ماهانه</p>
                </div>
              </>
            )}
            
            <button onClick={calculateCommission} className="btn-primary w-full">
              <i className="fa-solid fa-calculator ml-2"></i>
              محاسبه کمیسیون
            </button>

            {calculatedCommission && (
              <div className="space-y-3">
                <div className="bg-gradient-to-l from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-green-700 font-medium">کل کمیسیون</p>
                    <p className="text-xl font-bold text-green-800">{formatPrice(calculatedCommission.total)} ریال</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-green-100">
                    <p className="text-sm text-green-700">سهم هر طرف</p>
                    <p className="text-lg font-bold text-green-800">{formatPrice(calculatedCommission.perSide)} ریال</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
                  <i className="fa-solid fa-circle-info text-blue-600"></i>
                  <p className="text-xs text-blue-700">مبلغ فوق شامل ۹٪ مالیات بر ارزش افزوده نمی‌باشد.</p>
                </div>
              </div>
            )}
          </div>

          {/* Rate Table */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">نرخ‌نامه اتحادیه املاک</h4>
            <div className="space-y-2">
              {[
                { label: 'فروش تا ۵ میلیارد', rate: '۰.۵٪' },
                { label: 'فروش ۵ تا ۱۰ میلیارد', rate: '۰.۴٪' },
                { label: 'فروش بالای ۱۰ میلیارد', rate: '۰.۳٪' },
                { label: 'اجاره (ماهانه)', rate: '۲۵٪ اجاره' },
                { label: 'تبدیل رهن به اجاره', rate: 'ضریب ۰.۰۰۰۴' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{item.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commission Records */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-amber-600"></i>
            سوابق کمیسیون قراردادها
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {contracts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">قراردادی ثبت نشده است</p>
            ) : (
              contracts.map((contract) => (
                <div key={contract.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`badge ${
                        contract.type === 'فروش' ? 'bg-blue-50 text-blue-700' :
                        contract.type === 'اجاره' ? 'bg-green-50 text-green-700' :
                        contract.type === 'رهن' ? 'bg-purple-50 text-purple-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>{contract.type}</span>
                      <span className="text-xs text-gray-400">{contract.id}</span>
                    </div>
                    <span className={`badge ${
                      contract.status === 'تایید شده' ? 'bg-green-50 text-green-700' :
                      contract.status === 'در انتظار تایید' ? 'bg-amber-50 text-amber-700' :
                      contract.status === 'پیش‌نویس' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>{contract.status}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{contract.propertyTitle}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[10px] text-gray-400">مبلغ قرارداد</p>
                        <p className="text-xs font-medium text-gray-700">{formatPrice(contract.amount)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">کمیسیون</p>
                        <p className="text-xs font-bold text-green-700">{formatPrice(contract.commission)}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">مشاور</p>
                      <p className="text-xs text-gray-700">{contract.agentName}</p>
                    </div>
                  </div>
                  {contract.status === 'پیش‌نویس' && (
                    <button 
                      onClick={() => updateContract(contract.id, { status: 'در انتظار تایید' })}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <i className="fa-solid fa-paper-plane ml-1"></i>
                      ارسال برای تایید
                    </button>
                  )}
                </div>
              ))
            )}
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
          {agents.map((agent) => {
            const agentContracts = contracts.filter(c => c.agentId === agent.id);
            const agentCommission = agentContracts.reduce((sum, c) => sum + c.commission, 0);
            const percentage = totalCommission > 0 ? Math.round((agentCommission / totalCommission) * 100) : 0;
            return (
              <div key={agent.id} className="p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {agent.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.role} • {agentContracts.length} قرارداد</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">سهم از کل کمیسیون</span>
                    <span className="font-medium text-gray-700">{formatNumber(percentage)}٪</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-blue-500 to-indigo-600 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <p className="text-sm font-bold text-gray-800">{formatPrice(agentCommission)} <span className="text-xs font-normal text-gray-500">ریال</span></p>
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                    <span className="text-xs text-gray-600">{agent.rating}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
