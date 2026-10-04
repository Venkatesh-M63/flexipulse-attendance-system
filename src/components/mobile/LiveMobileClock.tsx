import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Check, Settings2, Globe, Sparkles } from 'lucide-react';

interface LiveMobileClockProps {
  showSeconds?: boolean;
  showIcon?: boolean;
  showLivePulse?: boolean;
  className?: string;
  variant?: 'header-badge' | 'status-bar' | 'compact' | 'full-card';
}

export const LiveMobileClock: React.FC<LiveMobileClockProps> = ({
  showSeconds: initialShowSeconds = true,
  showIcon = true,
  showLivePulse = true,
  className = '',
  variant = 'header-badge',
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [showSeconds, setShowSeconds] = useState<boolean>(initialShowSeconds);
  const [showClockPopover, setShowClockPopover] = useState<boolean>(false);

  useEffect(() => {
    // Ticks every second with precision
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeFormatted = currentTime.toLocaleTimeString([], {
    hour: is24Hour ? '2-digit' : 'numeric',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: !is24Hour,
  });

  const fullDateFormatted = currentTime.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (variant === 'status-bar') {
    return (
      <span
        className={`font-mono font-medium text-slate-300 tabular-nums tracking-tight ${className}`}
        aria-live="polite"
        title="Current local device time"
      >
        {currentTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-1 font-mono text-xs text-slate-300 tabular-nums ${className}`}
        aria-live="polite"
      >
        {showLivePulse && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
        )}
        <span>{timeFormatted}</span>
      </div>
    );
  }

  // Default 'header-badge' - interactive live digital clock for mobile header
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowClockPopover(!showClockPopover)}
        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 shadow-sm transition-all cursor-pointer ${className}`}
        aria-live="polite"
        title="Tap to toggle 12h/24h or view timezone details"
      >
        {showIcon && <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0 group-hover:rotate-12 transition-transform" />}
        {showLivePulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        )}
        <span className="font-mono text-xs font-bold tabular-nums tracking-tight text-white">
          {timeFormatted}
        </span>
      </button>

      {/* Tap-to-expand details popover */}
      {showClockPopover && (
        <div className="absolute top-11 right-0 z-50 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl animate-in fade-in zoom-in-95 text-xs text-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 font-semibold text-slate-100">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Live Attendance Clock</span>
            </div>
            <button
              onClick={() => setShowClockPopover(false)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              ×
            </button>
          </div>

          <div className="my-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 block">{fullDateFormatted}</span>
            <span className="font-mono text-xl font-bold text-emerald-400 tabular-nums">
              {timeFormatted}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5 truncate flex items-center justify-center gap-1">
              <Globe className="w-3 h-3 text-sky-400" />
              {timezoneName}
            </span>
          </div>

          {/* Quick Clock Toggles */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Time Format:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setIs24Hour(false)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    !is24Hour ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  12h
                </button>
                <button
                  type="button"
                  onClick={() => setIs24Hour(true)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    is24Hour ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  24h
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Display Seconds:</span>
              <button
                type="button"
                onClick={() => setShowSeconds(!showSeconds)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  showSeconds
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400'
                }`}
              >
                {showSeconds ? 'Enabled' : 'Hidden'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
