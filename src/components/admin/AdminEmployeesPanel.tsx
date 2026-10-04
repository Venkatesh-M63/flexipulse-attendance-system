import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Building,
  Home,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  Filter,
  Check,
  Smartphone,
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { Employee } from '../../types/attendance';

export const AdminEmployeesPanel: React.FC = () => {
  const { employees, activeEmployeeId, setActiveEmployeeId, setViewMode, addEmployee, geofenceZones } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Employee['department']>('Engineering');
  const [workPreference, setWorkPreference] = useState<Employee['workModePreference']>('hybrid');
  const [shiftName, setShiftName] = useState('Standard Flexible Shift');
  const [assignedGeofence, setAssignedGeofence] = useState(geofenceZones[0].id);

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDept === 'all' || emp.department === selectedDept;
    const matchMode = selectedMode === 'all' || emp.workModePreference === selectedMode;
    return matchSearch && matchDept && matchMode;
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !email.trim()) return;

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
      assignedGeofenceId: assignedGeofence,
      leaveBalances: {
        paidTimeOff: 18,
        sickLeave: 10,
        casualLeave: 5,
        compOff: 2,
      },
    });

    setShowAddModal(false);
    setName('');
    setEmail('');
    setRole('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 max-w-xs min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff, role, email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Departments</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Engineering">Engineering</option>
              <option value="Operations">Operations</option>
              <option value="Field & Sales">Field & Sales</option>
              <option value="Human Resources">Human Resources</option>
            </select>

            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Work Modes</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote WFH</option>
              <option value="on_site">On-Site Campus</option>
              <option value="flexible">Flexible Field</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* High Density Employee Roster Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-[11px] font-semibold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Assigned Shift</th>
                <th className="py-3 px-4">Primary Campus</th>
                <th className="py-3 px-4">Work Preference</th>
                <th className="py-3 px-4 text-center">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredEmployees.map((emp) => {
                const isSelected = emp.id === activeEmployeeId;
                const isPresent = emp.currentStatus === 'present';
                const isRemote = emp.currentStatus === 'remote';
                const isOnBreak = emp.currentStatus === 'on_break';
                const assignedZone = geofenceZones.find((z) => z.id === emp.assignedGeofenceId) || geofenceZones[0];

                return (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Avatar & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-slate-100 block">{emp.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{emp.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="py-3 px-4">
                      <span className="text-slate-200 block">{emp.role}</span>
                      <span className="text-[10px] text-slate-400">{emp.department}</span>
                    </td>

                    {/* Shift */}
                    <td className="py-3 px-4">
                      <span className="text-slate-200 font-medium block truncate max-w-[150px]">
                        {emp.shiftSchedule.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {emp.shiftSchedule.coreStart} - {emp.shiftSchedule.coreEnd} ({emp.shiftSchedule.standardHours}h)
                      </span>
                    </td>

                    {/* Campus Geofence */}
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{assignedZone.name}</span>
                      </span>
                    </td>

                    {/* Mode */}
                    <td className="py-3 px-4 capitalize">
                      <span className="inline-flex items-center gap-1 text-slate-300 text-[11px]">
                        {emp.workModePreference === 'on_site' ? (
                          <Building className="w-3 h-3 text-sky-400" />
                        ) : emp.workModePreference === 'remote' ? (
                          <Home className="w-3 h-3 text-indigo-400" />
                        ) : (
                          <Briefcase className="w-3 h-3 text-amber-400" />
                        )}
                        {emp.workModePreference.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
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
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveEmployeeId(emp.id);
                          setViewMode('split');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                        title="Simulate this employee on mobile"
                      >
                        {isSelected ? 'Active Profile' : 'Simulate Mobile'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-xs text-slate-100">
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Add Staff Member</span>
            </h4>
            <p className="text-slate-400 text-xs mb-3">Provision employee profile, shift rules, and assigned campus.</p>

            <form onSubmit={handleAddEmployee} className="flex flex-col gap-3">
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
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jordan.hayes@flexipulse.work"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Work Mode</label>
                  <select
                    value={workPreference}
                    onChange={(e) => setWorkPreference(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote WFH</option>
                    <option value="on_site">On-Site Campus</option>
                    <option value="flexible">Flexible Field</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Assigned Campus</label>
                  <select
                    value={assignedGeofence}
                    onChange={(e) => setAssignedGeofence(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {geofenceZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
