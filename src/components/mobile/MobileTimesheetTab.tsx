import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Camera,
  PlusCircle,
  CheckCircle2,
  FileCheck2,
  Building,
  Home,
  Briefcase,
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { RECENT_TIMESHEETS } from '../../data/mockData';

export const MobileTimesheetTab: React.FC = () => {
  const { activeEmployee, punches, regularizationRequests, submitRegularization } = useAttendance();

  const [showReqModal, setShowReqModal] = useState(false);
  const [targetDate, setTargetDate] = useState('2026-10-02');
  const [proposedIn, setProposedIn] = useState('08:30 AM');
  const [proposedOut, setProposedOut] = useState('05:30 PM');
  const [regReason, setRegReason] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  // Filter punches for active employee
  const myPunches = punches.filter((p) => p.employeeId === activeEmployee.id);
  const myRegs = regularizationRequests.filter((r) => r.employeeId === activeEmployee.id);

  const handleSubmitRegularization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regReason.trim()) return;

    submitRegularization({
      date: targetDate,
      proposedClockIn: proposedIn,
      proposedClockOut: proposedOut,
      reason: regReason.trim(),
    });

    setSubmittedFeedback(true);
    setTimeout(() => {
      setSubmittedFeedback(false);
      setShowReqModal(false);
      setRegReason('');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4 text-slate-100">
      {/* Header and Regularize action */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Activity & Timesheet</h3>
          <p className="text-[11px] text-slate-400">Personal mobile punch audit trail</p>
        </div>

        <button
          onClick={() => setShowReqModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-medium hover:bg-sky-500/25 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Missed Punch?</span>
        </button>
      </div>

      {/* Week Summary Stats Card */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3.5">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <span className="text-xs font-semibold text-slate-300">Weekly Performance</span>
          <span className="text-[11px] text-slate-400 font-mono">Week 40 · 2026</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Total Worked</span>
            <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">38h 15m</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Overtime</span>
            <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">+1h 45m</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">On-Time Rate</span>
            <span className="font-mono text-sm font-bold text-sky-400 tabular-nums">98.5%</span>
          </div>
        </div>
      </div>

      {/* Pending Regularizations (if any) */}
      {myRegs.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-300">Adjustment Requests</span>
          {myRegs.map((reg) => (
            <div
              key={reg.id}
              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Date: {reg.date}</span>
                <span
                  className={`text-[11px] font-medium ${
                    reg.status === 'approved'
                      ? 'text-emerald-400'
                      : reg.status === 'rejected'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {reg.status === 'pending'
                    ? 'Under Review'
                    : reg.status === 'approved'
                    ? 'Approved'
                    : 'Rejected'}
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Adjusted: {reg.proposedClockIn} → {reg.proposedClockOut}
              </div>
              <div className="text-slate-400 text-[11px] italic bg-slate-950/40 p-1.5 rounded">
                &quot;{reg.reason}&quot;
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Punches Feed */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-300">Today&apos;s Mobile Punches</span>

        {myPunches.length === 0 ? (
          <div className="text-center py-6 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No punches recorded today yet. Use the Clock In tab to log your start.
          </div>
        ) : (
          myPunches.slice(0, 6).map((punch) => {
            const isClockIn = punch.type === 'clock_in';
            const isClockOut = punch.type === 'clock_out';
            const isBreak = punch.type === 'break_start' || punch.type === 'break_end';

            const punchTime = new Date(punch.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={punch.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-start gap-3"
              >
                {/* Mode Icon */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isClockIn
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isClockOut
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 capitalize">
                      {punch.type.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs font-medium text-slate-300 tabular-nums">
                      {punchTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      {punch.workMode === 'office' ? (
                        <Building className="w-3 h-3 text-sky-400" />
                      ) : punch.workMode === 'remote' ? (
                        <Home className="w-3 h-3 text-indigo-400" />
                      ) : (
                        <Briefcase className="w-3 h-3 text-amber-400" />
                      )}
                      <span className="capitalize">{punch.workMode}</span>
                    </span>

                    {punch.location && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Location Verified
                        </span>
                      </>
                    )}
                  </div>

                  {punch.note && (
                    <p className="text-[11px] text-slate-400 mt-1 italic truncate">
                      &quot;{punch.note}&quot;
                    </p>
                  )}

                  {/* Photo verification badge if captured */}
                  {punch.photoUrl && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded w-fit">
                      <Camera className="w-3 h-3" />
                      <span>Photo Verified Face Match</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Historical Days Section */}
      <div className="flex flex-col gap-2 mt-1">
        <span className="text-xs font-semibold text-slate-300">Previous Day Logs</span>
        {RECENT_TIMESHEETS.filter((r) => r.employeeId === activeEmployee.id).map((rec) => (
          <div
            key={rec.id}
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-200">{rec.date}</span>
                {rec.isRegularized && (
                  <span className="text-[10px] text-sky-400 bg-sky-950/60 border border-sky-800/40 px-1.5 rounded">
                    Adjusted
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                In: {rec.clockInTime} · Out: {rec.clockOutTime}
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold text-slate-200 tabular-nums">
                {Math.floor(rec.totalWorkedMinutes / 60)}h {rec.totalWorkedMinutes % 60}m
              </span>
              <span className="block text-[10px] text-emerald-400">Regular 8h Met</span>
            </div>
          </div>
        ))}
      </div>

      {/* Regularization Modal */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-sky-400" />
              <span>Missed Punch Regularization</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Submit your actual working hours for supervisor approval.
            </p>

            <form onSubmit={handleSubmitRegularization} className="mt-3 flex flex-col gap-2.5">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Actual Clock In</label>
                  <input
                    type="text"
                    value={proposedIn}
                    onChange={(e) => setProposedIn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Actual Clock Out</label>
                  <input
                    type="text"
                    value={proposedOut}
                    onChange={(e) => setProposedOut(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Reason for Adjustment</label>
                <textarea
                  rows={3}
                  value={regReason}
                  onChange={(e) => setRegReason(e.target.value)}
                  placeholder="e.g. Phone battery drained during evening commute; worked until 5:30 PM."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 resize-none"
                  required
                />
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowReqModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittedFeedback}
                  className="flex-1 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {submittedFeedback ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                      <span>Submitted!</span>
                    </>
                  ) : (
                    <span>Submit Request</span>
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
