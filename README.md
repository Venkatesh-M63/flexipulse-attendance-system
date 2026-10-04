# FlexiPulse Attendance & Mobile Clock-In System

A modern, flexible employee attendance tracking system with mobile clock-in, live digital timekeeping, biometric selfie verification, geofencing perimeter controls, and manager timesheet analytics.

---

## 📱 Features

- **Tactile Mobile Clock-In**: Live digital clock with seconds, work mode toggling (Office HQ, Remote WFH, Field Site), and rest break management.
- **GPS Geofence Radar**: Real-time campus perimeter validation (`180m geofence`) with a vector map preview and live GPS coordinate fix.
- **Location Verified Badge**: Clear visual confirmation of verified campus GPS locks or remote geotagging on punches and timesheets.
- **Offline Sync Queue**: Queues punch actions locally when connection is lost, displaying a dynamic Sync Status indicator and auto-syncing when back online.
- **Biometric Front Camera Verification**: Captures employee selfie snapshots with live watermarked timestamp, employee identity, and GPS coordinates.
- **Touchless QR Kiosk Scanner**: Integrated scanner simulation for physical office turnstiles.
- **Shift & Core Hours Tracking**: Visual weekly schedule with upcoming shift alerts and arrival grace period windows.
- **Time Off & Adjustment Requests**: Multi-category leave balances (PTO, Sick, Casual, Comp Off) and regularization workflows.
- **HR / Admin Command Center**: Live team presence feed, timesheets audit table, policy configuration modal, and one-tap approval queues.

---

## 📂 Project Structure

```
├── src/
│   ├── assets/images/       # Employee & manager avatar portraits
│   ├── components/
│   │   ├── admin/           # LiveAttendanceFeed, ApprovalsPanel, TimesheetsTable, PolicyConfig
│   │   ├── layout/          # Top Header, SplitView layout
│   │   └── mobile/          # MobileApp, MobileClockInTab, LocationVerifiedMapPreview,
│   │                        # LiveMobileClock, SyncStatusIndicator, SelfieCameraModal,
│   │                        # QRScannerModal, MobileScheduleTab, MobileTimesheetTab, MobileLeaveTab
│   ├── context/             # AttendanceContext (state, punches, GPS, offline queue)
│   ├── data/                # mockData.ts (seed employees, shifts, geofence zones)
│   ├── types/               # attendance.ts (TypeScript data models)
│   ├── App.tsx              # Root application router & view switcher
│   └── main.tsx             # Application entry point
├── index.html               # Main HTML entry point
├── package.json             # Dependencies and scripts
└── vite.config.ts           # Vite + Tailwind configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/Venkatesh-M63/flexipulse-attendance-system.git

# Navigate to project directory
cd flexipulse-attendance-system

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Built With
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Vite**
