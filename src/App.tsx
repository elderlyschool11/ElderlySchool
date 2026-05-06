/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import liff from '@line/liff';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import { UserPlus } from 'lucide-react';

const LIFF_ID = '2009913183-Moxs20dd'; // Replace this with your actual LIFF ID

function RegistrationPage({ userId, userName, isLiffLoading }: { userId?: string, userName?: string, isLiffLoading: boolean }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <UserPlus className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800">ElderCare ลงทะเบียน</span>
        </div>
        {userName && (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
            <div className="w-6 h-6 bg-blue-100 rounded-full overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${userName}&background=random`} alt="avatar" />
            </div>
            <span className="text-xs font-semibold text-slate-600">{userName}</span>
          </div>
        )}
      </nav>

      <main className="container mx-auto mt-4 px-4 pb-10">
        {isLiffLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-medium italic">กำลังเชื่อมต่อ LINE...</p>
          </div>
        ) : (
          <RegistrationForm userId={userId} initialUserName={userName} />
        )}
      </main>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Dashboard />
    </div>
  );
}

export default function App() {
  const [userId, setUserId] = useState<string | undefined>();
  const [userName, setUserName] = useState<string | undefined>();
  const [isLiffLoading, setIsLiffLoading] = useState(true);

  useEffect(() => {
    async function initLiff() {
      try {
        await liff.init({ liffId: LIFF_ID });
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserId(profile.userId);
          setUserName(profile.displayName);
        }
      } catch (error) {
        console.error('LIFF initialization failed', error);
      } finally {
        setIsLiffLoading(false);
      }
    }
    
    if (LIFF_ID !== 'YOUR_LIFF_ID') {
      initLiff();
    } else {
      setIsLiffLoading(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<RegistrationPage userId={userId} userName={userName} isLiffLoading={isLiffLoading} />} 
        />
        <Route 
          path="/dashboard" 
          element={<DashboardPage />} 
        />
        {/* Fallback to Registration */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

