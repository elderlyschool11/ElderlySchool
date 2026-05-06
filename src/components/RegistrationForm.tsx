import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Heart, User, ClipboardList, Send } from 'lucide-react';
import { RISK_LEVELS, COMMON_SYMPTOMS, SCRIPT_URL } from '../constants';
import { ScreeningData, ApiResponse } from '../types';

interface Props {
  userId?: string;
  initialUserName?: string;
}

export default function RegistrationForm({ userId, initialUserName }: Props) {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState(initialUserName || '');
  const [level, setLevel] = useState<ScreeningData['level']>('normal');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const data: ScreeningData = {
      userName,
      level,
      levelName: RISK_LEVELS.find(r => r.id === level)?.name || '',
      symptoms: [...selectedSymptoms, note].filter(Boolean).join(', '),
      userId,
    };

    try {
      // Note: In real world, we might need a proxy or the Script MUST have CORS enabled
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Many GAS setups require this unless properly configured
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // With no-cors, we can't read the body, so we assume success if no error thrown
      setResult({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว ระบบกำลังส่งการแจ้งเตือนทาง LINE' });
    } catch (error) {
      setResult({ success: false, message: 'ขออภัย เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl text-center border border-slate-100"
      >
        {result.success ? (
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        ) : (
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        )}
        <h2 className="text-2xl font-bold mb-4">{result.success ? 'สำเร็จ!' : 'ข้อผิดพลาด'}</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">{result.message}</p>
        <button 
          onClick={() => { setStep(1); setResult(null); }}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
        >
          ทำแบบคัดกรองใหม่
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="mb-8 px-4 py-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl mb-4">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">คัดกรองสุขภาพผู้สูงอายุ</h1>
        <p className="text-slate-500 mt-1">กรุณากรอกข้อมูลตามความเป็นจริง</p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-1/3 h-2 rounded-full mx-1 transition-colors ${step >= i ? 'bg-blue-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>
        <div className="text-xs text-center text-slate-400 font-medium uppercase tracking-wider">
          ขั้นตอนที่ {step} จาก 3
        </div>
      </div>

      {/* Form Steps */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="flex items-center text-lg font-bold text-slate-700">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  ชื่อ-นามสกุล ของท่าน
                </label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="เช่น นายใจดี มีสุข"
                  className="w-full p-5 bg-white border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:outline-none text-lg transition-all shadow-sm"
                />
              </div>
              <button 
                disabled={!userName.trim()}
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center p-5 bg-blue-600 text-white rounded-3xl font-bold text-lg disabled:opacity-50 disabled:grayscale shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
              >
                ขั้นตอนต่อไป <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="flex items-center text-lg font-bold text-slate-700">
                  <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
                  ระดับความรุนแรงของสุขภาพ
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {RISK_LEVELS.map((risk) => (
                    <button
                      key={risk.id}
                      onClick={() => setLevel(risk.id as any)}
                      className={`relative flex items-center p-5 rounded-3xl border-2 text-left transition-all ${
                        level === risk.id 
                          ? 'border-transparent ring-4 ring-offset-2' 
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                      style={{ 
                        backgroundColor: level === risk.id ? risk.color : 'white',
                        color: level === risk.id ? 'white' : 'inherit',
                        boxShadow: level === risk.id ? `0 10px 25px -5px ${risk.color}66` : 'none',
                        borderColor: level === risk.id ? 'transparent' : undefined
                      }}
                    >
                      <span className="text-3xl mr-4">{risk.emoji}</span>
                      <div>
                        <div className={`font-bold text-lg ${level === risk.id ? 'text-white' : 'text-slate-800'}`}>
                          {risk.name}
                        </div>
                        <div className={`text-sm ${level === risk.id ? 'text-white/80' : 'text-slate-400'}`}>
                          {risk.description}
                        </div>
                      </div>
                      {level === risk.id && (
                        <CheckCircle2 className="absolute right-5 w-6 h-6" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 p-5 border-2 border-slate-100 bg-white text-slate-600 rounded-3xl font-bold flex items-center justify-center hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft className="mr-2 w-5 h-5" /> กลับ
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="flex-2 p-5 bg-blue-600 text-white rounded-3xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                  ขั้นตอนต่อไป
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="flex items-center text-lg font-bold text-slate-700">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                  อาการที่พบ (เลือกได้มากกว่า 1)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {COMMON_SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`p-4 rounded-2xl border-2 text-sm font-medium transition-all ${
                        selectedSymptoms.includes(symptom)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-100 bg-white text-slate-500'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-400 uppercase mb-2">ข้อมูลอื่นๆ เพิ่มเติม</label>
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="ระบุอาการเพิ่มเติม..."
                    className="w-full p-5 bg-white border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:outline-none text-lg transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 p-5 border-2 border-slate-100 bg-white text-slate-600 rounded-3xl font-bold flex items-center justify-center hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft className="mr-2 w-5 h-5" /> กลับ
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="flex-2 p-5 bg-slate-900 text-white rounded-3xl font-bold text-lg shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>ส่งข้อมูล <Send className="ml-2 w-5 h-5" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
