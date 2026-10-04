import React, { useState } from 'react';
import { Sliders, X, Check, ShieldCheck, MapPin, Camera, Clock } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

interface PolicyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyConfigModal: React.FC<PolicyConfigModalProps> = ({ isOpen, onClose }) => {
  const { policy, updatePolicy } = useAttendance();

  const [gracePeriod, setGracePeriod] = useState(policy.gracePeriodMinutes);
  const [enforceGeofence, setEnforceGeofence] = useState(policy.enforceGeofence);
  const [requireSelfieRemote, setRequireSelfieRemote] = useState(policy.requireSelfieOnRemote);
  const [requireSelfieOffice, setRequireSelfieOffice] = useState(policy.requireSelfieOnOffice);
  const [allowRegularization, setAllowRegularization] = useState(policy.allowManualRegularization);
  const [autoDeductBreak, setAutoDeductBreak] = useState(policy.autoDeductBreakMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePolicy({
      gracePeriodMinutes: Number(gracePeriod),
      enforceGeofence,
      requireSelfieOnRemote: requireSelfieRemote,
      requireSelfieOnOffice: requireSelfieOffice,
      allowManualRegularization: allowRegularization,
      autoDeductBreakMinutes: Number(autoDeductBreak),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">Flexible Attendance Policies</h3>
              <p className="text-xs text-slate-400">Configure geofencing, grace window, and remote verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 flex flex-col gap-4 text-xs">
          {/* Grace Period */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">Late Arrival Grace Period</span>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                {gracePeriod} minutes
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Employees arriving within this window are not flagged as late.
            </p>
            <input
              type="range"
              min={0}
              max={45}
              step={5}
              value={gracePeriod}
              onChange={(e) => setGracePeriod(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Geofence Enforcement */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-sky-400 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block">Strict Campus Geofence for Office Mode</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Blocks office clock-ins when GPS coordinate is outside company perimeter.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enforceGeofence}
                onChange={(e) => setEnforceGeofence(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500" />
            </label>
          </div>

          {/* Selfie Photo Verification */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-200">Require Photo Verification for Remote WFH</span>
              </div>
              <input
                type="checkbox"
                checked={requireSelfieRemote}
                onChange={(e) => setRequireSelfieRemote(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-900 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-300">Require Photo Verification for Office HQ</span>
              </div>
              <input
                type="checkbox"
                checked={requireSelfieOffice}
                onChange={(e) => setRequireSelfieOffice(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </div>
          </div>

          {/* Manual Regularizations */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200 block">Allow Missed Punch Regularization</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Permits employees to submit punch time adjustments with supervisor sign-off.
              </p>
            </div>
            <input
              type="checkbox"
              checked={allowRegularization}
              onChange={(e) => setAllowRegularization(e.target.checked)}
              className="w-4 h-4 rounded text-sky-500 focus:ring-0 bg-slate-900 border-slate-700"
            />
          </div>

          {/* Auto Deduct Break */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200 block">Meal Break Policy Deduction</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Standard lunch break deduction when shift exceeds 6 hours.
              </p>
            </div>
            <select
              value={autoDeductBreak}
              onChange={(e) => setAutoDeductBreak(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value={30}>30 mins</option>
              <option value={45}>45 mins</option>
              <option value={60}>60 mins</option>
            </select>
          </div>

          {/* Footer buttons */}
          <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savedSuccess}
              className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Policies Updated!</span>
                </>
              ) : (
                <span>Save Company Rules</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
