import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Building,
  Home,
  Briefcase,
  CheckCircle2,
  Clock,
  Coffee,
  ChevronRight,
  UserCheck,
  Check,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { Employee, WorkMode } from '../../types/attendance';

export const MobileTeamTab: React.FC = () => {
  const { employees, activeEmployeeId, setActiveEmployeeId, addEmployee, geofenceZones } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding an employee
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Employee['department']>('Engineering');
  const [workPreference, setWorkPreference] = useState<Employee['workModePreference']>('hybrid');
  const [shiftName, setShiftName] = useState('Standard Flexible Shift');
  const [addFeedback, setAddFeedback] = useState(false);

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDept === 'all' || emp.department === selectedDept;
    return matchSearch && matchDept;
  });

  const presentCount = employees.filter((e) => e.currentStatus === 'present' || e.currentStatus === 'remote').length;

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !email.trim()) return;

    // Use avatar from list or fallback
    const defaultAvatars = [
      employees[0].avatarUrl,
      employees[1]?.avatarUrl || employees[0].avatarUrl,
      employees[2]?.avatarUrl || employees[0].avatarUrl,
    ];
    const pickedAvatar = defaultAvatars[employees.length % defaultAvatars.length];

    addEmployee({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      department,
      avatarUrl: pickedAvatar,
      workModePreference: workPreference,
      shiftSchedule: {
        name: shiftName,
        coreStart: '10:00',
        coreEnd: '16:00',
        flexibleWindowStart: '07:30',
        flexibleWindowEnd: '10:30',
        standardHours: 8,
      },
      assignedGeofenceId: geofenceZones[0].id,
      leaveBalances: {
        paidTimeOff: 15,
        sickLeave: 8,
        casualLeave: 4,
        compOff: 1,
      },
    });

    setAddFeedback(true);
    setTimeout(() => {
      setAddFeedback(false);
      setShowAddModal(false);
      setName('');
      setEmail('');
      setRole('');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-3.5 text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Colleagues & Attendance</span>
          </h3>
          <p className="text-[11px] text-slate-400">View team locations and live punch statuses</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Team Summary Strip */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <span className="text-xs font-semibold text-slate-300">Staff Headcount</span>
          <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
            {presentCount} / {employees.length} Active Today
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-sky-900/30">
            <span className="text-[10px] text-sky-400 font-medium block">Office Campus</span>
            <span className="font-mono text-sm font-bold text-slate-200 tabular-nums">
              {employees.filter((e) => e.currentStatus === 'present' && e.currentWorkMode === 'office').length}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/60 border border-indigo-900/30">
            <span className="text-[10px] text-indigo-400 font-medium block">Remote WFH</span>
            <span className="font-mono text-sm font-bold text-slate-200 tabular-nums">
              {employees.filter((e) => e.currentStatus === 'remote' || (e.currentStatus === 'present' && e.currentWorkMode === 'remote')).length}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/60 border border-amber-900/30">
            <span className="text-[10px] text-amber-400 font-medium block">On Rest Break</span>
            <span className="font-mono text-sm font-bold text-slate-200 tabular-nums">
              {employees.filter((e) => e.currentStatus === 'on_break').length}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Department Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleagues..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">All Teams</option>
          <option value="Product & Design">Product & Design</option>
          <option value="Engineering">Engineering</option>
          <option value="Operations">Operations</option>
          <option value="Field & Sales">Field & Sales</option>
          <option value="Human Resources">HR</option>
        </select>
      </div>

      {/* Employees Directory List */}
      <div className="flex flex-col gap-2">
        {filteredEmployees.map((emp) => {
          const isMe = emp.id === activeEmployeeId;
          const isPresent = emp.currentStatus === 'present';
          const isRemote = emp.currentStatus === 'remote';
          const isOnBreak = emp.currentStatus === 'on_break';

          return (
            <div
              key={emp.id}
              onClick={() => setActiveEmployeeId(emp.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isMe
                  ? 'bg-sky-950/30 border-sky-500/40 shadow-sm'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={emp.avatarUrl}
                    alt={emp.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-950 ${
                      isPresent
                        ? 'bg-emerald-400'
                        : isRemote
                        ? 'bg-indigo-400'
                        : isOnBreak
                        ? 'bg-amber-400'
                        : 'bg-slate-500'
                    }`}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-slate-100 truncate">{emp.name}</span>
                    {isMe && (
                      <span className="text-[10px] font-bold text-sky-400 bg-sky-500/20 px-1.5 py-0.2 rounded font-mono">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block truncate">{emp.role}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span>{emp.department}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{emp.currentWorkMode}</span>
                  </div>
                </div>
              </div>

              {/* Status & Switch action */}
              <div className="text-right shrink-0">
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                    isPresent
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : isRemote
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      : isOnBreak
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isOnBreak ? 'On Break' : isPresent ? 'In Office' : isRemote ? 'Remote' : 'Clocked Out'}
                </span>
                {emp.todayClockInTime && (
                  <span className="block font-mono text-[10px] text-slate-400 mt-1 tabular-nums">
                    In: {emp.todayClockInTime}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl text-xs">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mb-1">
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Add Team Member</span>
            </h4>
            <p className="text-slate-400 text-[11px] mb-3">Add a new staff member to the attendance directory.</p>

            <form onSubmit={handleAddEmployeeSubmit} className="flex flex-col gap-2.5">
              <div>
                <label className="text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Job Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. UX Architect"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Work Preference</label>
                  <select
                    value={workPreference}
                    onChange={(e) => setWorkPreference(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote</option>
                    <option value="on_site">On-Site Campus</option>
                    <option value="flexible">Flexible Field</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="Product & Design">Product & Design</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Field & Sales">Field & Sales</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jordan.hayes@flexipulse.work"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addFeedback}
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {addFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Employee Added!</span>
                    </>
                  ) : (
                    <span>Add Employee</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
