import React from 'react';
import { Check, X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

export const ApprovalsPanel: React.FC = () => {
  const {
    leaveRequests,
    regularizationRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    approveRegularization,
    rejectRegularization,
  } = useAttendance();

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');
  const pendingRegs = regularizationRequests.filter((r) => r.status === 'pending');

  return (
    <div className="flex flex-col gap-6">
      {/* Pending Leave Requests */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Time-Off & Leave Applications</h3>
            <p className="text-xs text-slate-400">Review PTO, sick leave, and remote telework requests</p>
          </div>
          <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
            {pendingLeaves.length} Pending
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {pendingLeaves.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              All leave requests have been reviewed and resolved.
            </div>
          ) : (
            pendingLeaves.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={req.employeeAvatar}
                    alt={req.employeeName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{req.employeeName}</span>
                      <span className="text-slate-500">·</span>
                      <span className="font-medium text-amber-300 capitalize">
                        {req.type.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : ''}
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] text-slate-400 italic">
                      &quot;{req.reason}&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => rejectLeaveRequest(req.id)}
                    className="px-3 py-1.5 rounded-lg border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => approveLeaveRequest(req.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pending Punch Corrections / Regularizations */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Punch Regularization Requests</h3>
            <p className="text-xs text-slate-400">Adjustments for missed mobile punches or device battery outages</p>
          </div>
          <span className="font-mono text-xs font-semibold text-sky-400 bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded">
            {pendingRegs.length} Pending
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {pendingRegs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No punch regularization requests pending approval.
            </div>
          ) : (
            pendingRegs.map((reg) => (
              <div
                key={reg.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={reg.employeeAvatar}
                    alt={reg.employeeName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{reg.employeeName}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">Target Date: {reg.date}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-300 font-mono">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>Proposed: {reg.proposedClockIn} — {reg.proposedClockOut}</span>
                    </div>

                    <p className="mt-1 text-[11px] text-slate-400 italic">
                      &quot;{reg.reason}&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => rejectRegularization(reg.id)}
                    className="px-3 py-1.5 rounded-lg border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => approveRegularization(reg.id)}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Adjustment</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
