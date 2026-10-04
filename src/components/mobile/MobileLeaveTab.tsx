import React, { useState } from 'react';
import { Calendar, Plus, Clock, FileText } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { LeaveRequest } from '../../types/attendance';

export const MobileLeaveTab: React.FC = () => {
  const { activeEmployee, leaveRequests, submitLeaveRequest } = useAttendance();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('paid_time_off');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-16');
  const [reason, setReason] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  // My requests
  const myRequests = leaveRequests.filter((l) => l.employeeId === activeEmployee.id);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    submitLeaveRequest({
      type: leaveType,
      startDate,
      endDate,
      reason: reason.trim(),
    });

    setSubmittedFeedback(true);
    setTimeout(() => {
      setSubmittedFeedback(false);
      setShowApplyModal(false);
      setReason('');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4 text-slate-100">
      {/* Header and Apply Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Leave & Time Off</h3>
          <p className="text-[11px] text-slate-400">Manage PTO and remote work days</p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium hover:bg-emerald-500/25 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Paid Time Off (PTO)</span>
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-100 tabular-nums">
            {activeEmployee.leaveBalances.paidTimeOff}
            <span className="text-xs font-normal text-slate-400 ml-1">days</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Sick & Health</span>
            <Clock className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-100 tabular-nums">
            {activeEmployee.leaveBalances.sickLeave}
            <span className="text-xs font-normal text-slate-400 ml-1">days</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Casual & Personal</span>
            <FileText className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-100 tabular-nums">
            {activeEmployee.leaveBalances.casualLeave}
            <span className="text-xs font-normal text-slate-400 ml-1">days</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Compensatory Off</span>
            <Clock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-100 tabular-nums">
            {activeEmployee.leaveBalances.compOff}
            <span className="text-xs font-normal text-slate-400 ml-1">days</span>
          </div>
        </div>
      </div>

      {/* Leave History Feed */}
      <div className="flex flex-col gap-2 mt-1">
        <span className="text-xs font-semibold text-slate-300">My Applications & History</span>

        {myRequests.length === 0 ? (
          <div className="text-center py-6 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No active leave requests. Click Apply Leave above to submit one.
          </div>
        ) : (
          myRequests.map((req) => (
            <div
              key={req.id}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col gap-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 capitalize">
                  {req.type.replace(/_/g, ' ')}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    req.status === 'approved'
                      ? 'text-emerald-400'
                      : req.status === 'rejected'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {req.status === 'pending'
                    ? 'Pending Approval'
                    : req.status === 'approved'
                    ? 'Approved'
                    : 'Rejected'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : ''}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-lg italic">
                &quot;{req.reason}&quot;
              </p>

              {req.reviewNotes && (
                <div className="text-[10px] text-slate-300 border-t border-slate-800/80 pt-1.5">
                  <span className="text-slate-400">Review Note:</span> {req.reviewNotes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal to apply */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Apply for Time Off</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Request will be routed to your department supervisor.
            </p>

            <form onSubmit={handleApply} className="mt-3 flex flex-col gap-2.5">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveRequest['type'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="paid_time_off">Paid Time Off (PTO)</option>
                  <option value="sick_leave">Sick / Medical Leave</option>
                  <option value="casual_leave">Casual / Personal Leave</option>
                  <option value="remote_work_day">Authorized Remote Day</option>
                  <option value="half_day">Half Day Off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Reason / Handover note</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Vacation with family; John is covering urgent escalations."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittedFeedback}
                  className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {submittedFeedback ? <span>Request Submitted!</span> : <span>Confirm & Apply</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
