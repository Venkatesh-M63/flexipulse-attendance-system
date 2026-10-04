import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Check, ArrowRightLeft, Bell, AlertTriangle, ArrowRight, Play, Sliders } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

interface MobileScheduleTabProps {
  onNavigateToClockIn?: () => void;
}

export const MobileScheduleTab: React.FC<MobileScheduleTabProps> = ({ onNavigateToClockIn }) => {
  const {
    activeEmployee,
    isUpcomingShiftWithinHour,
    upcomingShiftMinutesLeft,
    toggleUpcomingShiftAlert,
    geofenceZones,
  } = useAttendance();

  const [swapFeedback, setSwapFeedback] = useState(false);

  const daysOfWeek = [
    { day: 'Mon', date: 'Oct 5', shift: '09:00 - 17:30', mode: 'Office HQ', status: 'Upcoming' },
    { day: 'Tue', date: 'Oct 6', shift: 'Flex Arrival', mode: 'Remote WFH', status: 'Upcoming' },
    { day: 'Wed', date: 'Oct 7', shift: '09:00 - 17:30', mode: 'Office HQ', status: 'Upcoming' },
    { day: 'Thu', date: 'Oct 8', shift: 'Client Site', mode: 'Field Visit', status: 'Upcoming' },
    { day: 'Fri', date: 'Oct 9', shift: 'Flex Arrival', mode: 'Remote WFH', status: 'Upcoming' },
    { day: 'Sat', date: 'Oct 10', shift: 'Weekend Rest', mode: 'Off', status: 'Holiday' },
    { day: 'Sun', date: 'Oct 11', shift: 'Weekend Rest', mode: 'Off', status: 'Holiday' },
  ];

  const handleRequestSwap = () => {
    setSwapFeedback(true);
    setTimeout(() => setSwapFeedback(false), 2000);
  };

  const assignedZone = geofenceZones.find((z) => z.id === activeEmployee.assignedGeofenceId) || geofenceZones[0];

  return (
    <div className="flex flex-col gap-3.5 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Schedule & Shifts</h3>
          <p className="text-[11px] text-slate-400">Your flexible shift & roster allocation</p>
        </div>

        {/* Test simulator toggle for the user */}
        <button
          onClick={toggleUpcomingShiftAlert}
          className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
            isUpcomingShiftWithinHour
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle <1 hour shift start alert simulation"
        >
          <Bell className="w-3 h-3" />
          <span>{isUpcomingShiftWithinHour ? '< 1h Alert Active' : 'Test < 1h Alert'}</span>
        </button>
      </div>

      {/* Upcoming Shift Due Alert Banner (< 1h) */}
      {isUpcomingShiftWithinHour && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border border-amber-500/50 p-4 shadow-lg shadow-amber-950/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>Shift Due in {upcomingShiftMinutesLeft} Minutes</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                  Starts {activeEmployee.shiftSchedule.coreStart}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Your <strong className="text-white">{activeEmployee.shiftSchedule.name}</strong> is scheduled to commence shortly. Prepare your location and photo clock-in.
              </p>

              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  {assignedZone.name}
                </span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">15m Grace Window</span>
              </div>

              {onNavigateToClockIn && (
                <button
                  type="button"
                  onClick={onNavigateToClockIn}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Proceed to Clock In Now</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Shift Policy Card */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{activeEmployee.shiftSchedule.name}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {activeEmployee.shiftSchedule.standardHours}h / day
          </span>
        </div>

        {/* Visual Core Hours Timeline */}
        <div className="mt-3">
          <span className="text-[11px] text-slate-400 block mb-1.5">Daily Flexible Hours Distribution</span>
          <div className="w-full h-7 bg-slate-950 rounded-lg p-1 flex items-center border border-slate-800 text-[10px] text-center font-mono">
            <div
              className="h-full bg-slate-800 text-slate-400 rounded-l flex items-center justify-center px-1"
              style={{ width: '25%' }}
              title="Arrival Window: 07:30 - 10:00"
            >
              Flex In
            </div>
            <div
              className="h-full bg-sky-500/30 text-sky-200 border-x border-sky-400/40 font-semibold flex items-center justify-center px-1"
              style={{ width: '50%' }}
              title="Core Collaboration Window: 10:00 - 16:00"
            >
              Core Window (10:00 - 16:00)
            </div>
            <div
              className="h-full bg-slate-800 text-slate-400 rounded-r flex items-center justify-center px-1"
              style={{ width: '25%' }}
              title="Flex Out Window: 16:00 - 19:30"
            >
              Flex Out
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Arrival window: {activeEmployee.shiftSchedule.flexibleWindowStart} - {activeEmployee.shiftSchedule.flexibleWindowEnd}</span>
            <span className="text-emerald-400 font-medium">15m Grace Active</span>
          </div>
        </div>
      </div>

      {/* Week Days List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Upcoming Week</span>
          <button
            onClick={handleRequestSwap}
            className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>{swapFeedback ? 'Swap Requested!' : 'Swap Shift'}</span>
          </button>
        </div>

        {daysOfWeek.map((d, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${
              d.status === 'Holiday'
                ? 'bg-slate-950/40 border-slate-900 text-slate-500'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono ${
                  d.status === 'Holiday' ? 'bg-slate-900 text-slate-500' : 'bg-slate-800 text-slate-200'
                }`}
              >
                <span className="text-[10px] uppercase font-bold">{d.day}</span>
                <span className="text-xs">{d.date.split(' ')[1]}</span>
              </div>

              <div>
                <span className="font-semibold block">{d.shift}</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {d.mode}
                </span>
              </div>
            </div>

            <div>
              {d.status === 'Holiday' ? (
                <span className="text-[11px] text-slate-500 font-medium">Rest Day</span>
              ) : (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Confirmed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Public Holidays reminder */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Upcoming Company Holidays</span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center justify-between py-1 border-t border-slate-800/60">
          <span>Thanksgiving Break</span>
          <span className="font-mono text-slate-300">Nov 26 - Nov 27</span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center justify-between py-1 border-t border-slate-800/60">
          <span>Winter Holiday Recess</span>
          <span className="font-mono text-slate-300">Dec 24 - Dec 28</span>
        </div>
      </div>
    </div>
  );
};
