import { formatCurrency, parseCurrencyInput } from '../utils/helpers';

interface CurrencyInputProps {
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  suffix?: string;
}

export default function CurrencyInput({ value, onChange, placeholder = '۰', label, required, suffix = 'ریال' }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseCurrencyInput(e.target.value);
    onChange(numValue);
  };

  const displayValue = typeof value === 'number' && value > 0 ? formatCurrency(value) : '';

  return (
    <div>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          className="input-field pl-16"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {suffix}
        </span>
      </div>
    </div>
  );
}
