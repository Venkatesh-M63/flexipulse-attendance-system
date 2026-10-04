import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Crosshair,
  ExternalLink,
} from 'lucide-react';
import { LocationCoordinates } from '../../types/attendance';

interface LocationVerifiedMapPreviewProps {
  location: LocationCoordinates;
  title?: string;
  isClockedIn?: boolean;
  onRefreshGPS?: () => void;
  className?: string;
  compact?: boolean;
}

export const LocationVerifiedMapPreview: React.FC<LocationVerifiedMapPreviewProps> = ({
  location,
  title = 'Verified Check-In Location',
  isClockedIn = true,
  onRefreshGPS,
  className = '',
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute normalized SVG pin coordinates within a 300x180 map canvas
  // If inside geofence, place near center campus (150, 90)
  // If outside, offset to represent distance
  const pinX = location.isWithinGeofence ? 154 : 230;
  const pinY = location.isWithinGeofence ? 88 : 42;
  const geofenceCenterX = 150;
  const geofenceCenterY = 90;
  const geofenceRadius = 55;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-slate-900 border ${
        location.isWithinGeofence
          ? 'border-emerald-500/40 shadow-sm shadow-emerald-950/20'
          : 'border-amber-500/40 shadow-sm shadow-amber-950/20'
      } ${className}`}
    >
      {/* Top Header Strip with 'Location Verified' Status Label */}
      <div className="px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              location.isWithinGeofence
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>

          <div className="min-w-0">
            {/* The requested 'Location Verified' Status Label */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs text-white tracking-tight">
                Location Verified
              </span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold ${
                  location.isWithinGeofence
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                {location.isWithinGeofence ? 'GPS Locked In-Campus' : 'Remote GPS Tagged'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block truncate">
              {location.geofenceName || 'Registered Geofence Location'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onRefreshGPS && (
            <button
              type="button"
              onClick={onRefreshGPS}
              className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Refresh GPS satellite fix"
            >
              <Navigation className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse mini map' : 'Expand mini map'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Vector Map Preview Canvas */}
      <div
        className={`relative w-full bg-[#0b1329] overflow-hidden transition-all duration-300 ${
          isExpanded ? 'h-52' : compact ? 'h-24' : 'h-36'
        }`}
      >
        {/* Stylized Vector Map Graphics */}
        <svg
          viewBox="0 0 300 180"
          className="w-full h-full object-cover select-none pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Subtle Grid / Street Canvas */}
          <defs>
            <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.6" />
            </pattern>
            <radialGradient id="geofence-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="300" height="180" fill="#090e1a" />
          <rect width="300" height="180" fill="url(#map-grid)" />

          {/* Simulated Park / Water Feature */}
          <path
            d="M -10,130 C 50,110 80,160 140,150 C 200,140 240,170 310,145 L 310,190 L -10,190 Z"
            fill="#0f2b38"
            opacity="0.7"
          />

          {/* Major Road Arteries */}
          <path d="M 0,90 Q 150,85 300,90" stroke="#334155" strokeWidth="6" fill="none" />
          <path d="M 0,90 Q 150,85 300,90" stroke="#475569" strokeWidth="2" strokeDasharray="6,4" fill="none" />
          <path d="M 150,0 Q 155,90 150,180" stroke="#334155" strokeWidth="5" fill="none" />
          <path d="M 60,0 L 60,180" stroke="#1e293b" strokeWidth="3" fill="none" />
          <path d="M 240,0 L 240,180" stroke="#1e293b" strokeWidth="3" fill="none" />

          {/* Campus Building Blocks */}
          <rect x="110" y="55" width="28" height="24" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <rect x="160" y="55" width="34" height="26" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <rect x="115" y="105" width="30" height="22" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <rect x="165" y="105" width="26" height="25" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />

          {/* Building Labels */}
          <text x="124" y="70" fill="#64748b" fontSize="6" fontFamily="sans-serif" textAnchor="middle">HQ-A</text>
          <text x="177" y="70" fill="#64748b" fontSize="6" fontFamily="sans-serif" textAnchor="middle">LAB-1</text>
          <text x="130" y="119" fill="#64748b" fontSize="6" fontFamily="sans-serif" textAnchor="middle">TOWER</text>
          <text x="178" y="119" fill="#64748b" fontSize="6" fontFamily="sans-serif" textAnchor="middle">EAST</text>

          {/* Geofence Perimeter Zone Circle */}
          <circle
            cx={geofenceCenterX}
            cy={geofenceCenterY}
            r={geofenceRadius}
            fill="url(#geofence-glow)"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <text
            x={geofenceCenterX}
            y={geofenceCenterY - geofenceRadius - 3}
            fill="#38bdf8"
            fontSize="7"
            fontFamily="monospace"
            textAnchor="middle"
            fontWeight="bold"
          >
            180m GEOFENCE PERIMETER
          </text>

          {/* Connect line between pin and center */}
          {!location.isWithinGeofence && (
            <line
              x1={pinX}
              y1={pinY}
              x2={geofenceCenterX}
              y2={geofenceCenterY}
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          )}

          {/* GPS Pin Target Ring with Pulse */}
          <circle cx={pinX} cy={pinY} r="14" fill={location.isWithinGeofence ? '#10b981' : '#f59e0b'} opacity="0.25">
            <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Accuracy circle */}
          <circle
            cx={pinX}
            cy={pinY}
            r="8"
            fill="none"
            stroke={location.isWithinGeofence ? '#34d399' : '#fbbf24'}
            strokeWidth="1"
          />

          {/* Core GPS Pin Beacon */}
          <circle
            cx={pinX}
            cy={pinY}
            r="4.5"
            fill={location.isWithinGeofence ? '#10b981' : '#f59e0b'}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </svg>

        {/* Live Map Legend Overlay (Top Left) */}
        <div className="absolute top-2 left-2 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[10px] font-mono text-slate-300">
          <Crosshair className="w-3 h-3 text-sky-400" />
          <span>GPS Fix: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
        </div>

        {/* Proximity Pill Overlay (Bottom Right) */}
        <div className="absolute bottom-2 right-2 pointer-events-none flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-sm border border-slate-800 text-[10px] font-mono text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Acc: ±{location.accuracyMeters || 4}m</span>
          <span className="text-slate-500">·</span>
          <span className={location.isWithinGeofence ? 'text-emerald-300 font-bold' : 'text-amber-300 font-bold'}>
            {location.distanceToGeofenceMeters}m to HQ
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Details Bar */}
      <div className="px-3.5 py-2 bg-slate-950/90 text-xs flex flex-col gap-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="truncate max-w-[210px] text-slate-300">
              {location.address || '450 Innovation Parkway, Suite 500, San Francisco, CA'}
            </span>
          </span>

          <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0">
            {location.isWithinGeofence ? 'IN-PERIMETER' : 'REMOTE'}
          </span>
        </div>
      </div>
    </div>
  );
};
