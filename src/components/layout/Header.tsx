import React from 'react';
import { Smartphone, Monitor, Columns, Download, User } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    employees,
    activeEmployeeId,
    setActiveEmployeeId,
    activeEmployee,
    exportTimesheetCSV,
  } = useAttendance();

  const handleDownload = () => {
    const csvData = exportTimesheetCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `flexipulse_attendance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-sm">
            <span className="text-slate-950 font-black text-base">F</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            FlexiPulse
          </span>
        </div>

        {/* Zone 2: Navigation Links / View Switcher (Single line controls) */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              viewMode === 'split'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Live View</span>
            <span className="sm:hidden">Split</span>
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              viewMode === 'mobile'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App</span>
          </button>

          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              viewMode === 'admin'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {/* Active persona picker */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-slate-400">Employee:</span>
            <select
              value={activeEmployeeId}
              onChange={(e) => setActiveEmployeeId(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-slate-900 text-slate-200">
                  {emp.name} ({emp.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownload}
            title="Download CSV Timesheets"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
