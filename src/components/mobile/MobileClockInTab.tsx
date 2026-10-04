import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Camera,
  QrCode,
  Coffee,
  Play,
  CheckCircle2,
  AlertTriangle,
  Building,
  Home,
  Briefcase,
  WifiOff,
  Navigation,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { WorkMode } from '../../types/attendance';
import { SelfieCameraModal } from './SelfieCameraModal';
import { QRScannerModal } from './QRScannerModal';
import { LocationVerifiedMapPreview } from './LocationVerifiedMapPreview';

export const MobileClockInTab: React.FC = () => {
  const {
    activeEmployee,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    userLocation,
    setUserLocation,
    policy,
    geofenceZones,
    isOffline,
    refreshGPS,
  } = useAttendance();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedWorkMode, setSelectedWorkMode] = useState<WorkMode>(activeEmployee.currentWorkMode || 'office');
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSelfieModal, setShowSelfieModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [liveWorkedSeconds, setLiveWorkedSeconds] = useState(activeEmployee.todayWorkedMinutes * 60);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (activeEmployee.currentStatus === 'present' || activeEmployee.currentStatus === 'remote') {
        setLiveWorkedSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeEmployee.currentStatus]);

  // Keep live worked in sync when activeEmployee changes
  useEffect(() => {
    setLiveWorkedSeconds(activeEmployee.todayWorkedMinutes * 60);
    setSelectedWorkMode(activeEmployee.currentWorkMode || 'office');
  }, [activeEmployee.id, activeEmployee.todayWorkedMinutes, activeEmployee.currentWorkMode]);

  const formatSecondsToHoursMinutes = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  const handleClockInAction = () => {
    // If remote and policy requires selfie, trigger camera if not already captured
    if (!capturedPhotoUrl && selectedWorkMode === 'remote' && policy.requireSelfieOnRemote) {
      setShowSelfieModal(true);
      return;
    }

    if (!capturedPhotoUrl && selectedWorkMode === 'office' && policy.requireSelfieOnOffice) {
      setShowSelfieModal(true);
      return;
    }

    const res = clockIn({
      workMode: selectedWorkMode,
      photoUrl: capturedPhotoUrl || undefined,
      note: note.trim() || undefined,
    });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setNote('');
      setCapturedPhotoUrl(null);
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleSelfieCaptured = (photoUrl: string) => {
    setCapturedPhotoUrl(photoUrl);
    const res = clockIn({
      workMode: selectedWorkMode,
      photoUrl,
      note: note.trim() || 'Verified with front camera biometric selfie',
    });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setNote('');
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleQRScanned = (kioskCode: string) => {
    const res = clockIn({
      workMode: 'office',
      note: `Turnstile touchless QR verified (${kioskCode})`,
      qrScanned: true,
    });

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleClockOutAction = () => {
    const res = clockOut({ note: note.trim() || undefined });
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setNote('');
      setCapturedPhotoUrl(null);
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleStartBreak = () => {
    const res = startBreak({ note: 'Scheduled coffee & lunch recharge' });
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleEndBreak = () => {
    const res = endBreak();
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  // Quick geofence location testing helpers
  const simulateInsideHQ = () => {
    setUserLocation({
      latitude: 37.774929,
      longitude: -122.419416,
      accuracyMeters: 4,
      address: '450 Innovation Parkway, Suite 500, San Francisco, CA',
      isWithinGeofence: true,
      geofenceName: 'Metropolitan Tech Campus (HQ)',
      distanceToGeofenceMeters: 14,
    });
  };

  const simulateOutsideCafe = () => {
    setUserLocation({
      latitude: 37.76512,
      longitude: -122.4312,
      accuracyMeters: 12,
      address: 'Valencia Coffee House, San Francisco, CA',
      isWithinGeofence: false,
      geofenceName: 'Outside Office Perimeter',
      distanceToGeofenceMeters: 1420,
    });
  };

  const isClockedIn =
    activeEmployee.currentStatus === 'present' ||
    activeEmployee.currentStatus === 'remote' ||
    activeEmployee.currentStatus === 'on_break';

  const isOnBreak = activeEmployee.currentStatus === 'on_break';

  return (
    <div className="flex flex-col gap-3.5 text-slate-100">
      {/* Top Shift Info Header */}
      <div className="flex items-center justify-between text-xs px-0.5">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Assigned Shift:</span>
          <span className="font-semibold text-slate-200">{activeEmployee.shiftSchedule.name}</span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Core {activeEmployee.shiftSchedule.coreStart} - {activeEmployee.shiftSchedule.coreEnd}
        </span>
      </div>

      {/* Main Digital Clock Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-4 text-center shadow-lg">
        {/* Subtle background glow */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isOnBreak
              ? 'bg-amber-500/10'
              : isClockedIn
              ? 'bg-emerald-500/15'
              : 'bg-sky-500/10'
          }`}
        />

        <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">
          {currentTime.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        {/* Dynamic Running Clock */}
        <div className="my-1.5 flex items-baseline justify-center gap-1 font-mono tracking-tight text-4xl sm:text-5xl font-bold text-white tabular-nums">
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        {/* Status indicator */}
        <div className="flex flex-col items-center justify-center gap-1.5 text-xs">
          {isOnBreak ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Coffee className="w-3.5 h-3.5" /> On Rest Break (Work Timer Paused)
            </span>
          ) : isClockedIn ? (
            <>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Clocked In · {activeEmployee.currentWorkMode === 'office' ? 'Office Campus' : activeEmployee.currentWorkMode === 'remote' ? 'Remote Telework' : 'Field Site'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Location Verified · GPS Fix Captured
              </span>
            </>
          ) : (
            <span className="text-slate-400">Ready to Clock In · Choose Location & Tap Below</span>
          )}
        </div>

        {/* Live Daily Hours Stats */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 divide-x divide-slate-800/80 text-left">
          <div className="pr-3">
            <span className="text-[11px] text-slate-400 block">Today&apos;s Active Time</span>
            <span className="font-mono text-sm font-bold text-slate-100 tabular-nums">
              {formatSecondsToHoursMinutes(liveWorkedSeconds)}
            </span>
          </div>
          <div className="pl-3">
            <span className="text-[11px] text-slate-400 block">Shift Target</span>
            <span className="font-mono text-xs font-medium text-slate-300">
              {activeEmployee.shiftSchedule.standardHours}h standard · 15m grace
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`flex items-start gap-2.5 p-3 rounded-xl text-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-200'
              : 'bg-rose-950/60 border border-rose-800/60 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span className="flex-1 leading-relaxed">{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white text-xs px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Flexible Work Location Selector (when not clocked in) */}
      {!isClockedIn && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">1. Select Punch Location</span>
            <span className="text-[11px] text-slate-400">Policy: Flexible Hybrid</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedWorkMode('office')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                selectedWorkMode === 'office'
                  ? 'bg-sky-500/15 border-sky-400/80 text-white shadow-sm shadow-sky-500/10 ring-1 ring-sky-400/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Building className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold">Office HQ</span>
              <span className="text-[10px] text-slate-400">Geofence GPS</span>
            </button>

            <button
              onClick={() => setSelectedWorkMode('remote')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                selectedWorkMode === 'remote'
                  ? 'bg-indigo-500/15 border-indigo-400/80 text-white shadow-sm shadow-indigo-500/10 ring-1 ring-indigo-400/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Home className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold">Remote WFH</span>
              <span className="text-[10px] text-slate-400">Home/Telework</span>
            </button>

            <button
              onClick={() => setSelectedWorkMode('field')}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                selectedWorkMode === 'field'
                  ? 'bg-amber-500/15 border-amber-400/80 text-white shadow-sm shadow-amber-500/10 ring-1 ring-amber-400/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold">Field Site</span>
              <span className="text-[10px] text-slate-400">Client Visit</span>
            </button>
          </div>
        </div>
      )}

      {/* Location Radar & GPS Card with Small Map Preview & 'Location Verified' Status Label */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>{isClockedIn ? 'Verified Shift Location' : '2. GPS Geofence & Location Telemetry'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400">Simulate:</span>
            <button
              onClick={simulateInsideHQ}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                userLocation.isWithinGeofence
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Inside HQ
            </button>
            <button
              onClick={simulateOutsideCafe}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                !userLocation.isWithinGeofence
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Outside Cafe
            </button>
          </div>
        </div>

        {/* Small Map Preview & 'Location Verified' Status Label Component */}
        <LocationVerifiedMapPreview
          location={userLocation}
          title={isClockedIn ? 'Shift Check-In Location Verified' : 'Live GPS Geofence Radar'}
          isClockedIn={isClockedIn}
          onRefreshGPS={refreshGPS}
        />
      </div>

      {/* Biometric Camera Verification Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>3. Biometric Photo Verification</span>
          </div>

          <span className="text-[10px] text-slate-400">
            {policy.requireSelfieOnRemote ? 'Required on Remote' : 'Optional / Self-Audit'}
          </span>
        </div>

        {capturedPhotoUrl ? (
          <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-emerald-500/30">
            <img
              src={capturedPhotoUrl}
              alt="Verification Snapshot"
              className="w-14 h-14 rounded-lg object-cover border border-emerald-500/40"
            />
            <div className="flex-1 min-w-0 text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selfie Proof Captured
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Timestamp & GPS watermark burned into audit trail.
              </span>
              <button
                onClick={() => setShowSelfieModal(true)}
                className="text-[10px] text-sky-400 hover:text-sky-300 font-medium underline mt-1"
              >
                Retake Verification Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-xs text-slate-300 font-medium block">Front Camera Biometric</span>
              <span className="text-[10px] text-slate-400">Burns live timestamp & GPS to punch</span>
            </div>

            <button
              onClick={() => setShowSelfieModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Take Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Note input (optional) */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-slate-400 font-medium">Punch Activity Note (Optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            isClockedIn ? 'e.g., Wrapping up design review' : 'e.g., Client deployment onboarding'
          }
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Main Tactile Action Controls */}
      <div className="mt-1 flex flex-col gap-2.5">
        {!isClockedIn ? (
          <>
            <button
              onClick={handleClockInAction}
              className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer ${
                isOffline
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400'
              }`}
            >
              {isOffline ? <WifiOff className="w-5 h-5 text-slate-950" /> : <Play className="w-5 h-5 fill-slate-950" />}
              <span>{isOffline ? 'Queue Offline Clock-In' : 'Clock In Now'}</span>
            </button>

            {/* Quick Touchless Alternative */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowSelfieModal(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Selfie Punch</span>
              </button>

              <button
                onClick={() => setShowQRModal(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-sky-400" />
                <span>Office QR Kiosk</span>
              </button>
            </div>
          </>
        ) : isOnBreak ? (
          <>
            <button
              onClick={handleEndBreak}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Resume Work (End Break)</span>
            </button>

            <button
              onClick={handleClockOutAction}
              className="py-2.5 px-3 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-rose-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Clock Out for Day Directly
            </button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleStartBreak}
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Coffee className="w-4 h-4" />
                <span>Take a Break</span>
              </button>

              <button
                onClick={handleClockOutAction}
                className="py-3 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-950 transition-colors cursor-pointer"
              >
                <span>Clock Out for Day</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              Clocked in as <strong className="text-slate-200">{activeEmployee.name}</strong> · Shift active
            </p>
          </>
        )}
      </div>

      {/* Modals */}
      <SelfieCameraModal
        isOpen={showSelfieModal}
        onClose={() => setShowSelfieModal(false)}
        onCapture={handleSelfieCaptured}
        employeeName={activeEmployee.name}
        location={userLocation}
      />

      <QRScannerModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        onScanSuccess={handleQRScanned}
        officeName={geofenceZones[0].name}
      />
    </div>
  );
};
