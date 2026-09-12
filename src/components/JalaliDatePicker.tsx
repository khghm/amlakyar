import { useState, useRef, useEffect } from 'react';
import {
  gregorianToJalali,
  jalaliToGregorian,
  jalaliMonthLength,
  getJalaliDayOfWeek,
  formatJalaliDate,
  parseJalaliDate,
  jalaliMonthNames,
  jalaliWeekDays,
} from '../utils/jalali';

interface JalaliDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function JalaliDatePicker({ value, onChange, placeholder = '۱۴۰۲/۰۹/۲۰', label, required }: JalaliDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current view date
  const parsed = parseJalaliDate(value);
  const now = new Date();
  const [todayJy, todayJm, todayJd] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  
  const [viewYear, setViewYear] = useState(parsed ? parsed[0] : todayJy);
  const [viewMonth, setViewMonth] = useState(parsed ? parsed[1] : todayJm);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const goToPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToToday = () => {
    setViewYear(todayJy);
    setViewMonth(todayJm);
    onChange(formatJalaliDate(todayJy, todayJm, todayJd));
    setIsOpen(false);
  };

  const selectDay = (day: number) => {
    const dateStr = formatJalaliDate(viewYear, viewMonth, day);
    onChange(dateStr);
    setIsOpen(false);
  };

  // Build calendar grid
  const daysInMonth = jalaliMonthLength(viewYear, viewMonth);
  const firstDayOfWeek = getJalaliDayOfWeek(viewYear, viewMonth, 1); // 0=Sun
  // Convert to Shamsi week (starts with Saturday=0)
  const startOffset = (firstDayOfWeek + 1) % 7;

  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const selectedParsed = parseJalaliDate(value);
  const isSelected = (day: number) => 
    selectedParsed && selectedParsed[0] === viewYear && selectedParsed[1] === viewMonth && selectedParsed[2] === day;
  
  const isToday = (day: number) => 
    todayJy === viewYear && todayJm === viewMonth && todayJd === day;

  // Convert number to Persian digits
  const toPersian = (n: number | string) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="input-field cursor-pointer flex items-center justify-between"
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <i className="fa-regular fa-calendar text-gray-400"></i>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl border border-gray-200 shadow-xl z-50 w-72 p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={goToNextMonth} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <i className="fa-solid fa-chevron-right text-xs text-gray-600"></i>
            </button>
            <div className="text-center">
              <span className="text-sm font-bold text-gray-800">
                {jalaliMonthNames[viewMonth - 1]} {toPersian(viewYear)}
              </span>
            </div>
            <button type="button" onClick={goToPrevMonth} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <i className="fa-solid fa-chevron-left text-xs text-gray-600"></i>
            </button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {jalaliWeekDays.map((day, i) => (
              <div key={i} className={`text-center text-xs font-medium py-1 ${i === 5 ? 'text-red-500' : 'text-gray-500'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (day === null) return <div key={i}></div>;
              const dayOfWeek = (i % 7);
              const isFriday = dayOfWeek === 5;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    isSelected(day)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isToday(day)
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                      : isFriday
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {toPersian(day)}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={goToToday}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              امروز
            </button>
            {value && (
              <button
                type="button"
                onClick={() => { onChange(''); setIsOpen(false); }}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                پاک کردن
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
