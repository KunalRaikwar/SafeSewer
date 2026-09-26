import React, { useState } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles, 
  ArrowLeft, 
  UploadCloud,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';

const PPE_CHECKLIST = [
  { name: 'Industrial Hard Hat (Helmet)', confidence: 98, status: 'PASSED' },
  { name: 'Chemical Resistant Safety Gloves', confidence: 95, status: 'PASSED' },
  { name: 'Steel-Toe Anti-Static Safety Boots', confidence: 94, status: 'PASSED' },
  { name: 'Full Face SCBA Respirator Mask', confidence: 89, status: 'PASSED' },
  { name: 'Wearable Multi-Gas Detector Clip', confidence: 96, status: 'PASSED' },
  { name: 'Body Safety Harness (Type 4)', confidence: 91, status: 'PASSED' },
];

export const WorkerPpePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useSafety();

  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);

  const handleRescan = () => {
    setIsScanning(true);
    setScanComplete(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      addToast('success', 'PPE Verification Passed', 'AI Vision Engine verified all 6 PPE items (92% aggregate confidence).');
    }, 2200);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/worker')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
            AI Pre-Entry PPE Verification
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Vision Model: SafeSewer-Vision v1.8</span>
        </div>
      </div>

      {/* Camera Scanning Viewport Simulation */}
      <div className="relative h-60 rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 flex flex-col items-center justify-center text-center p-4">
        {/* Animated Laser Grid Overlay during scanning */}
        {isScanning && (
          <>
            <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce shadow-lg shadow-cyan-400/50" />
          </>
        )}

        {/* Framing Corner Accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />

        {/* Center Target Box */}
        <div className="w-32 h-44 rounded-2xl border-2 border-dashed border-slate-600/80 flex flex-col items-center justify-center p-2">
          {isScanning ? (
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                Scanning PPE Gear...
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <span className="text-[10px] font-mono text-slate-300 font-semibold block">
                Worker Pose Locked
              </span>
            </div>
          )}
        </div>

        {/* Overlay Confidence Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Confidence: 92%
          </span>
          <span className="font-bold text-white uppercase">STATUS: PASSED</span>
        </div>
      </div>

      {/* Action Button: Re-scan */}
      <button
        onClick={handleRescan}
        disabled={isScanning}
        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
        <span>{isScanning ? 'Running Neural Inspection...' : 'Re-Run Computer Vision Scan'}</span>
      </button>

      {/* PPE Verified Checklist */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-navy-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Mandatory Gear Checklist (6/6)
          </h3>
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            ALL VERIFIED
          </span>
        </div>

        <div className="space-y-2">
          {PPE_CHECKLIST.map(item => (
            <div
              key={item.name}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400 font-bold">
                {item.confidence}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
