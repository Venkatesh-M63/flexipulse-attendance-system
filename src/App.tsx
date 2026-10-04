/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Header } from './components/layout/Header';
import { SplitView } from './components/layout/SplitView';
import { MobileApp } from './components/mobile/MobileApp';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainContent: React.FC = () => {
  const { viewMode } = useAttendance();

  return (
    <main className="flex-1 flex flex-col w-full">
      {viewMode === 'split' && <SplitView />}

      {viewMode === 'mobile' && (
        <div className="flex-1 flex flex-col items-center justify-center py-6 px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-white">Employee Mobile Attendance</h2>
              <p className="text-xs text-slate-400">
                Clock in on-the-go with GPS geofencing, selfie verification, and flexible shifts.
              </p>
            </div>
            <MobileApp inSimulatorFrame={true} />
          </div>
        </div>
      )}

      {viewMode === 'admin' && (
        <div className="flex-1 flex flex-col py-4 px-4 sm:px-6">
          <AdminDashboard />
        </div>
      )}
    </main>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950">
        <Header />
        <MainContent />

        {/* Clean, quiet footer adhering to anti-slop rules */}
        <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>FlexiPulse Attendance Systems · Production Ready</span>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>GPS Geofence Engine</span>
              <span aria-hidden="true">·</span>
              <span>Biometric Selfie Verification</span>
              <span aria-hidden="true">·</span>
              <span>Flexible Core Shifts</span>
            </div>
          </div>
        </footer>
      </div>
    </AttendanceProvider>
  );
}
