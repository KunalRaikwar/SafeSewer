import React, { useState } from 'react';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { useSafety } from '../../context/SafetyContext';
import { Job, Worker } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  MapPin, 
  Layers, 
  Users, 
  Activity, 
  Flame, 
  Wind, 
  AlertTriangle, 
  AlertOctagon, 
  Radio, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MapPage: React.FC = () => {
  const { jobs, workers, setSelectedWorker } = useSafety();
  const navigate = useNavigate();

  const [selectedJob, setSelectedJob] = useState<Job>(jobs[0]);

  const assignedWorkers = workers.filter(w => selectedJob.assignedWorkerIds.includes(w.id));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              GIS Central Telemetry
            </span>
            <span className="text-xs text-slate-500">
              Coordinate Reference: <span className="font-mono font-semibold text-slate-900 dark:text-white">WGS84 Indore Grid</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
            Subterranean Geospatial Safety Map
          </h2>
        </div>
      </div>

      {/* Full-size Map Container with Sidebar Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Map View (Col 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-4 shadow-sm">
            <InteractiveMap
              height="h-[520px]"
              selectedJobId={selectedJob.id}
              onSelectJob={job => setSelectedJob(job)}
              showFilters={true}
            />
          </div>
        </div>

        {/* Selected Chamber Detail Cockpit (Col 4) */}
        <div className="lg:col-span-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-blue-600 dark:text-blue-400">
                    {selectedJob.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{selectedJob.chamberNumber}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedJob.location}
                </h3>
              </div>
              <StatusBadge status={selectedJob.status} size="sm" pulse={selectedJob.status === 'critical'} />
            </div>

            {/* Chamber Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">H₂S Concentration</span>
                <span className={`text-lg font-bold font-mono mt-1 block ${
                  selectedJob.sensorSummary.h2s > 10 ? 'text-red-500' : selectedJob.sensorSummary.h2s > 5 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {selectedJob.sensorSummary.h2s} ppm
                </span>
                <span className="text-[10px] text-slate-400">Threshold: &lt; 5.0 ppm</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Oxygen Volume</span>
                <span className={`text-lg font-bold font-mono mt-1 block ${
                  selectedJob.sensorSummary.o2 < 19.5 ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {selectedJob.sensorSummary.o2}%
                </span>
                <span className="text-[10px] text-slate-400">Target: 19.5 - 23.5%</span>
              </div>
            </div>

            {/* Ingress Specs */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500">Chamber Depth:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedJob.depthMeters} Meters</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500">Municipal Zone:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedJob.zone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500">IoT Edge Node:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{selectedJob.deviceId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Supervisor on Duty:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedJob.supervisorName.split('(')[0]}</span>
              </div>
            </div>

            {/* Crew in this chamber */}
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 block mb-2">
                Underground Crew ({assignedWorkers.length})
              </span>
              <div className="space-y-2">
                {assignedWorkers.map(w => (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWorker(w)}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-navy-800 hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                        {w.id}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{w.name}</span>
                    </div>
                    <StatusBadge status={w.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/jobs/${selectedJob.id}`)}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-colors"
          >
            <span>Open Comprehensive Job Cockpit</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
