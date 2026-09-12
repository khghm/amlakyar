import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============ Types ============
export interface Property {
  id: string;
  title: string;
  type: 'آپارتمان' | 'ویلا' | 'مغازه' | 'زمین' | 'دفتر';
  dealType: 'فروش' | 'اجاره' | 'رهن';
  area: number;
  rooms: number;
  price: number;
  deposit?: number;
  address: string;
  district: string;
  floor?: number;
  hasParking: boolean;
  hasElevator: boolean;
  hasStorage: boolean;
  description: string;
  images: string[];
  status: 'فعال' | 'فروش رفته' | 'اجاره رفته' | 'غیرفعال';
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  type: 'فروش' | 'اجاره' | 'رهن' | 'مشارکت';
  propertyId: string;
  propertyTitle: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientNationalId: string;
  ownerName: string;
  ownerPhone: string;
  amount: number;
  deposit?: number;
  commissionRate: number;
  commission: number;
  agentId: string;
  agentName: string;
  status: 'پیش‌نویس' | 'در انتظار تایید' | 'تایید شده' | 'رد شده' | 'لغو شده';
  trackingCode?: string;
  govStatus?: 'ارسال نشده' | 'در حال بررسی' | 'تایید شده' | 'رد شده';
  agreementId?: string; // ارتباط با قولنامه
  notes: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  nationalId: string;
  type: 'خریدار' | 'فروشنده' | 'مستاجر' | 'موجر' | 'سرمایه‌گذار';
  interest: string;
  budget: string;
  budgetValue: number;
  status: 'فعال' | 'در حال مذاکره' | 'پیگیری' | 'تکمیل شده' | 'غیرفعال';
  source: 'وب‌سایت' | 'معرفی' | 'تبلیغات' | 'حضوری' | 'تلفنی';
  notes: string;
  tags: string[];
  lastContact: string;
  nextFollowUp?: string;
  createdAt: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  type: 'تماس' | 'بازدید' | 'پیام' | 'جلسه' | 'یادداشت';
  text: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'بازدید' | 'جلسه' | 'پیگیری' | 'امضا' | 'تسلیمر';
  clientId?: string;
  clientName?: string;
  propertyId?: string;
  propertyTitle?: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
  status: 'برنامه‌ریزی شده' | 'انجام شده' | 'لغو شده';
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: string;
  link?: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  role: 'مدیر' | 'مشاور ارشد' | 'مشاور';
  deals: number;
  totalCommission: number;
  rating: number;
  active: boolean;
}

// ============ Agreement (قولنامه) Types ============
export interface AgreementParty {
  name: string;
  nationalId: string;
  fatherName: string;
  birthCertificate: string;
  phone: string;
  address: string;
  postalCode: string;
  role: 'فروشنده' | 'خریدار' | 'موجر' | 'مستاجر';
}

export interface AgreementProperty {
  type: 'آپارتمان' | 'ویلا' | 'مغازه' | 'زمین' | 'دفتر' | 'انبار' | 'باغ';
  registrationPlaque: string; // پلاک ثبتی
  registrationSection: string; // بخش ثبتی
  area: number;
  address: string;
  floor?: number;
  unit?: string;
  hasParking: boolean;
  hasElevator: boolean;
  hasStorage: boolean;
  legalStatus: 'آزاد' | 'در رهن' | 'در بازداشت' | 'موقوفه' | 'وصیتی';
  mortgageDetails?: string;
  usage: 'مسکونی' | 'تجاری' | 'اداری' | 'صنعتی' | 'کشاورزی';
  amenities: string[];
}

export interface PaymentInstallment {
  id: string;
  amount: number;
  dueDate: string;
  description: string;
  paid: boolean;
  paidDate?: string;
}

export interface Agreement {
  id: string;
  agreementNumber: string;
  trackingCode: string;
  type: 'فروش' | 'اجاره' | 'رهن' | 'مشارکت' | 'صلح';
  date: string;
  // طرفین
  seller: AgreementParty;
  buyer: AgreementParty;
  // ملک
  property: AgreementProperty;
  // مبلغ
  totalPrice: number;
  deposit: number;
  installments: PaymentInstallment[];
  // شرایط
  deliveryDate: string;
  transferDate: string;
  notaryOffice: string;
  penaltyPerDay: number; // وجه التزام روزانه
  commissionAmount: number;
  commissionRate: number;
  // حقوقی
  hasRightOfRescission: boolean;
  rescissionDeadline: string;
  rescissionPenalty: number;
  forceMajeure: boolean;
  specialConditions: string;
  // امضا
  sellerSignature: boolean;
  buyerSignature: boolean;
  witness1Name: string;
  witness1NationalId: string;
  witness1Signature: boolean;
  witness2Name: string;
  witness2NationalId: string;
  witness2Signature: boolean;
  agentSignature: boolean;
  // وضعیت
  status: 'پیش‌نویس' | 'امضا شده' | 'در حال اجرا' | 'تکمیل شده' | 'فسخ شده';
  notes: string;
  createdAt: string;
}

// ============ Initial Data ============
const initialProperties: Property[] = [
  { id: 'P-001', title: 'آپارتمان ۱۲۰ متری سعادت‌آباد', type: 'آپارتمان', dealType: 'فروش', area: 120, rooms: 3, price: 8500000000, address: 'سعادت‌آباد، بلوار دریا، خیابان ۱۵', district: 'منطقه ۲', floor: 5, hasParking: true, hasElevator: true, hasStorage: true, description: 'آپارتمان نوساز با ویو عالی', images: [], status: 'فعال', ownerId: 'O-001', ownerName: 'حسن موسوی', ownerPhone: '۰۹۱۲۱۱۱۲۲۲۳', createdAt: '۱۴۰۲/۰۸/۲۰' },
  { id: 'P-002', title: 'ویلا ۲۵۰ متری لواسان', type: 'ویلا', dealType: 'اجاره', area: 250, rooms: 4, price: 45000000, deposit: 2000000000, address: 'لواسان بزرگ، کوی گلستان', district: 'لواسان', hasParking: true, hasElevator: false, hasStorage: true, description: 'ویلا دوبلکس با حیاط بزرگ', images: [], status: 'فعال', ownerId: 'O-002', ownerName: 'اکبر صادقی', ownerPhone: '۰۹۱۲۳۳۳۴۴۴۵', createdAt: '۱۴۰۲/۰۸/۱۵' },
  { id: 'P-003', title: 'مغازه ۴۵ متری ونک', type: 'مغازه', dealType: 'فروش', area: 45, rooms: 0, price: 3200000000, address: 'ونک، خیابان ملاصدرا', district: 'منطقه ۳', floor: 0, hasParking: false, hasElevator: false, hasStorage: false, description: 'مغازه تجاری در موقعیت عالی', images: [], status: 'فعال', ownerId: 'O-003', ownerName: 'فاطمه نوری', ownerPhone: '۰۹۱۲۵۵۵۶۶۶۷', createdAt: '۱۴۰۲/۰۸/۱۰' },
  { id: 'P-004', title: 'آپارتمان ۸۵ متری پونک', type: 'آپارتمان', dealType: 'رهن', area: 85, rooms: 2, price: 500000000, address: 'پونک، بلوار فردوس', district: 'منطقه ۵', floor: 3, hasParking: true, hasElevator: true, hasStorage: false, description: 'آپارتمان بازسازی شده', images: [], status: 'فعال', ownerId: 'O-004', ownerName: 'مجید عباسی', ownerPhone: '۰۹۱۲۷۷۷۸۸۸۹', createdAt: '۱۴۰۲/۰۸/۰۵' },
  { id: 'P-005', title: 'زمین ۳۰۰ متری شهریار', type: 'زمین', dealType: 'فروش', area: 300, rooms: 0, price: 1800000000, address: 'شهریار، بلوار امام', district: 'شهریار', hasParking: false, hasElevator: false, hasStorage: false, description: 'زمین مسکونی با سند تک‌برگ', images: [], status: 'فعال', ownerId: 'O-005', ownerName: 'نرگس کاظمی', ownerPhone: '۰۹۱۲۹۹۹۰۰۰۱', createdAt: '۱۴۰۲/۰۷/۲۸' },
  { id: 'P-006', title: 'آپارتمان ۹۵ متری تجریش', type: 'آپارتمان', dealType: 'اجاره', area: 95, rooms: 2, price: 25000000, deposit: 500000000, address: 'تجریش، خیابان دربند', district: 'منطقه ۱', floor: 4, hasParking: true, hasElevator: true, hasStorage: true, description: 'آپارتمان فول امکانات', images: [], status: 'اجاره رفته', ownerId: 'O-006', ownerName: 'بهروز شریفی', ownerPhone: '۰۹۱۲۲۲۲۳۳۳۴', createdAt: '۱۴۰۲/۰۷/۲۰' },
];

const initialContracts: Contract[] = [
  { id: 'C-1402-089', type: 'فروش', propertyId: 'P-001', propertyTitle: 'آپارتمان ۱۲۰ متری سعادت‌آباد', clientId: 'CL-001', clientName: 'علی رضایی', clientPhone: '۰۹۱۲۳۴۵۶۷۸۹', clientNationalId: '۰۰۱۲۳۴۵۶۷۸', ownerName: 'حسن موسوی', ownerPhone: '۰۹۱۲۱۱۱۲۲۲۳', amount: 8500000000, commissionRate: 0.5, commission: 42500000, agentId: 'A-001', agentName: 'محمد احمدی', status: 'در انتظار تایید', trackingCode: 'GOV-887432', govStatus: 'در حال بررسی', notes: '', createdAt: '۱۴۰۲/۰۹/۱۵' },
  { id: 'C-1402-088', type: 'اجاره', propertyId: 'P-002', propertyTitle: 'ویلا ۲۵۰ متری لواسان', clientId: 'CL-002', clientName: 'مریم حسینی', clientPhone: '۰۹۱۲۱۱۱۲۲۲۳', clientNationalId: '۰۰۲۳۴۵۶۷۸۹', ownerName: 'اکبر صادقی', ownerPhone: '۰۹۱۲۳۳۳۴۴۴۵', amount: 45000000, deposit: 2000000000, commissionRate: 25, commission: 22500000, agentId: 'A-002', agentName: 'سارا رحیمی', status: 'تایید شده', trackingCode: 'GOV-887102', govStatus: 'تایید شده', notes: '', createdAt: '۱۴۰۲/۰۹/۱۴' },
  { id: 'C-1402-087', type: 'فروش', propertyId: 'P-003', propertyTitle: 'مغازه ۴۵ متری ونک', clientId: 'CL-003', clientName: 'رضا کریمی', clientPhone: '۰۹۱۲۴۴۴۵۵۵۶', clientNationalId: '۰۰۳۴۵۶۷۸۹۰', ownerName: 'فاطمه نوری', ownerPhone: '۰۹۱۲۵۵۵۶۶۶۷', amount: 3200000000, commissionRate: 0.5, commission: 16000000, agentId: 'A-001', agentName: 'محمد احمدی', status: 'تایید شده', trackingCode: 'GOV-886955', govStatus: 'تایید شده', notes: '', createdAt: '۱۴۰۲/۰۹/۱۳' },
  { id: 'C-1402-086', type: 'رهن', propertyId: 'P-004', propertyTitle: 'آپارتمان ۸۵ متری پونک', clientId: 'CL-004', clientName: 'زهرا محمدی', clientPhone: '۰۹۱۲۷۷۷۸۸۸۹', clientNationalId: '۰۰۴۵۶۷۸۹۰۱', ownerName: 'مجید عباسی', ownerPhone: '۰۹۱۲۷۷۷۸۸۸۹', amount: 500000000, commissionRate: 25, commission: 12500000, agentId: 'A-003', agentName: 'علی موسوی', status: 'پیش‌نویس', notes: '', createdAt: '۱۴۰۲/۰۹/۱۲' },
];

const initialClients: Client[] = [
  { id: 'CL-001', name: 'علی رضایی', phone: '۰۹۱۲۳۴۵۶۷۸۹', nationalId: '۰۰۱۲۳۴۵۶۷۸', type: 'خریدار', interest: 'آپارتمان ۱۰۰-۱۵۰ متری', budget: '۵-۱۰ میلیارد', budgetValue: 7500000000, status: 'فعال', source: 'وب‌سایت', notes: 'منطقه سعادت‌آباد و ونک', tags: ['VIP', 'فوری'], lastContact: '۲ روز پیش', nextFollowUp: '۱۴۰۲/۰۹/۲۰', createdAt: '۱۴۰۲/۰۸/۰۱', activities: [{ id: 'act-1', type: 'بازدید', text: 'بازدید از آپارتمان سعادت‌آباد', date: '۱۴۰۲/۰۹/۱۳' }, { id: 'act-2', type: 'تماس', text: 'تماس پیگیری', date: '۱۴۰۲/۰۹/۱۵' }] },
  { id: 'CL-002', name: 'مریم حسینی', phone: '۰۹۱۲۱۱۱۲۲۲۳', nationalId: '۰۰۲۳۴۵۶۷۸۹', type: 'مستاجر', interest: 'آپارتمان ۸۰-۱۰۰ متری', budget: 'رهن ۳۰۰ + اجاره ۱۵M', budgetValue: 300000000, status: 'در حال مذاکره', source: 'معرفی', notes: 'ترجیحاً طبقه بالا، پارکینگ', tags: ['معرفی'], lastContact: '۱ روز پیش', createdAt: '۱۴۰۲/۰۸/۱۰', activities: [{ id: 'act-3', type: 'جلسه', text: 'جلسه مذاکره در دفتر', date: '۱۴۰۲/۰۹/۱۴' }] },
  { id: 'CL-003', name: 'رضا کریمی', phone: '۰۹۱۲۴۴۴۵۵۵۶', nationalId: '۰۰۳۴۵۶۷۸۹۰', type: 'خریدار', interest: 'مغازه ۴۰-۶۰ متری', budget: '۳-۴ میلیارد', budgetValue: 3500000000, status: 'تکمیل شده', source: 'حضوری', notes: 'عجله‌ای برای خرید', tags: ['VIP'], lastContact: '۳ روز پیش', createdAt: '۱۴۰۲/۰۷/۲۰', activities: [{ id: 'act-4', type: 'بازدید', text: 'بازدید مغازه ونک', date: '۱۴۰۲/۰۹/۱۰' }] },
  { id: 'CL-004', name: 'زهرا محمدی', phone: '۰۹۱۲۷۷۷۸۸۸۹', nationalId: '۰۰۴۵۶۷۸۹۰۱', type: 'خریدار', interest: 'ویلایی ۲۰۰+ متری', budget: '۱۵-۲۰ میلیارد', budgetValue: 17500000000, status: 'فعال', source: 'تبلیغات', notes: 'لواسان یا فشم', tags: ['VIP', 'بودجه بالا'], lastContact: '۵ روز پیش', createdAt: '۱۴۰۲/۰۸/۱۵', activities: [] },
  { id: 'CL-005', name: 'امیر جعفری', phone: '۰۹۱۲۳۳۳۴۴۴۵', nationalId: '۰۰۵۶۷۸۹۰۱۲', type: 'سرمایه‌گذار', interest: 'زمین تجاری', budget: '۱۰+ میلیارد', budgetValue: 10000000000, status: 'پیگیری', source: 'تلفنی', notes: 'منطقه ۲۲ تهران', tags: ['سرمایه‌گذار'], lastContact: '۱ هفته پیش', createdAt: '۱۴۰۲/۰۸/۲۰', activities: [{ id: 'act-5', type: 'تماس', text: 'تماس اولیه', date: '۱۴۰۲/۰۹/۰۸' }] },
  { id: 'CL-006', name: 'سارا نوری', phone: '۰۹۱۲۶۶۶۷۷۷۸', nationalId: '۰۰۶۷۸۹۰۱۲۳', type: 'مستاجر', interest: 'آپارتمان ۷۰-۹۰ متری', budget: 'رهن ۲۰۰ + اجاره ۱۰M', budgetValue: 200000000, status: 'غیرفعال', source: 'وب‌سایت', notes: 'منطقه تجریش و قیطریه', tags: [], lastContact: '۲ هفته پیش', createdAt: '۱۴۰۲/۰۷/۱۵', activities: [] },
];

const initialEvents: CalendarEvent[] = [
  { id: 'E-001', title: 'بازدید آپارتمان سعادت‌آباد', type: 'بازدید', clientId: 'CL-001', clientName: 'علی رضایی', propertyId: 'P-001', propertyTitle: 'آپارتمان ۱۲۰ متری سعادت‌آباد', date: '۱۴۰۲/۰۹/۲۰', time: '۱۰:۰۰', duration: 60, notes: 'بازدید دوم', status: 'برنامه‌ریزی شده', color: 'blue' },
  { id: 'E-002', title: 'جلسه مذاکره ویلا لواسان', type: 'جلسه', clientId: 'CL-002', clientName: 'مریم حسینی', date: '۱۴۰۲/۰۹/۲۱', time: '۱۴:۰۰', duration: 90, notes: 'نهایی‌سازی قرارداد', status: 'برنامه‌ریزی شده', color: 'amber' },
  { id: 'E-003', title: 'امضای قرارداد مغازه ونک', type: 'امضا', clientId: 'CL-003', clientName: 'رضا کریمی', propertyId: 'P-003', propertyTitle: 'مغازه ۴۵ متری ونک', date: '۱۴۰۲/۰۹/۲۲', time: '۱۱:۰۰', duration: 120, notes: 'دفترخانه شماره ۱۲۳', status: 'برنامه‌ریزی شده', color: 'green' },
  { id: 'E-004', title: 'پیگیری مشتری زهرا محمدی', type: 'پیگیری', clientId: 'CL-004', clientName: 'زهرا محمدی', date: '۱۴۰۲/۰۹/۲۳', time: '۰۹:۰۰', duration: 30, notes: 'ارائه گزینه‌های جدید', status: 'برنامه‌ریزی شده', color: 'purple' },
];

const initialNotifications: Notification[] = [
  { id: 'N-001', title: 'قرارداد جدید ثبت شد', text: 'قرارداد C-1402-089 با موفقیت ثبت و به سامانه دولتی ارسال شد', type: 'success', read: false, date: '۱۰ دقیقه پیش' },
  { id: 'N-002', title: 'مشتری جدید', text: 'مشتری سارا نوری از طریق وب‌سایت ثبت‌نام کرد', type: 'info', read: false, date: '۳۰ دقیقه پیش' },
  { id: 'N-003', title: 'یادآوری پیگیری', text: 'پیگیری مشتری زهرا محمدی فردا ساعت ۹ صبح', type: 'warning', read: false, date: '۱ ساعت پیش' },
  { id: 'N-004', title: 'کمیسیون دریافت شد', text: 'کمیسیون قرارداد C-1402-088 به مبلغ ۲۲,۵۰۰,۰۰۰ ریال دریافت شد', type: 'success', read: true, date: '۲ ساعت پیش' },
  { id: 'N-005', title: 'تایید سامانه دولتی', text: 'قرارداد C-1402-088 توسط سامانه ثبت اسناد تایید شد', type: 'success', read: true, date: '۳ ساعت پیش' },
];

const initialAgents: Agent[] = [
  { id: 'A-001', name: 'محمد احمدی', phone: '۰۹۱۲۱۲۳۴۵۶۷', role: 'مدیر', deals: 8, totalCommission: 58500000, rating: 4.8, active: true },
  { id: 'A-002', name: 'سارا رحیمی', phone: '۰۹۱۲۹۸۷۶۵۴۳', role: 'مشاور ارشد', deals: 5, totalCommission: 22500000, rating: 4.5, active: true },
  { id: 'A-003', name: 'علی موسوی', phone: '۰۹۱۲۵۵۵۴۴۴۳', role: 'مشاور', deals: 3, totalCommission: 12500000, rating: 4.2, active: true },
];

const initialAgreements: Agreement[] = [
  {
    id: 'AGR-001',
    agreementNumber: 'MB-1402-001',
    trackingCode: 'IR-987654321',
    type: 'فروش',
    date: '۱۴۰۲/۰۹/۱۰',
    seller: { name: 'حسن موسوی', nationalId: '۰۰۷۸۹۴۵۶۱۲', fatherName: 'علی', birthCertificate: '۱۲۳۴', phone: '۰۹۱۲۱۱۱۲۲۲۳', address: 'تهران، سعادت‌آباد، بلوار دریا', postalCode: '۱۴۶۸۷۶۵۴۳۲', role: 'فروشنده' },
    buyer: { name: 'علی رضایی', nationalId: '۰۰۱۲۳۴۵۶۷۸', fatherName: 'محمد', birthCertificate: '۵۶۷۸', phone: '۰۹۱۲۳۴۵۶۷۸۹', address: 'تهران، ونک، خیابان گاندی', postalCode: '۱۵۱۶۷۸۹۴۵۶', role: 'خریدار' },
    property: { type: 'آپارتمان', registrationPlaque: '۱۲۳۴/۵۶', registrationSection: '۷', area: 120, address: 'تهران، سعادت‌آباد، بلوار دریا، پلاک ۱۵، واحد ۵', floor: 5, unit: '۵', hasParking: true, hasElevator: true, hasStorage: true, legalStatus: 'آزاد', usage: 'مسکونی', amenities: ['پارکینگ', 'آسانسور', 'انباری', 'بالکن'] },
    totalPrice: 8500000000,
    deposit: 2000000000,
    installments: [
      { id: 'INS-1', amount: 2000000000, dueDate: '۱۴۰۲/۰۹/۱۰', description: 'پیش‌پرداخت', paid: true, paidDate: '۱۴۰۲/۰۹/۱۰' },
      { id: 'INS-2', amount: 3000000000, dueDate: '۱۴۰۲/۱۰/۱۵', description: 'قسط دوم', paid: false },
      { id: 'INS-3', amount: 3500000000, dueDate: '۱۴۰۲/۱۱/۲۰', description: 'هنگام تنظیم سند', paid: false },
    ],
    deliveryDate: '۱۴۰۲/۱۱/۲۵',
    transferDate: '۱۴۰۲/۱۱/۲۰',
    notaryOffice: 'دفترخانه شماره ۱۲۳ تهران',
    penaltyPerDay: 50000000,
    commissionAmount: 42500000,
    commissionRate: 0.5,
    hasRightOfRescission: true,
    rescissionDeadline: '۱۴۰۲/۰۹/۲۰',
    rescissionPenalty: 500000000,
    forceMajeure: true,
    specialConditions: 'فروشنده متعهد می‌شود ملک را بدون هیچگونه بدهی و مانع قانونی تحویل دهد.',
    sellerSignature: true,
    buyerSignature: true,
    witness1Name: 'رضا کریمی',
    witness1NationalId: '۰۰۳۴۵۶۷۸۹۰',
    witness1Signature: true,
    witness2Name: 'مریم حسینی',
    witness2NationalId: '۰۰۲۳۴۵۶۷۸۹',
    witness2Signature: true,
    agentSignature: true,
    status: 'در حال اجرا',
    notes: '',
    createdAt: '۱۴۰۲/۰۹/۱۰',
  },
];

// ============ Context ============
interface DataContextType {
  properties: Property[];
  contracts: Contract[];
  clients: Client[];
  events: CalendarEvent[];
  notifications: Notification[];
  agents: Agent[];
  agreements: Agreement[];
  addProperty: (p: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (id: string, p: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  addContract: (c: Omit<Contract, 'id' | 'createdAt'>) => void;
  updateContract: (id: string, c: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  addClient: (c: Omit<Client, 'id' | 'createdAt' | 'activities'>) => void;
  updateClient: (id: string, c: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addClientActivity: (clientId: string, activity: Omit<Activity, 'id'>) => void;
  addEvent: (e: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, e: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addAgreement: (a: Omit<Agreement, 'id' | 'createdAt'>) => void;
  updateAgreement: (id: string, a: Partial<Agreement>) => void;
  deleteAgreement: (id: string) => void;
  generateId: (prefix: string) => string;
}

const DataContext = createContext<DataContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return fallback;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => loadFromStorage('emlakyar_properties', initialProperties));
  const [contracts, setContracts] = useState<Contract[]>(() => loadFromStorage('emlakyar_contracts', initialContracts));
  const [clients, setClients] = useState<Client[]>(() => loadFromStorage('emlakyar_clients', initialClients));
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadFromStorage('emlakyar_events', initialEvents));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('emlakyar_notifications', initialNotifications));
  const [agents] = useState<Agent[]>(() => loadFromStorage('emlakyar_agents', initialAgents));
  const [agreements, setAgreements] = useState<Agreement[]>(() => loadFromStorage('emlakyar_agreements', initialAgreements));

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('emlakyar_properties', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('emlakyar_contracts', JSON.stringify(contracts)); }, [contracts]);
  useEffect(() => { localStorage.setItem('emlakyar_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('emlakyar_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('emlakyar_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('emlakyar_agreements', JSON.stringify(agreements)); }, [agreements]);

  const generateId = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;

  const addProperty = (p: Omit<Property, 'id' | 'createdAt'>) => {
    setProperties(prev => [...prev, { ...p, id: generateId('P'), createdAt: new Date().toLocaleDateString('fa-IR') }]);
    addNotification({ title: 'ملک جدید ثبت شد', text: `${p.title} با موفقیت ثبت شد`, type: 'success' });
  };
  const updateProperty = (id: string, p: Partial<Property>) => setProperties(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
  const deleteProperty = (id: string) => setProperties(prev => prev.filter(x => x.id !== id));

  const addContract = (c: Omit<Contract, 'id' | 'createdAt'>) => {
    const newContract = { ...c, id: `C-1402-${String(contracts.length + 90).padStart(3, '0')}`, createdAt: new Date().toLocaleDateString('fa-IR') };
    setContracts(prev => [...prev, newContract]);
    addNotification({ title: 'قرارداد جدید ثبت شد', text: `قرارداد ${newContract.id} ثبت و به سامانه دولتی ارسال شد`, type: 'success' });
  };
  const updateContract = (id: string, c: Partial<Contract>) => {
    setContracts(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
    
    // Sync agreement status if contract has related agreement
    if (c.status) {
      const contract = contracts.find(ct => ct.id === id);
      if (contract?.agreementId) {
        // Map contract status to agreement status
        let agreementStatus: Agreement['status'] = 'پیش‌نویس';
        switch (c.status) {
          case 'پیش‌نویس': agreementStatus = 'پیش‌نویس'; break;
          case 'در انتظار تایید': agreementStatus = 'امضا شده'; break;
          case 'تایید شده': agreementStatus = 'در حال اجرا'; break;
          case 'رد شده': agreementStatus = 'فسخ شده'; break;
          case 'لغو شده': agreementStatus = 'فسخ شده'; break;
        }
        setAgreements(prev => prev.map(a => a.id === contract.agreementId ? { ...a, status: agreementStatus } : a));
        addNotification({ 
          title: 'هماهنگی قولنامه و قرارداد', 
          text: `وضعیت قولنامه مرتبط با قرارداد ${id} به "${agreementStatus}" تغییر کرد`, 
          type: 'info' 
        });
      }
    }
  };
  const deleteContract = (id: string) => setContracts(prev => prev.filter(x => x.id !== id));

  const addClient = (c: Omit<Client, 'id' | 'createdAt' | 'activities'>) => {
    setClients(prev => [...prev, { ...c, id: generateId('CL'), createdAt: new Date().toLocaleDateString('fa-IR'), activities: [] }]);
    addNotification({ title: 'مشتری جدید', text: `${c.name} به لیست مشتریان اضافه شد`, type: 'info' });
  };
  const updateClient = (id: string, c: Partial<Client>) => setClients(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  const deleteClient = (id: string) => setClients(prev => prev.filter(x => x.id !== id));
  const addClientActivity = (clientId: string, activity: Omit<Activity, 'id'>) => {
    setClients(prev => prev.map(x => x.id === clientId ? { ...x, activities: [...x.activities, { ...activity, id: generateId('act') }] } : x));
  };

  const addEvent = (e: Omit<CalendarEvent, 'id'>) => {
    setEvents(prev => [...prev, { ...e, id: generateId('E') }]);
    addNotification({ title: 'رویداد جدید', text: `${e.title} در تقویم ثبت شد`, type: 'info' });
  };
  const updateEvent = (id: string, e: Partial<CalendarEvent>) => setEvents(prev => prev.map(x => x.id === id ? { ...x, ...e } : x));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(x => x.id !== id));

  const addNotification = (n: Omit<Notification, 'id' | 'read' | 'date'>) => {
    setNotifications(prev => [{ ...n, id: generateId('N'), read: false, date: 'همین الان' }, ...prev]);
  };
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(x => x.id === id ? { ...x, read: true } : x));
  const markAllNotificationsRead = () => setNotifications(prev => prev.map(x => ({ ...x, read: true })));
  const deleteNotification = (id: string) => setNotifications(prev => prev.filter(x => x.id !== id));

  const addAgreement = (a: Omit<Agreement, 'id' | 'createdAt'>) => {
    const agreementId = generateId('AGR');
    const newAgreement = { ...a, id: agreementId, createdAt: new Date().toLocaleDateString('fa-IR') };
    setAgreements(prev => [...prev, newAgreement]);
    
    // Create related contract automatically
    const contractType = a.type === 'صلح' ? 'مشارکت' : a.type;
    const newContract: Omit<Contract, 'id' | 'createdAt'> = {
      type: contractType as Contract['type'],
      propertyId: '',
      propertyTitle: `${a.property.type} - ${a.property.area} متر - ${a.property.address.slice(0, 30)}`,
      clientId: '',
      clientName: a.buyer.name,
      clientPhone: a.buyer.phone,
      clientNationalId: a.buyer.nationalId,
      ownerName: a.seller.name,
      ownerPhone: a.seller.phone,
      amount: a.totalPrice,
      deposit: a.deposit,
      commissionRate: a.commissionRate,
      commission: a.commissionAmount,
      agentId: '',
      agentName: '',
      status: 'پیش‌نویس',
      trackingCode: a.trackingCode,
      govStatus: 'ارسال نشده',
      agreementId: agreementId, // ارتباط با قولنامه
      notes: `ایجاد شده از قولنامه ${a.agreementNumber}`,
    };
    const contractId = `C-1402-${String(contracts.length + 90).padStart(3, '0')}`;
    setContracts(prev => [...prev, { ...newContract, id: contractId, createdAt: new Date().toLocaleDateString('fa-IR') }]);

    // Create calendar events for delivery and transfer
    if (a.deliveryDate) {
      setEvents(prev => [...prev, {
        id: generateId('E'),
        title: `تحویل ملک - ${a.property.type}`,
        type: 'تسلیمر',
        clientName: a.buyer.name,
        clientId: '',
        propertyTitle: `${a.property.type} - ${a.property.area} متر`,
        propertyId: '',
        date: a.deliveryDate,
        time: '۱۰:۰۰',
        duration: 60,
        notes: `تحویل ملک طبق قولنامه ${a.agreementNumber}`,
        status: 'برنامه‌ریزی شده',
        color: 'red',
      }]);
    }
    if (a.transferDate) {
      setEvents(prev => [...prev, {
        id: generateId('E'),
        title: `تنظیم سند رسمی - ${a.notaryOffice}`,
        type: 'امضا',
        clientName: a.buyer.name,
        clientId: '',
        propertyTitle: `${a.property.type} - ${a.property.area} متر`,
        propertyId: '',
        date: a.transferDate,
        time: '۰۹:۰۰',
        duration: 120,
        notes: `تنظیم سند در ${a.notaryOffice} طبق قولنامه ${a.agreementNumber}`,
        status: 'برنامه‌ریزی شده',
        color: 'green',
      }]);
    }

    // Add activities to buyer client if exists
    setClients(prev => prev.map(c => 
      c.name === a.buyer.name ? {
        ...c,
        activities: [...c.activities, {
          id: generateId('act'),
          type: 'جلسه' as const,
          text: `ثبت قولنامه ${a.agreementNumber} - ${a.type} ${a.property.type}`,
          date: new Date().toLocaleDateString('fa-IR'),
        }]
      } : c
    ));

    addNotification({ title: 'قولنامه جدید ثبت شد', text: `قولنامه ${newAgreement.agreementNumber} با کد رهگیری ${newAgreement.trackingCode} ثبت شد. قرارداد و رویدادهای مرتبط ایجاد شدند.`, type: 'success' });
  };
  const updateAgreement = (id: string, a: Partial<Agreement>) => {
    setAgreements(prev => prev.map(x => x.id === id ? { ...x, ...a } : x));
    
    // Sync contract status if agreement has related contract
    if (a.status) {
      const contract = contracts.find(ct => ct.agreementId === id);
      if (contract) {
        // Map agreement status to contract status
        let contractStatus: Contract['status'] = 'پیش‌نویس';
        switch (a.status) {
          case 'پیش‌نویس': contractStatus = 'پیش‌نویس'; break;
          case 'امضا شده': contractStatus = 'در انتظار تایید'; break;
          case 'در حال اجرا': contractStatus = 'تایید شده'; break;
          case 'تکمیل شده': contractStatus = 'تایید شده'; break;
          case 'فسخ شده': contractStatus = 'لغو شده'; break;
        }
        setContracts(prev => prev.map(ct => ct.id === contract.id ? { ...ct, status: contractStatus } : ct));
        addNotification({ 
          title: 'هماهنگی قرارداد و قولنامه', 
          text: `وضعیت قرارداد ${contract.id} مرتبط با قولنامه به "${contractStatus}" تغییر کرد`, 
          type: 'info' 
        });
      }
    }
  };
  const deleteAgreement = (id: string) => setAgreements(prev => prev.filter(x => x.id !== id));

  return (
    <DataContext.Provider value={{
      properties, contracts, clients, events, notifications, agents, agreements,
      addProperty, updateProperty, deleteProperty,
      addContract, updateContract, deleteContract,
      addClient, updateClient, deleteClient, addClientActivity,
      addEvent, updateEvent, deleteEvent,
      markNotificationRead, markAllNotificationsRead, deleteNotification,
      addAgreement, updateAgreement, deleteAgreement,
      generateId,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
