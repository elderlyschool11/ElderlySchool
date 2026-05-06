import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Activity, Users, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { RISK_LEVELS } from '../constants';

// Mock data for the dashboard demo
const summaryData = [
  { name: 'ปกติ', value: 45, color: '#0288d1' },
  { name: 'ระดับต่ำ', value: 25, color: '#388e3c' },
  { name: 'ระดับกลาง', value: 15, color: '#fbc02d' },
  { name: 'ระดับวิกฤต', value: 5, color: '#d32f2f' },
];

const weeklyTrend = [
  { day: 'จ.', count: 4 },
  { day: 'อ.', count: 7 },
  { day: 'พ.', count: 5 },
  { day: 'พฤ.', count: 9 },
  { day: 'ศ.', count: 12 },
  { day: 'ส.', count: 8 },
  { day: 'อา.', count: 6 },
];

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">แดชบอร์ดสรุปผล</h1>
          <p className="text-slate-500">ข้อมูลการคัดกรองสุขภาพผู้สูงอายุล่าสุด</p>
        </div>
        <a 
          href="https://docs.google.com/spreadsheets/d/1Li9XRLRnbhXDYFeBkejQe5NDjvDN6nzfqNvh59Zf67k" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" /> เปิด Google Sheet
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<Users className="w-5 h-5 text-blue-500" />} 
          label="ผู้ส่งข้อมูลทั้งหมด" 
          value="90" 
          trend="+5 รายวันนี้"
        />
        <StatCard 
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />} 
          label="เคสวิกฤต (สีแดง)" 
          value="5" 
          trend="ต้องช่วยเหลือด่วน"
        />
        <StatCard 
          icon={<Activity className="w-5 h-5 text-yellow-500" />} 
          label="เคสเฝ้าระวัง" 
          value="15" 
          trend="+2 จากสัปดาห์ก่อน"
        />
        <StatCard 
          icon={<CheckCircle className="w-5 h-5 text-green-500" />} 
          label="สุขภาพปกติ" 
          value="70" 
          trend="82% ของทั้งหมด"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Pie */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" /> สัดส่วนระดับความเสี่ยง
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summaryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Trend Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" /> แนวโน้มการลงทะเบียนรายวัน
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity (UI Only) */}
      <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">ความเคลื่อนไหวล่าสุด</h3>
        <div className="space-y-4">
          {[
            { name: 'คุณสมศักดิ์ รักไทย', time: '10 นาทีที่แล้ว', level: 'red' },
            { name: 'คุณแม่ทองคำ', time: '1 ชม. ที่แล้ว', level: 'green' },
            { name: 'คุณตาแจ้ง', time: '3 ชม. ที่แล้ว', level: 'normal' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  item.level === 'red' ? 'bg-red-500' : 
                  item.level === 'yellow' ? 'bg-yellow-500' : 
                  item.level === 'green' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <span className="font-medium text-slate-700">{item.name}</span>
              </div>
              <span className="text-sm text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100"
    >
      <div className="mb-4">{icon}</div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide text-[10px]">{label}</div>
      <div className="text-xs text-blue-500 font-semibold">{trend}</div>
    </motion.div>
  );
}
