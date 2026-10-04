import React, { useState } from 'react';
import {
  Clock,
  CalendarCheck,
  Calendar,
  Layers,
  Wifi,
  BatteryMedium,
  UserCheck,
  ChevronDown,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { MobileClockInTab } from './MobileClockInTab';
import { MobileTeamTab } from './MobileTeamTab';
import { MobileTimesheetTab } from './MobileTimesheetTab';
import { MobileLeaveTab } from './MobileLeaveTab';
import { MobileScheduleTab } from './MobileScheduleTab';
import { LiveMobileClock } from './LiveMobileClock';
import { SyncStatusIndicator } from './SyncStatusIndicator';

interface MobileAppProps {
  inSimulatorFrame?: boolean;
}

export const MobileApp: React.FC<MobileAppProps> = ({ inSimulatorFrame = true }) => {
  const { employees, activeEmployee, setActiveEmployeeId, isUpcomingShiftWithinHour, upcomingShiftMinutesLeft } = useAttendance();
  const [activeTab, setActiveTab] = useState<'punch' | 'team' | 'timesheet' | 'leave' | 'schedule'>('punch');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <div
      className={`relative mx-auto flex flex-col transition-all ${
        inSimulatorFrame
          ? 'w-[380px] sm:w-[410px] h-[830px] rounded-[44px] p-3.5 bg-slate-950 border-[6px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]'
          : 'w-full max-w-md min-h-screen bg-slate-950 p-2'
      }`}
    >
      {/* Smartphone Chassis Dynamic Island / Speaker notch */}
      {inSimulatorFrame && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-950 mr-3" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>
      )}

      {/* Screen Frame Container */}
      <div className="relative flex-1 flex flex-col overflow-hidden bg-slate-950 rounded-[34px] border border-slate-800/80">
        {/* Mobile Device Status Bar with Live Local Time */}
        <div className="pt-2.5 px-6 pb-1 flex items-center justify-between text-[11px] font-mono font-medium text-slate-400 select-none shrink-0 z-20">
          <LiveMobileClock variant="status-bar" showSeconds={false} />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-sans font-bold">5G</span>
            <Wifi className="w-3 h-3 text-slate-400" />
            <BatteryMedium className="w-4 h-4 text-slate-300" />
          </div>
        </div>

        {/* Mobile App Header with Live Digital Clock & Sync Status Indicator */}
        <header className="px-3.5 py-2.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 flex items-center justify-between shrink-0 z-20 gap-2">
          {/* Left: Active Persona */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <img
                src={activeEmployee.avatarUrl}
                alt={activeEmployee.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm"
              />
              <span
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-slate-950 ${
                  activeEmployee.currentStatus === 'present'
                    ? 'bg-emerald-400'
                    : activeEmployee.currentStatus === 'remote'
                    ? 'bg-indigo-400'
                    : activeEmployee.currentStatus === 'on_break'
                    ? 'bg-amber-400'
                    : 'bg-slate-500'
                }`}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-100 truncate">{activeEmployee.name}</span>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="text-slate-400 hover:text-slate-200 p-0.5 shrink-0 cursor-pointer"
                  title="Switch test persona"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block truncate max-w-[95px] sm:max-w-[110px]">
                {activeEmployee.role}
              </span>
            </div>
          </div>

          {/* Right: Live Digital Clock & Sync Status Indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <LiveMobileClock
              variant="header-badge"
              showSeconds={true}
              showIcon={false}
              showLivePulse={true}
            />
            <SyncStatusIndicator />
          </div>
        </header>

        {/* Persona Switcher Dropdown (inside mobile) */}
        {showUserDropdown && (
          <div className="absolute top-20 inset-x-4 z-40 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Switch Employee Mobile View
            </div>
            {employees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => {
                  setActiveEmployeeId(emp.id);
                  setShowUserDropdown(false);
                }}
                className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition-colors cursor-pointer ${
                  emp.id === activeEmployee.id
                    ? 'bg-sky-500/15 text-sky-200 border border-sky-400/30'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <img
                  src={emp.avatarUrl}
                  alt={emp.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold block truncate">{emp.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{emp.role}</span>
                </div>
                {emp.id === activeEmployee.id && <UserCheck className="w-3.5 h-3.5 text-sky-400" />}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Screen Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 scroll-smooth">
          {activeTab === 'punch' && <MobileClockInTab />}
          {activeTab === 'team' && <MobileTeamTab />}
          {activeTab === 'timesheet' && <MobileTimesheetTab />}
          {activeTab === 'leave' && <MobileLeaveTab />}
          {activeTab === 'schedule' && (
            <MobileScheduleTab onNavigateToClockIn={() => setActiveTab('punch')} />
          )}
        </div>

        {/* Ergonomic Bottom Navigation Tab Bar with 5 Destinations */}
        <nav className="absolute bottom-0 inset-x-0 h-16 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 grid grid-cols-5 items-center z-30">
          <button
            onClick={() => setActiveTab('punch')}
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
              activeTab === 'punch' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight mt-1">Clock In</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`relative flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
              activeTab === 'team' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight mt-1">Employees</span>
          </button>

          <button
            onClick={() => setActiveTab('timesheet')}
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
              activeTab === 'timesheet' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight mt-1">Activity</span>
          </button>

          <button
            onClick={() => setActiveTab('leave')}
            className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
              activeTab === 'leave' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight mt-1">Time Off</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`relative flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
              activeTab === 'schedule' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isUpcomingShiftWithinHour ? `Upcoming shift starting in ${upcomingShiftMinutesLeft}m` : 'Schedule'}
          >
            <div className="relative">
              <Calendar className="w-4 h-4" />
              {isUpcomingShiftWithinHour && (
                <span
                  className="absolute -top-1 -right-1.5 flex h-2 w-2"
                  aria-label="Upcoming shift notification"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 ring-1 ring-slate-950" />
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium tracking-tight mt-1 flex items-center gap-0.5">
              Schedule
              {isUpcomingShiftWithinHour && (
                <span className="w-1 h-1 rounded-full bg-amber-400 inline-block" />
              )}
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
};
