import React, { useState } from 'react';
import { QrCode, X, Check, Building2, ShieldCheck } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (kioskCode: string) => void;
  officeName: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  officeName,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDone, setScannedDone] = useState(false);

  if (!isOpen) return null;

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedDone(true);
      setTimeout(() => {
        onScanSuccess('KIOSK-GATEWAY-L4-SF');
        onClose();
      }, 700);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-semibold text-slate-100">Scan Office Kiosk QR</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 flex flex-col items-center">
          <div className="relative w-52 h-52 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
            {/* Corner targets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-sky-400" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-sky-400" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-sky-400" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-sky-400" />

            {/* Laser scanning line */}
            {isScanning && (
              <div className="absolute inset-x-4 h-0.5 bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-bounce" />
            )}

            {scannedDone ? (
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                  <Check className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-400">Badge Verified</span>
                <span className="text-[11px] text-slate-400 mt-1">Lobby Turnstile 04</span>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg flex items-center justify-center">
                {/* SVG QR Code graphic */}
                <svg className="w-28 h-28 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h10v20H40zM50 20h20v10H50zM0 40h20v10H0zM30 40h10v30H30zM50 40h30v10H50zM40 60h20v20H40zM80 50h20v10H80zM70 70h30v30H70zM80 80h10v10H80zM60 80h10v20H60z" />
                </svg>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Target: <strong className="text-slate-200">{officeName}</strong></span>
          </div>

          <p className="text-[11px] text-slate-400 mt-1 text-center">
            Point camera at dynamic screen at reception turnstiles or kiosk.
          </p>
        </div>

        <button
          onClick={simulateScan}
          disabled={isScanning || scannedDone}
          className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
          {isScanning ? 'Verifying Dynamic Key...' : scannedDone ? 'Verified!' : 'Simulate Instant QR Scan'}
        </button>
      </div>
    </div>
  );
};
