import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

export const SyncStatusIndicator: React.FC = () => {
  const {
    isOffline,
    toggleOfflineMode,
    setOfflineMode,
    offlineQueue,
    offlineQueueCount,
    syncOfflinePunches,
  } = useAttendance();

  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const res = syncOfflinePunches();
      setIsSyncing(false);
      setSyncFeedback(`Successfully synchronized ${res.syncedCount} queued punch action${res.syncedCount === 1 ? '' : 's'}!`);
      setTimeout(() => {
        setSyncFeedback(null);
        setIsOpen(false);
      }, 1500);
    }, 700);
  };

  return (
    <>
      {/* Header Sync Status Indicator Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm select-none ${
          isOffline
            ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900/60 shadow-amber-950/40'
            : offlineQueueCount > 0
            ? 'bg-sky-950/80 border-sky-500/40 text-sky-300 hover:bg-sky-900/50'
            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
        }`}
        title="Tap to manage network connection & offline punch queue"
        aria-label="Sync Status"
      >
        {isOffline ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px] font-bold">
              Offline{offlineQueueCount > 0 ? ` (${offlineQueueCount})` : ''}
            </span>
          </>
        ) : (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-slate-200">
              {offlineQueueCount > 0 ? `Queued (${offlineQueueCount})` : 'Synced'}
            </span>
          </>
        )}
      </button>

      {/* Sync Management Modal / Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 text-xs text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {isOffline ? (
                  <WifiOff className="w-4 h-4 text-amber-400" />
                ) : (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Sync & Connectivity</h4>
                  <span className="text-[11px] text-slate-400">Offline punch buffer & live status</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Offline Simulator Switch */}
            <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block text-xs">Simulated Network Connection</span>
                <span className="text-[11px] text-slate-400">
                  {isOffline ? 'Disconnected (Local Queue Mode)' : 'Online · Real-Time Gateway'}
                </span>
              </div>

              <button
                type="button"
                onClick={toggleOfflineMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isOffline ? 'bg-amber-600' : 'bg-slate-700'
                }`}
                title="Toggle simulated connection"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isOffline ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Explanatory Banner */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Zero-Data Loss Guarantee</span>
              </div>
              <p className="leading-relaxed">
                When offline, clock-ins and outs are cryptographically signed with your device timestamp and stored in local cache. They will flush automatically once reconnected.
              </p>
            </div>

            {/* Queued Items List */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Pending Offline Actions ({offlineQueueCount})</span>
                </span>
                {offlineQueueCount > 0 && (
                  <span className="text-[10px] text-amber-400 font-mono">Awaiting Upload</span>
                )}
              </div>

              {offlineQueueCount === 0 ? (
                <div className="py-4 px-3 text-center rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-400 text-[11px]">
                  All attendance records are synchronized with company servers.
                </div>
              ) : (
                <div className="max-h-36 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
                  {offlineQueue.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded-lg bg-slate-950 border border-amber-500/20 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <div>
                          <span className="font-semibold text-slate-200 capitalize">
                            {item.type.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Queued: {item.queuedAt || 'Just now'} · {item.workMode}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-400 font-medium bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.5 rounded">
                        Cached
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback notification */}
            {syncFeedback && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{syncFeedback}</span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-medium text-xs transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing || offlineQueueCount === 0}
                className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : `Sync Now (${offlineQueueCount})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
