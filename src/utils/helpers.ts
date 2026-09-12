export const formatPrice = (price: number): string => {
  if (price >= 1_000_000_000) {
    const billions = price / 1_000_000_000;
    const formatted = billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1);
    return `${toPersianDigits(formatted)} میلیارد`;
  }
  if (price >= 1_000_000) {
    return `${toPersianDigits((price / 1_000_000).toFixed(0))} میلیون`;
  }
  if (price >= 1_000) {
    return `${toPersianDigits((price / 1_000).toFixed(0))} هزار`;
  }
  return toPersianDigits(price.toLocaleString('en-US'));
};

// Format number with Persian thousands separator
export const formatCurrency = (value: number | string): string => {
  const num = typeof value === 'string' ? parseInt(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '';
  return toPersianDigits(num.toLocaleString('en-US'));
};

// Parse currency input (remove separators and convert Persian digits)
export const parseCurrencyInput = (value: string): number => {
  const cleaned = value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[,،\s]/g, '');
  return parseInt(cleaned) || 0;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('fa-IR');
};

export const toPersianDigits = (str: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

export const parsePersianNumber = (str: string): number => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const result = str.replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)));
  return parseFloat(result.replace(/,/g, '')) || 0;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'فعال': case 'تایید شده': case 'دریافت شده': case 'انجام شده': return 'green';
    case 'در انتظار تایید': case 'در حال مذاکره': case 'در حال بررسی': case 'در انتظار': case 'برنامه‌ریزی شده': return 'amber';
    case 'پیش‌نویس': case 'پیگیری': return 'blue';
    case 'رد شده': case 'غیرفعال': case 'لغو شده': return 'red';
    default: return 'gray';
  }
};

export const getStatusBg = (color: string): string => {
  switch (color) {
    case 'green': return 'bg-green-50 text-green-700';
    case 'amber': return 'bg-amber-50 text-amber-700';
    case 'blue': return 'bg-blue-50 text-blue-700';
    case 'red': return 'bg-red-50 text-red-700';
    case 'purple': return 'bg-purple-50 text-purple-700';
    default: return 'bg-gray-50 text-gray-700';
  }
};
