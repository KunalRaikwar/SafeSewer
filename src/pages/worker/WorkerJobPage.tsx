import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  Wind,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkerJobPage: React.FC = () => {
  const { jobs, workers } = useSafety();
  const navigate = useNavigate();

  const currentJob = jobs.find(j => j.id === 'SS-127') || jobs[0];
  const assignedWorkers = workers.filter(w => currentJob.assignedWorkerIds.includes(w.id));

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
            Assigned Operation Details
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Job Code: {currentJob.id}</span>
        </div>
      </div>

      {/* Main Chamber Info */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {currentJob.chamberNumber}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {currentJob.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{currentJob.location}</p>
          </div>
          <StatusBadge status={currentJob.status} size="sm" pulse={currentJob.status === 'critical'} />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-navy-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Chamber Depth</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{currentJob.depthMeters} Meters</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Ventilation Blower</span>
            <span className="font-bold text-emerald-500 capitalize">{currentJob.ventilationStatus}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Shift Duration</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{currentJob.startTime} - {currentJob.estimatedEndTime}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Wearable IoT Hub</span>
            <span className="font-mono font-bold text-blue-500">{currentJob.deviceId}</span>
          </div>
        </div>
      </div>

      {/* Designated Supervisor Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 block">
          Topside Sentry & Supervisor
        </span>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{currentJob.supervisorName}</h4>
            <span className="text-[11px] text-slate-500">{currentJob.supervisorPhone}</span>
          </div>
          <a
            href={`tel:${currentJob.supervisorPhone}`}
            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Phone className="w-3.5 h-3.5" />
            Call Lead
          </a>
        </div>
      </div>

      {/* Identified Chamber Hazards */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Pre-Identified Chamber Hazards
        </h4>
        <div className="space-y-1.5">
          {currentJob.hazards.map((hazard, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 font-medium flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {hazard}
            </div>
          ))}
        </div>
      </div>

      {/* Subterranean Crew Members */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-500" />
          Co-Workers in this Ingress ({assignedWorkers.length})
        </h4>
        <div className="space-y-2">
          {assignedWorkers.map(w => (
            <div
              key={w.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {w.id}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{w.name}</span>
                  <span className="text-[10px] text-slate-400">{w.role}</span>
                </div>
              </div>
              <StatusBadge status={w.status} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
