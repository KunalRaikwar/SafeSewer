import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmergencySosModal } from '../../components/emergency/EmergencySosModal';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Siren, 
  Activity, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  Heart, 
  Cpu, 
  ArrowRight, 
  Wind, 
  Radio, 
  ChevronRight,
  Shield,
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkerHomePage: React.FC = () => {
  const { jobs, workers, alerts } = useSafety();
  const navigate = useNavigate();

  const [showSosModal, setShowSosModal] = useState(false);

  // Current logged in worker context (W103 - Suresh Yadav or W101)
  const currentWorker = workers.find(w => w.id === 'W103') || workers[0];
  const currentJob = jobs.find(j => j.id === currentWorker.currentJobId) || jobs[0];

  const isSafe = currentJob.status === 'safe';
  const isCritical = currentJob.status === 'critical';

  return (
    <div className="space-y-4">
      {/* Primary Top Status Card: SAFE TO WORK / WARNING / CRITICAL */}
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
            Subterranean Condition Status
          </span>
          <h2 className="text-2xl font-black font-display tracking-tight">
            {isCritical ? 'EVACUATE IMMEDIATELY' : isSafe ? 'SAFE TO WORK' : 'CAUTION ADVISED'}
          </h2>
          <p className="text-xs opacity-90 mt-0.5">
            {isCritical
              ? 'Toxic gas surge detected in chamber. Ascend hoist.'
              : 'All multi-gas parameters within OSHA permissible limits.'}
          </p>
        </div>
      </div>

      {/* Active Job Quick Card */}
      <div
        onClick={() => navigate('/worker/job')}
        className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-navy-700 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-navy-800 text-blue-600 dark:text-blue-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {currentJob.id}
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentJob.chamberNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
              {currentJob.location}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      {/* Live Monitoring HUD Grid */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Chamber Live Telemetry
            </h3>
          </div>
          <span className="text-[10px] text-emerald-500 font-mono font-semibold">
            ● LoRa Synced
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
            <span className="text-[10px] text-slate-400 block font-semibold">H₂S Toxic Gas</span>
            <span className={`text-base font-bold font-mono ${
              currentJob.sensorSummary.h2s > 10 ? 'text-red-500 font-black' : 'text-emerald-500'
            }`}>
              {currentJob.sensorSummary.h2s} ppm
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Oxygen Volume</span>
            <span className={`text-base font-bold font-mono ${
              currentJob.sensorSummary.o2 < 19.5 ? 'text-red-500' : 'text-emerald-500'
            }`}>
              {currentJob.sensorSummary.o2}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Methane (CH₄)</span>
            <span className="text-base font-bold font-mono text-emerald-500">
              {currentJob.sensorSummary.ch4}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Heart Rate</span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-red-500" />
              {currentWorker.heartRate} bpm
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/worker/safety')}
          className="w-full py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline text-center block pt-1"
        >
          View Full Atmospheric Sensor HUD &rarr;
        </button>
      </div>

      {/* PPE Verification Card */}
      <div
        onClick={() => navigate('/worker/ppe')}
        className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-300 dark:border-emerald-800/80 rounded-2xl shadow-sm cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                AI PPE Pre-Entry Check
              </h4>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded">
                92% CONFIDENCE
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Helmet, SCBA, Boots, Harness Verified &bull; PASSED
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* BIG Prominent Emergency SOS Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowSosModal(true)}
          className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-red-600/30 transition-all pulse-red border-2 border-red-500"
        >
          <Siren className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
          <span>TRIGGER EMERGENCY SOS</span>
        </button>
        <p className="text-[10px] text-center text-slate-500 mt-1.5 font-medium">
          Instantly alerts topside hoist sentry & Indore Rescue Division
        </p>
      </div>

      {/* Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
        workerId={currentWorker.id}
        workerName={currentWorker.name}
        location={currentJob.location}
        jobId={currentJob.id}
      />
    </div>
  );
};
