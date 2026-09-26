import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ShieldCheck, 
  Wind, 
  Flame, 
  Activity, 
  Thermometer, 
  Zap, 
  Navigation, 
  ArrowLeft, 
  Clock, 
  Radio, 
  AlertOctagon,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkerSafetyPage: React.FC = () => {
  const { jobs, workers } = useSafety();
  const navigate = useNavigate();

  const currentJob = jobs.find(j => j.id === 'SS-127') || jobs[0];
  const currentWorker = workers.find(w => w.id === 'W103') || workers[0];

  const isSafe = currentJob.status === 'safe';
  const isCritical = currentJob.status === 'critical';

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/worker')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Subterranean Atmospheric Telemetry
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Edge Node: ESP32-003</span>
        </div>
      </div>

      {/* Large Main Status Card */}
      <div
        className={`p-5 rounded-3xl border transition-all text-center space-y-2 shadow-sm ${
          isCritical
            ? 'bg-red-500 text-white border-red-600 pulse-red'
            : isSafe
            ? 'bg-emerald-600 text-white border-emerald-700'
            : 'bg-amber-500 text-slate-950 border-amber-600'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto backdrop-blur-sm">
          {isCritical ? (
            <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
          ) : (
            <ShieldCheck className="w-7 h-7 text-white" />
          )}
        </div>

        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest opacity-90 block">
            Atmospheric Health
          </span>
          <h3 className="text-2xl font-black font-display tracking-tight">
            {isCritical ? 'CRITICAL EVACUATION' : isSafe ? 'SAFE TO WORK' : 'WARNING CONDITION'}
          </h3>
          <p className="text-xs opacity-90 mt-0.5">
            {isCritical
              ? 'Gas concentration threshold breached. Follow extraction protocol.'
              : 'Ambient oxygen & toxic gas values within safe tolerances.'}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-1 text-[11px] opacity-80 font-mono">
          <Clock className="w-3 h-3" />
          <span>Last updated 5 seconds ago</span>
        </div>
      </div>

      {/* 6 Individual Sensor Telemetry Mobile Cards */}
      <div className="space-y-2.5">
        {/* H2S */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-navy-800 text-red-500">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">H₂S (Hydrogen Sulfide)</span>
              <span className={`text-xl font-bold font-mono ${
                currentJob.sensorSummary.h2s > 10 ? 'text-red-500 font-black' : 'text-slate-900 dark:text-white'
              }`}>
                {currentJob.sensorSummary.h2s} ppm
              </span>
            </div>
          </div>
          <StatusBadge
            status={currentJob.sensorSummary.h2s > 10 ? 'critical' : currentJob.sensorSummary.h2s > 5 ? 'warning' : 'safe'}
            size="sm"
          />
        </div>

        {/* CH4 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-navy-800 text-amber-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">CH₄ (Methane LEL)</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currentJob.sensorSummary.ch4}%
              </span>
            </div>
          </div>
          <StatusBadge status="safe" size="sm" />
        </div>

        {/* O2 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-navy-800 text-emerald-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">O₂ (Atmospheric Oxygen)</span>
              <span className={`text-xl font-bold font-mono ${
                currentJob.sensorSummary.o2 < 19.5 ? 'text-red-500 font-black' : 'text-slate-900 dark:text-white'
              }`}>
                {currentJob.sensorSummary.o2}%
              </span>
            </div>
          </div>
          <StatusBadge status={currentJob.sensorSummary.o2 < 19.5 ? 'critical' : 'safe'} size="sm" />
        </div>

        {/* Temperature */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-navy-800 text-blue-500">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Chamber Temperature</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currentJob.sensorSummary.temperature}°C
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-blue-500">NORMAL</span>
        </div>

        {/* Motion Inactivity */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-navy-800 text-emerald-500">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">IMU 6-Axis Motion</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Active Movement Detected
              </span>
            </div>
          </div>
          <StatusBadge status="safe" size="sm" label="ACTIVE" />
        </div>

        {/* GPS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-navy-800 text-blue-500">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Mesh GPS Beacon</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Connected (Indore Zone 4)
              </span>
            </div>
          </div>
          <StatusBadge status="safe" size="sm" label="LOCKED" />
        </div>
      </div>
    </div>
  );
};
