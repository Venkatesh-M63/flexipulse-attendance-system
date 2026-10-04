import React, { useState } from 'react';
import {
  Users,
  Layers,
  FileCheck2,
  Sliders,
  Sparkles,
  Shield,
  Download,
  Building,
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { LiveAttendanceFeed } from './LiveAttendanceFeed';
import { TimesheetsTable } from './TimesheetsTable';
import { ApprovalsPanel } from './ApprovalsPanel';
import { PolicyConfigModal } from './PolicyConfigModal';
import { AdminEmployeesPanel } from './AdminEmployeesPanel';

export const AdminDashboard: React.FC = () => {
  const { leaveRequests, regularizationRequests, policy, employees } = useAttendance();
  const [activeTab, setActiveTab] = useState<'feed' | 'directory' | 'timesheets' | 'approvals'>('feed');
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const pendingCount =
    leaveRequests.filter((l) => l.status === 'pending').length +
    regularizationRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Top Console Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">
              Operations & People Management
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{policy.companyName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Attendance & Mobile Workforce Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time synchronization across smartphone clock-ins, geofenced campuses, and remote team logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPolicyModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Shift & Geofence Rules</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Buttons */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800/80 rounded-xl w-fit mb-6 overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span>Live Team Presence</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-sky-400" />
          <span>Staff Directory ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timesheets')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'timesheets'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Timesheet Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Approvals Queue</span>
          {pendingCount > 0 && (
            <span className="font-mono text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="flex-1">
        {activeTab === 'feed' && <LiveAttendanceFeed />}
        {activeTab === 'directory' && <AdminEmployeesPanel />}
        {activeTab === 'timesheets' && <TimesheetsTable />}
        {activeTab === 'approvals' && <ApprovalsPanel />}
      </div>

      {/* Policy Modal */}
      <PolicyConfigModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
      />
    </div>
  );
};
