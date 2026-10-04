import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Clock,
  Camera,
  Coffee,
  CheckCircle2,
  Building,
  Home,
  Briefcase,
  Search,
  Filter,
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { AttendanceStatus } from '../../types/attendance';

export const LiveAttendanceFeed: React.FC = () => {
  const { employees, punches, setActiveEmployeeId, setViewMode } = useAttendance();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Stats calculation
  const totalEmployees = employees.length;
  const presentOffice = employees.filter((e) => e.currentStatus === 'present' && e.currentWorkMode === 'office').length;
  const remoteCount = employees.filter((e) => e.currentStatus === 'remote' || (e.currentStatus === 'present' && e.currentWorkMode === 'remote')).length;
  const fieldCount = employees.filter((e) => e.currentWorkMode === 'field').length;
  const onBreakCount = employees.filter((e) => e.currentStatus === 'on_break').length;

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDept === 'all' || emp.department === selectedDept;
    const matchStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'present' && (emp.currentStatus === 'present' || emp.currentStatus === 'remote')) ||
      (selectedStatus === 'break' && emp.currentStatus === 'on_break') ||
      (selectedStatus === 'out' && emp.currentStatus === 'clocked_out');

    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Top Metric Strip (Tabular Figures, clean unboxed metadata) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Staff</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-100 tabular-nums">
            {totalEmployees}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active Mobile Roster</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>On-Site Campus</span>
            <Building className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-sky-400 tabular-nums">
            {presentOffice}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Geofence Verified</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Remote (WFH)</span>
            <Home className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-indigo-400 tabular-nums">
            {remoteCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Telework Authorized</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Field & Client</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-amber-400 tabular-nums">
            {fieldCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">GPS Tagged</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>On Break</span>
            <Coffee className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-orange-400 tabular-nums">
            {onBreakCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Paused Work Timer</span>
        </div>
      </div>

      {/* Real-Time Team Presence Roster */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {/* Section Header with Search & Filter */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Live Team Presence Board</h3>
            <p className="text-xs text-slate-400">Real-time status synced directly from employee mobile devices</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff or role..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Departments</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Engineering">Engineering</option>
                <option value="Field & Sales">Field & Sales</option>
                <option value="Human Resources">Human Resources</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="present">Active & Working</option>
                <option value="break">On Break</option>
                <option value="out">Clocked Out</option>
              </select>
            </div>
          </div>
        </div>

        {/* High Density Team Grid */}
        <div className="divide-y divide-slate-800/80">
          {filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No staff members matched your filter criteria.
            </div>
          ) : (
            filteredEmployees.map((emp) => {
              const statusConfig: Record<
                AttendanceStatus,
                { label: string; dotClass: string; textClass: string }
              > = {
                present: {
                  label: emp.currentWorkMode === 'office' ? 'In Office' : 'Working Field',
                  dotClass: 'bg-emerald-400',
                  textClass: 'text-emerald-400',
                },
                remote: {
                  label: 'Working Remote',
                  dotClass: 'bg-indigo-400',
                  textClass: 'text-indigo-400',
                },
                on_break: {
                  label: 'On Break',
                  dotClass: 'bg-amber-400',
                  textClass: 'text-amber-400',
                },
                clocked_out: {
                  label: 'Clocked Out',
                  dotClass: 'bg-slate-500',
                  textClass: 'text-slate-400',
                },
                late: {
                  label: 'Late Check-in',
                  dotClass: 'bg-rose-400',
                  textClass: 'text-rose-400',
                },
                on_leave: {
                  label: 'On Leave',
                  dotClass: 'bg-purple-400',
                  textClass: 'text-purple-400',
                },
              };

              const statusInfo = statusConfig[emp.currentStatus];

              return (
                <div
                  key={emp.id}
                  className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={emp.avatarUrl}
                        alt={emp.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${statusInfo.dotClass}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100">{emp.name}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{emp.department}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">{emp.role}</span>
                    </div>
                  </div>

                  {/* Middle: Shift & Today Work Time */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-400 block">Today&apos;s In Time</span>
                      <span className="font-mono text-slate-200 font-medium tabular-nums">
                        {emp.todayClockInTime || '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Worked Total</span>
                      <span className="font-mono text-slate-200 font-medium tabular-nums">
                        {Math.floor(emp.todayWorkedMinutes / 60)}h {emp.todayWorkedMinutes % 60}m
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Work Mode</span>
                      <span className="text-slate-200 capitalize flex items-center gap-1 font-medium">
                        {emp.currentWorkMode === 'office' ? (
                          <Building className="w-3 h-3 text-sky-400" />
                        ) : emp.currentWorkMode === 'remote' ? (
                          <Home className="w-3 h-3 text-indigo-400" />
                        ) : (
                          <Briefcase className="w-3 h-3 text-amber-400" />
                        )}
                        {emp.currentWorkMode}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status badge & Test simulator trigger */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        emp.currentStatus === 'present'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : emp.currentStatus === 'remote'
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                          : emp.currentStatus === 'on_break'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                      {statusInfo.label}
                    </span>

                    <button
                      onClick={() => {
                        setActiveEmployeeId(emp.id);
                        setViewMode('split');
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-[11px]"
                      title="Open this user in mobile simulator"
                    >
                      Test Mobile
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Live Punch Audit Stream */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-slate-100">Live Clock-In Audit Trail</h4>
            <p className="text-xs text-slate-400">Incoming timestamped punches with device & location metadata</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live WebSocket Gateway
          </span>
        </div>

        <div className="mt-3 divide-y divide-slate-800/60 max-h-80 overflow-y-auto pr-1">
          {punches.slice(0, 10).map((punch) => {
            const emp = employees.find((e) => e.id === punch.employeeId);
            const isClockIn = punch.type === 'clock_in';
            const isClockOut = punch.type === 'clock_out';

            return (
              <div
                key={punch.id}
                className="py-3 flex items-start justify-between gap-3 text-xs hover:bg-slate-950/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                      isClockIn
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isClockOut
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{emp?.name || 'Staff Member'}</span>
                      <span className="text-slate-500">·</span>
                      <span className="font-medium text-slate-300 capitalize">
                        {punch.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded capitalize">
                        {punch.workMode}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                      <span>{punch.deviceInfo}</span>
                      {punch.location?.geofenceName && (
                        <span className="flex items-center gap-0.5 text-slate-300">
                          <MapPin className="w-3 h-3 text-sky-400" />
                          {punch.location.geofenceName}
                        </span>
                      )}
                      {punch.photoUrl && (
                        <span className="flex items-center gap-0.5 text-emerald-400">
                          <Camera className="w-3 h-3" />
                          Photo Verified
                        </span>
                      )}
                    </div>

                    {punch.note && (
                      <p className="text-[11px] text-slate-400 italic mt-0.5">
                        &quot;{punch.note}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs text-slate-300 tabular-nums">
                    {new Date(punch.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {new Date(punch.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
