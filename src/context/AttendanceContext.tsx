import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  AttendancePunch,
  LeaveRequest,
  RegularizationRequest,
  AttendancePolicy,
  GeofenceZone,
  WorkMode,
  PunchType,
  LocationCoordinates,
} from '../types/attendance';
import {
  INITIAL_EMPLOYEES,
  GEOFENCE_ZONES,
  INITIAL_PUNCHES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_REGULARIZATIONS,
  INITIAL_POLICY,
} from '../data/mockData';

interface AttendanceContextType {
  employees: Employee[];
  activeEmployeeId: string;
  activeEmployee: Employee;
  punches: AttendancePunch[];
  leaveRequests: LeaveRequest[];
  regularizationRequests: RegularizationRequest[];
  policy: AttendancePolicy;
  geofenceZones: GeofenceZone[];
  viewMode: 'mobile' | 'admin' | 'split';
  isOffline: boolean;
  offlineQueue: AttendancePunch[];
  offlineQueueCount: number;
  lastPunchEvent: { employeeName: string; type: PunchType; time: string; workMode: WorkMode } | null;
  userLocation: LocationCoordinates;
  isSimulatedLocation: boolean;
  
  // Shift Notifications
  isUpcomingShiftWithinHour: boolean;
  upcomingShiftMinutesLeft: number;
  toggleUpcomingShiftAlert: () => void;
  
  // Actions
  setActiveEmployeeId: (id: string) => void;
  setViewMode: (mode: 'mobile' | 'admin' | 'split') => void;
  clockIn: (options: { workMode: WorkMode; photoUrl?: string; note?: string; qrScanned?: boolean }) => { success: boolean; message: string; queued?: boolean };
  clockOut: (options?: { note?: string }) => { success: boolean; message: string; queued?: boolean };
  startBreak: (options?: { note?: string }) => { success: boolean; message: string; queued?: boolean };
  endBreak: () => { success: boolean; message: string; queued?: boolean };
  addEmployee: (empData: Omit<Employee, 'id' | 'currentStatus' | 'currentWorkMode' | 'todayWorkedMinutes'>) => void;
  submitLeaveRequest: (data: { type: LeaveRequest['type']; startDate: string; endDate: string; reason: string }) => void;
  submitRegularization: (data: { date: string; proposedClockIn: string; proposedClockOut: string; reason: string }) => void;
  approveLeaveRequest: (requestId: string, notes?: string) => void;
  rejectLeaveRequest: (requestId: string, notes?: string) => void;
  approveRegularization: (requestId: string, notes?: string) => void;
  rejectRegularization: (requestId: string, notes?: string) => void;
  updatePolicy: (updated: Partial<AttendancePolicy>) => void;
  setUserLocation: (loc: Partial<LocationCoordinates>) => void;
  toggleOfflineMode: () => void;
  setOfflineMode: (offline: boolean) => void;
  syncOfflinePunches: () => { syncedCount: number };
  refreshGPS: () => void;
  exportTimesheetCSV: () => string;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'flexipulse_attendance_v3';

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load employees
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_employees`);
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [activeEmployeeId, setActiveEmployeeId] = useState<string>('emp-alex');
  const [viewMode, setViewMode] = useState<'mobile' | 'admin' | 'split'>('split');
  
  // Offline & Queued Sync State
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<AttendancePunch[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_offline_queue`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [punches, setPunches] = useState<AttendancePunch[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_punches`);
      return saved ? JSON.parse(saved) : INITIAL_PUNCHES;
    } catch {
      return INITIAL_PUNCHES;
    }
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leaves`);
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });

  const [regularizationRequests, setRegularizationRequests] = useState<RegularizationRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_regs`);
      return saved ? JSON.parse(saved) : INITIAL_REGULARIZATIONS;
    } catch {
      return INITIAL_REGULARIZATIONS;
    }
  });

  const [policy, setPolicy] = useState<AttendancePolicy>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_policy`);
      return saved ? JSON.parse(saved) : INITIAL_POLICY;
    } catch {
      return INITIAL_POLICY;
    }
  });

  const [geofenceZones] = useState<GeofenceZone[]>(GEOFENCE_ZONES);

  // Default GPS location: within HQ zone
  const [userLocation, setUserLocationState] = useState<LocationCoordinates>({
    latitude: 37.774929,
    longitude: -122.419416,
    accuracyMeters: 4,
    address: '450 Innovation Parkway, Suite 500, San Francisco, CA',
    isWithinGeofence: true,
    geofenceName: 'Metropolitan Tech Campus (HQ)',
    distanceToGeofenceMeters: 14,
  });

  const [isSimulatedLocation, setIsSimulatedLocation] = useState(false);
  const [lastPunchEvent, setLastPunchEvent] = useState<{
    employeeName: string;
    type: PunchType;
    time: string;
    workMode: WorkMode;
  } | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_employees`, JSON.stringify(employees));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_punches`, JSON.stringify(punches));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [punches]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_offline_queue`, JSON.stringify(offlineQueue));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [offlineQueue]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_leaves`, JSON.stringify(leaveRequests));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [leaveRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_regs`, JSON.stringify(regularizationRequests));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [regularizationRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_policy`, JSON.stringify(policy));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [policy]);

  const activeEmployee = employees.find((e) => e.id === activeEmployeeId) || employees[0];

  // Upcoming Shift Due Notification State (< 60 minutes)
  const [forceShiftAlert, setForceShiftAlert] = useState<boolean>(true);

  // Dynamic shift alert calculation:
  // Check if current time is within 60 minutes before activeEmployee shift start
  const now = new Date();
  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();
  const [coreStartHour = 10, coreStartMin = 0] = (activeEmployee?.shiftSchedule?.coreStart || '10:00')
    .split(':')
    .map(Number);
  const shiftStartMinutes = coreStartHour * 60 + coreStartMin;
  const naturalDiffMinutes = shiftStartMinutes - currentMinutesFromMidnight;
  const isNaturallyWithinHour =
    activeEmployee.currentStatus !== 'present' &&
    activeEmployee.currentStatus !== 'remote' &&
    naturalDiffMinutes > 0 &&
    naturalDiffMinutes <= 60;

  const isUpcomingShiftWithinHour = forceShiftAlert || isNaturallyWithinHour;
  const upcomingShiftMinutesLeft = isNaturallyWithinHour ? naturalDiffMinutes : 24;

  const toggleUpcomingShiftAlert = () => {
    setForceShiftAlert((prev) => !prev);
  };

  const refreshGPS = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy);

          const hq = geofenceZones[0];
          const dLat = (lat - hq.latitude) * 111000;
          const dLon = (lon - hq.longitude) * 111000 * Math.cos((lat * Math.PI) / 180);
          const dist = Math.round(Math.sqrt(dLat * dLat + dLon * dLon));
          const within = dist <= hq.radiusMeters;

          setUserLocationState({
            latitude: lat,
            longitude: lon,
            accuracyMeters: acc,
            address: within ? hq.address : `Detected Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
            isWithinGeofence: within,
            geofenceName: within ? hq.name : 'Outside Registered Geofence',
            distanceToGeofenceMeters: dist,
          });
          setIsSimulatedLocation(false);
        },
        () => {
          setIsSimulatedLocation(true);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    }
  };

  const setUserLocation = (loc: Partial<LocationCoordinates>) => {
    setUserLocationState((prev) => ({ ...prev, ...loc }));
    setIsSimulatedLocation(true);
  };

  const addEmployee = (empData: Omit<Employee, 'id' | 'currentStatus' | 'currentWorkMode' | 'todayWorkedMinutes'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
      currentStatus: 'clocked_out',
      currentWorkMode: empData.workModePreference === 'remote' ? 'remote' : 'office',
      todayWorkedMinutes: 0,
    };
    setEmployees((prev) => [newEmp, ...prev]);
  };

  const clockIn = ({
    workMode,
    photoUrl,
    note,
  }: {
    workMode: WorkMode;
    photoUrl?: string;
    note?: string;
    qrScanned?: boolean;
  }) => {
    // Policy check for office geofence (if not offline or enforced)
    if (!isOffline && policy.enforceGeofence && workMode === 'office' && !userLocation.isWithinGeofence) {
      return {
        success: false,
        message: `Clock-in rejected: Office mode requires being inside the registered geofence (${userLocation.distanceToGeofenceMeters}m away).`,
      };
    }

    if (!isOffline && policy.requireSelfieOnRemote && workMode === 'remote' && !photoUrl) {
      return {
        success: false,
        message: 'Policy requires a photo verification selfie for remote clock-in.',
      };
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPunch: AttendancePunch = {
      id: `punch-${Date.now()}`,
      employeeId: activeEmployee.id,
      timestamp: now.toISOString(),
      type: 'clock_in',
      workMode,
      location: { ...userLocation },
      photoUrl,
      deviceInfo: isOffline ? 'Mobile App (Stored Locally Offline)' : 'Mobile App v2.5 · Verified GPS',
      note: note || (workMode === 'remote' ? 'Remote home shift' : 'On-site arrival punch'),
      isOfflineSync: isOffline,
      queuedAt: isOffline ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : undefined,
    };

    if (isOffline) {
      setOfflineQueue((prev) => [newPunch, ...prev]);
    }

    setPunches((prev) => [newPunch, ...prev]);

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === activeEmployee.id
          ? {
              ...emp,
              currentStatus: workMode === 'remote' ? 'remote' : 'present',
              currentWorkMode: workMode,
              todayClockInTime: timeFormatted,
            }
          : emp
      )
    );

    setLastPunchEvent({
      employeeName: activeEmployee.name,
      type: 'clock_in',
      time: timeFormatted,
      workMode,
    });

    if (isOffline) {
      return {
        success: true,
        queued: true,
        message: `Offline Clock-In queued locally at ${timeFormatted}. It will automatically sync when connectivity is restored.`,
      };
    }

    return {
      success: true,
      message: `Clocked in successfully at ${timeFormatted} (${workMode === 'office' ? 'Office HQ' : workMode === 'remote' ? 'Remote WFH' : 'Field Site'}).`,
    };
  };

  const clockOut = (options?: { note?: string }) => {
    if (activeEmployee.currentStatus === 'clocked_out') {
      return { success: false, message: 'You are already clocked out.' };
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPunch: AttendancePunch = {
      id: `punch-${Date.now()}`,
      employeeId: activeEmployee.id,
      timestamp: now.toISOString(),
      type: 'clock_out',
      workMode: activeEmployee.currentWorkMode,
      location: { ...userLocation },
      deviceInfo: isOffline ? 'Mobile App (Offline Queued)' : 'Mobile App v2.5 · Verified GPS',
      note: options?.note || 'End of day punch out',
      isOfflineSync: isOffline,
      queuedAt: isOffline ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : undefined,
    };

    if (isOffline) {
      setOfflineQueue((prev) => [newPunch, ...prev]);
    }

    setPunches((prev) => [newPunch, ...prev]);

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === activeEmployee.id
          ? {
              ...emp,
              currentStatus: 'clocked_out',
            }
          : emp
      )
    );

    setLastPunchEvent({
      employeeName: activeEmployee.name,
      type: 'clock_out',
      time: timeFormatted,
      workMode: activeEmployee.currentWorkMode,
    });

    if (isOffline) {
      return {
        success: true,
        queued: true,
        message: `Offline Clock-Out queued at ${timeFormatted}. Will sync once reconnected.`,
      };
    }

    return {
      success: true,
      message: `Clocked out successfully at ${timeFormatted}. Have a great evening!`,
    };
  };

  const startBreak = (options?: { note?: string }) => {
    if (activeEmployee.currentStatus !== 'present' && activeEmployee.currentStatus !== 'remote') {
      return { success: false, message: 'Must be clocked in to take a break.' };
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPunch: AttendancePunch = {
      id: `punch-${Date.now()}`,
      employeeId: activeEmployee.id,
      timestamp: now.toISOString(),
      type: 'break_start',
      workMode: activeEmployee.currentWorkMode,
      deviceInfo: 'Mobile App v2.5',
      note: options?.note || 'Meal/coffee rest break',
      isOfflineSync: isOffline,
      queuedAt: isOffline ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : undefined,
    };

    if (isOffline) {
      setOfflineQueue((prev) => [newPunch, ...prev]);
    }

    setPunches((prev) => [newPunch, ...prev]);

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === activeEmployee.id
          ? {
              ...emp,
              currentStatus: 'on_break',
              todayBreakStartTime: timeFormatted,
            }
          : emp
      )
    );

    return {
      success: true,
      queued: isOffline,
      message: `Break started at ${timeFormatted}. Working timer is paused.`,
    };
  };

  const endBreak = () => {
    if (activeEmployee.currentStatus !== 'on_break') {
      return { success: false, message: 'You are not currently on a break.' };
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPunch: AttendancePunch = {
      id: `punch-${Date.now()}`,
      employeeId: activeEmployee.id,
      timestamp: now.toISOString(),
      type: 'break_end',
      workMode: activeEmployee.currentWorkMode,
      deviceInfo: 'Mobile App v2.5',
      note: 'Resumed shift after break',
      isOfflineSync: isOffline,
      queuedAt: isOffline ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : undefined,
    };

    if (isOffline) {
      setOfflineQueue((prev) => [newPunch, ...prev]);
    }

    setPunches((prev) => [newPunch, ...prev]);

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === activeEmployee.id
          ? {
              ...emp,
              currentStatus: emp.currentWorkMode === 'remote' ? 'remote' : 'present',
              todayBreakStartTime: undefined,
            }
          : emp
      )
    );

    return {
      success: true,
      queued: isOffline,
      message: `Break ended at ${timeFormatted}. Welcome back to work!`,
    };
  };

  const toggleOfflineMode = () => {
    setIsOffline((prev) => !prev);
  };

  const setOfflineMode = (offline: boolean) => {
    setIsOffline(offline);
  };

  const syncOfflinePunches = () => {
    const count = offlineQueue.length;
    if (count === 0) return { syncedCount: 0 };

    // Update punches to mark them as synced
    setPunches((prev) =>
      prev.map((p) => (p.isOfflineSync ? { ...p, isOfflineSync: false, deviceInfo: `${p.deviceInfo} (Synced Online)` } : p))
    );

    setOfflineQueue([]);
    setIsOffline(false);
    return { syncedCount: count };
  };

  const submitLeaveRequest = (data: {
    type: LeaveRequest['type'];
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: activeEmployee.id,
      employeeName: activeEmployee.name,
      employeeAvatar: activeEmployee.avatarUrl,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
  };

  const submitRegularization = (data: {
    date: string;
    proposedClockIn: string;
    proposedClockOut: string;
    reason: string;
  }) => {
    const newReq: RegularizationRequest = {
      id: `reg-${Date.now()}`,
      employeeId: activeEmployee.id,
      employeeName: activeEmployee.name,
      employeeAvatar: activeEmployee.avatarUrl,
      date: data.date,
      proposedClockIn: data.proposedClockIn,
      proposedClockOut: data.proposedClockOut,
      reason: data.reason,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setRegularizationRequests((prev) => [newReq, ...prev]);
  };

  const approveLeaveRequest = (requestId: string, notes?: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'approved',
              reviewedBy: 'Elena Rostova (HR Admin)',
              reviewNotes: notes || 'Approved according to operational staffing balance.',
            }
          : req
      )
    );
  };

  const rejectLeaveRequest = (requestId: string, notes?: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'rejected',
              reviewedBy: 'Elena Rostova (HR Admin)',
              reviewNotes: notes || 'Unavailable due to scheduled critical project sprint.',
            }
          : req
      )
    );
  };

  const approveRegularization = (requestId: string, notes?: string) => {
    setRegularizationRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'approved',
              reviewNotes: notes || 'Timesheet adjusted and verified with supervisor log.',
            }
          : req
      )
    );
  };

  const rejectRegularization = (requestId: string, notes?: string) => {
    setRegularizationRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'rejected',
              reviewNotes: notes || 'Declined: Incomplete activity logs.',
            }
          : req
      )
    );
  };

  const updatePolicy = (updated: Partial<AttendancePolicy>) => {
    setPolicy((prev) => ({ ...prev, ...updated }));
  };

  const exportTimesheetCSV = (): string => {
    const headers = [
      'Employee ID',
      'Employee Name',
      'Department',
      'Date/Time',
      'Punch Type',
      'Work Mode',
      'Location / Geofence',
      'Device Info',
      'Offline Status',
      'Notes',
    ];

    const rows = punches.map((p) => {
      const emp = employees.find((e) => e.id === p.employeeId);
      return [
        p.employeeId,
        `"${emp?.name || 'Unknown'}"`,
        `"${emp?.department || ''}"`,
        `"${new Date(p.timestamp).toLocaleString()}"`,
        p.type,
        p.workMode,
        `"${p.location?.geofenceName || p.location?.address || 'N/A'}"`,
        `"${p.deviceInfo}"`,
        p.isOfflineSync ? 'Queued Offline' : 'Synced Online',
        `"${p.note || ''}"`,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  return (
    <AttendanceContext.Provider
      value={{
        employees,
        activeEmployeeId,
        activeEmployee,
        punches,
        leaveRequests,
        regularizationRequests,
        policy,
        geofenceZones,
        viewMode,
        isOffline,
        offlineQueue,
        offlineQueueCount: offlineQueue.length,
        lastPunchEvent,
        userLocation,
        isSimulatedLocation,
        isUpcomingShiftWithinHour,
        upcomingShiftMinutesLeft,
        toggleUpcomingShiftAlert,
        setActiveEmployeeId,
        setViewMode,
        clockIn,
        clockOut,
        startBreak,
        endBreak,
        addEmployee,
        submitLeaveRequest,
        submitRegularization,
        approveLeaveRequest,
        rejectLeaveRequest,
        approveRegularization,
        rejectRegularization,
        updatePolicy,
        setUserLocation,
        toggleOfflineMode,
        setOfflineMode,
        syncOfflinePunches,
        refreshGPS,
        exportTimesheetCSV,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return context;
};
