import React from 'react';
import { Smartphone, Monitor, Zap, Info, ShieldCheck, MapPin } from 'lucide-react';
import { MobileApp } from '../mobile/MobileApp';
import { AdminDashboard } from '../admin/AdminDashboard';
import { useAttendance } from '../../context/AttendanceContext';

export const SplitView: React.FC = () => {
  const { lastPunchEvent } = useAttendance();

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-6 flex flex-col gap-5">
      {/* Interactive Sync Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-800/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">Interactive Live Sync Simulator</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                Bidirectional
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Clock in, switch work locations, or start a break on the mobile phone on the left — and watch the enterprise dashboard on the right update instantly in real time.
            </p>
          </div>
        </div>

        {lastPunchEvent && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2 self-start md:self-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-[11px]">
              <span className="text-slate-400">Latest Sync: </span>
              <strong className="text-slate-200">{lastPunchEvent.employeeName}</strong>
              <span className="text-emerald-400 ml-1 capitalize">
                ({lastPunchEvent.type.replace('_', ' ')})
              </span>
              <span className="text-slate-400 font-mono ml-1.5">{lastPunchEvent.time}</span>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-side layout */}
      <div className="flex flex-col xl:flex-row items-start gap-6 w-full">
        {/* Left Column: Employee Mobile App Experience */}
        <div className="w-full xl:w-[450px] shrink-0 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-slate-200">Employee Mobile Device</span>
            </div>
            <span className="text-[11px] text-slate-400">iOS / Android PWA</span>
          </div>

          <MobileApp inSimulatorFrame={true} />
        </div>

        {/* Right Column: HR / Operations Admin View */}
        <div className="flex-1 w-full min-w-0 bg-slate-900/60 rounded-3xl border border-slate-800/80 p-2 sm:p-4">
          <div className="flex items-center gap-2 mb-2 px-2 pt-2">
            <Monitor className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200">Operations & HR Portal (Live Feed)</span>
          </div>
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
};
