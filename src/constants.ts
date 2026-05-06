// Replace this with your actual Google Apps Script Web App URL after deployment
export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwWSWo36e7K0MGTypJdx3jl6riikaIfj10VAhrZcC_TKY7f7q3zm376p3U2u5qqp7f1/exec';

export const RISK_LEVELS = [
  { id: 'normal', name: 'ปกติ', color: '#0288d1', emoji: '😊', description: 'สุขภาพทั่วไปปกติ' },
  { id: 'green', name: 'ระดับต่ำ', color: '#388e3c', emoji: '✅', description: 'ต้องเฝ้าระวังเบื้องต้น' },
  { id: 'yellow', name: 'ระดับกลาง', color: '#fbc02d', emoji: '⚠️', description: 'มีอาการที่ควรปรึกษาแพทย์' },
  { id: 'red', name: 'ระดับวิกฤต', color: '#d32f2f', emoji: '🚨', description: 'ต้องการความช่วยเหลือด่วน' },
] as const;

export const COMMON_SYMPTOMS = [
  'ปวดศีรษะ',
  'วิงเวียนศีรษะ',
  'แน่นหน้าอก',
  'หายใจลำบาก',
  'ปวดเมื่อยตามตัว',
  'อ่อนเพลีย',
  'นอนไม่หลับ',
  'อื่นๆ (ระบุในหมายเหตุ)',
];
