export type WorkMode = 'office' | 'remote' | 'field';

export type PunchType = 'clock_in' | 'clock_out' | 'break_start' | 'break_end';

export type AttendanceStatus = 'present' | 'on_break' | 'clocked_out' | 'late' | 'remote' | 'on_leave';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  address?: string;
  isWithinGeofence: boolean;
  geofenceName?: string;
  distanceToGeofenceMeters?: number;
}

export interface AttendancePunch {
  id: string;
  employeeId: string;
  timestamp: string; // ISO string
  type: PunchType;
  workMode: WorkMode;
  location?: LocationCoordinates;
  photoUrl?: string; // base64 or photo URL
  deviceInfo: string;
  note?: string;
  isOfflineSync?: boolean;
  queuedAt?: string;
}

export interface DayAttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  clockInTime?: string;
  clockOutTime?: string;
  totalWorkedMinutes: number;
  totalBreakMinutes: number;
  overtimeMinutes: number;
  workMode: WorkMode;
  status: AttendanceStatus;
  punches: AttendancePunch[];
  isRegularized?: boolean;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: 'Product & Design' | 'Engineering' | 'Operations' | 'Field & Sales' | 'Human Resources';
  avatarUrl: string;
  workModePreference: 'flexible' | 'hybrid' | 'on_site' | 'remote';
  shiftSchedule: {
    name: string;
    coreStart: string; // e.g. "10:00"
    coreEnd: string; // e.g. "16:00"
    flexibleWindowStart: string; // e.g. "07:30"
    flexibleWindowEnd: string; // e.g. "10:30"
    standardHours: number; // e.g. 8
  };
  assignedGeofenceId: string;
  leaveBalances: {
    paidTimeOff: number;
    sickLeave: number;
    casualLeave: number;
    compOff: number;
  };
  currentStatus: AttendanceStatus;
  currentWorkMode: WorkMode;
  todayClockInTime?: string;
  todayBreakStartTime?: string;
  todayWorkedMinutes: number;
}

export interface GeofenceZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  address: string;
  isActive: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  type: 'paid_time_off' | 'sick_leave' | 'casual_leave' | 'remote_work_day' | 'half_day';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface RegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  date: string;
  proposedClockIn: string;
  proposedClockOut: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewNotes?: string;
}

export interface AttendancePolicy {
  companyName: string;
  gracePeriodMinutes: number;
  enforceGeofence: boolean;
  requireSelfieOnRemote: boolean;
  requireSelfieOnOffice: boolean;
  allowManualRegularization: boolean;
  autoDeductBreakMinutes: number;
  overtimeThresholdHours: number;
  flexibleCoreHoursEnabled: boolean;
}
