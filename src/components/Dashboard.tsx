import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Activity, Users, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { RISK_LEVELS, SCRIPT_URL } from '../constants';

// Mock data for the dashboard demo
// ข้อมูลเริ่มต้นเป็น 0 ทั้งหมด
const INITIAL_SUMMARY = [
  { name: 'ปกติ', value: 0, color: '#0288d1' },
  { name: 'ระดับต่ำ', value: 0, color: '#388e3c' },
  { name: 'ระดับกลาง', value: 0, color: '#fbc02d' },
  { name: 'ระดับวิกฤต', value: 0, color: '#d32f2f' },
];

export default function Dashboard() {
  const [data, setData] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState(INITIAL_SUMMARY);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // ลิงก์ Google Sheet ของคุณ
  const NEW_SHEET_URL = "https://docs.google.com/spreadsheets/d/1CAFra-sydr8oxfTl2pm3vxAPLjfYh3nSqnIpvHn7hE4/"; 

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // เรียกข้อมูลผ่าน doGet ของ Apps Script พร้อมพารามิเตอร์ ?action=read
      const response = await fetch(`${SCRIPT_URL}?action=read`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const json = await response.json();
      
      if (json.success && json.data && json.data.length > 0) {
        setData(json.data.slice().reverse()); // เรียงจากใหม่ไปเก่า
        
        // คำนวณสรุปผลจากข้อมูลจริง
        const counts = { normal: 0, green: 0, yellow: 0, red: 0 };
        json.data.forEach((item: any) => {
          // ตรวจสอบจาก levelName หรือเงื่อนไขที่คุณบันทึก
          if (item.levelName === 'ปกติ' || item.level === 'normal') counts.normal++;
          else if (item.levelName === 'ระดับต่ำ' || item.level === 'green') counts.green++;
          else if (item.levelName === 'ระดับกลาง' || item.level === 'yellow') counts.yellow++;
          else if (item.levelName === 'ระดับวิกฤต' || item.level === 'red') counts.red++;
        });

        setSummary([
          { name: 'ปกติ', value: counts.normal, color: '#0288d1' },
          { name: 'ระดับต่ำ', value: counts.green, color: '#388e3c' },
          { name: 'ระดับกลาง', value: counts.yellow, color: '#fbc02d' },
          { name: 'ระดับวิกฤต', value: counts.red, color: '#d32f2f' },
        ]);
      } else {
        // กรณีไม่มีข้อมูลเลย ให้เซ็ตเป็นค่าว่าง
        setData([]);
        setSummary(INITIAL_SUMMARY);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("ไม่สามารถดึงข้อมูลได้ (โปรดตรวจสอบว่าได้เพิ่ม doGet ใน Apps Script หรือยัง)");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium">กำลังโหลดข้อมูลจริงจากระบบ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">แดชบอร์ดสรุปผล</h1>
          <p className="text-slate-500">ข้อมูลจริงจาก Google Sheet ล่าสุด</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchData}
            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
            title="รีเฟรชข้อมูล"
          >
            <Clock className="w-5 h-5" />
          </button>
          <a 
            href={NEW_SHEET_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" /> เปิด Google Sheet
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<Users className="w-5 h-5 text-blue-500" />} 
          label="ผู้ส่งข้อมูลทั้งหมด" 
          value={summary.reduce((a, b) => a + b.value, 0).toString()} 
          trend="อัปเดตล่าสุด"
        />
        <StatCard 
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />} 
          label="เคสวิกฤต (สีแดง)" 
          value={summary.find(s => s.name === 'ระดับวิกฤต')?.value.toString() || '0'} 
          trend="ต้องดูแลพิเศษ"
        />
        <StatCard 
          icon={<Activity className="w-5 h-5 text-yellow-500" />} 
          label="เคสเฝ้าระวัง" 
          value={summary.find(s => s.name === 'ระดับกลาง')?.value.toString() || '0'} 
          trend="ติดตามอาการ"
        />
        <StatCard 
          icon={<CheckCircle className="w-5 h-5 text-green-500" />} 
          label="สุขภาพปกติ" 
          value={summary.find(s => s.name === 'ปกติ')?.value.toString() || '0'} 
          trend="กลุ่มสุขภาพดี"
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
                  data={summary}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {summary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" /> ผู้ลงทะเบียนล่าสุด
          </h3>
          <div className="space-y-3">
            {data.length > 0 ? data.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: RISK_LEVELS.find(r => r.name === item.levelName)?.color || '#94a3b8' }} />
                  <div>
                    <div className="text-sm font-bold text-slate-700 leading-none mb-1">{item.userName}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{item.levelName}</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{item.date}</div>
              </div>
            )) : (
              <p className="text-center py-10 text-slate-400 italic">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </motion.div>
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
