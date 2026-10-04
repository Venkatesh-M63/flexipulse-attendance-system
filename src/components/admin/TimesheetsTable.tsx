import React, { useState } from 'react';
import { Download, Search, Filter, Calendar, MapPin, Camera } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { RECENT_TIMESHEETS } from '../../data/mockData';

export const TimesheetsTable: React.FC = () => {
  const { employees, exportTimesheetCSV } = useAttendance();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const handleDownload = () => {
    const csvData = exportTimesheetCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `flexipulse_attendance_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const records = RECENT_TIMESHEETS.map((r) => {
    const emp = employees.find((e) => e.id === r.employeeId);
    return {
      ...r,
      employeeName: emp?.name || 'Staff Member',
      department: emp?.department || 'Operations',
      avatarUrl: emp?.avatarUrl,
      role: emp?.role,
    };
  }).filter((item) => {
    const matchSearch =
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = deptFilter === 'all' || item.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search timesheet records..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Departments</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Engineering">Engineering</option>
              <option value="Field & Sales">Field & Sales</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">First Clock In</th>
              <th className="py-3 px-4">Last Clock Out</th>
              <th className="py-3 px-4">Work Mode</th>
              <th className="py-3 px-4 text-right">Break</th>
              <th className="py-3 px-4 text-right">Total Hours</th>
              <th className="py-3 px-4 text-right">Overtime</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-200">
            {records.map((row) => {
              const hours = Math.floor(row.totalWorkedMinutes / 60);
              const mins = row.totalWorkedMinutes % 60;

              return (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={row.avatarUrl}
                        alt={row.employeeName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-semibold block">{row.employeeName}</span>
                        <span className="text-[10px] text-slate-400">{row.department}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 tabular-nums">
                    {row.date}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                    {row.clockInTime || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                    {row.clockOutTime || '—'}
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <span className="text-slate-300">{row.workMode}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                    {row.totalBreakMinutes}m
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-100">
                    {hours}h {mins}m
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                    {row.overtimeMinutes > 0 ? (
                      <span className="text-amber-400">+{row.overtimeMinutes}m</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.isRegularized ? (
                      <span className="text-[10px] text-sky-300 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded">
                        Regularized
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
