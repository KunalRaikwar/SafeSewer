import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Incident } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  PhoneCall, 
  Siren, 
  ArrowRight,
  Wind,
  Activity,
  FileText,
  Radio
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IncidentsPage: React.FC = () => {
  const { incidents } = useSafety();
  const navigate = useNavigate();

  const [selectedIncident, setSelectedIncident] = useState<Incident>(incidents[0]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              Audit & Post-Incident Forensics
            </span>
            <span className="text-xs text-slate-500">
              Recorded Safety Escalations: <span className="font-bold text-slate-900 dark:text-white">{incidents.length}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
            Incident Management & Forensic Timelines
          </h2>
        </div>
      </div>

      {/* Main Grid: Incident Table on Left, Deep Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Incident List Table (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Logged Incident Register
              </h3>
              <span className="text-xs text-slate-400">Click row to review forensic timeline</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-navy-800">
              {incidents.map(inc => {
                const isSelected = selectedIncident.id === inc.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-l-blue-600'
                        : 'hover:bg-slate-50 dark:hover:bg-navy-850/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            {inc.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">&bull;</span>
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                            {inc.jobId}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {inc.title}
                        </h4>
                      </div>
                      <StatusBadge status={inc.responseStatus} size="sm" pulse={inc.responseStatus === 'evacuating'} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        Worker: <span className="font-semibold text-slate-900 dark:text-white">{inc.workerName}</span>
                      </div>
                      <div>
                        Detected: <span className="font-mono text-slate-900 dark:text-white">{inc.detectedAt}</span>
                      </div>
                      <div>
                        Peak Gas: <span className="font-mono font-bold text-red-500">{inc.peakGasLevel.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deep Vertical Forensic Timeline (Col 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Incident Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-red-600 dark:text-red-400">
                    {selectedIncident.id}
                  </span>
                  <StatusBadge status={selectedIncident.severity} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedIncident.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedIncident.location}</p>
              </div>
            </div>

            {/* Incident Diagnostic Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 space-y-2 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-slate-200 dark:border-navy-800">
                <span className="text-slate-500">Involved Specialist:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedIncident.workerName} ({selectedIncident.workerId})
                </span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200 dark:border-navy-800">
                <span className="text-slate-500">Peak Exposure Level:</span>
                <span className="font-mono font-bold text-red-500">{selectedIncident.peakGasLevel}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Primary Root Cause:</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {selectedIncident.primaryCause}
                </p>
              </div>
            </div>

            {/* Vertical Incident Timeline requested in spec */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Minute-by-Minute Event Timeline
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-navy-800">
                {selectedIncident.timeline.map((event, idx) => {
                  const isLast = idx === selectedIncident.timeline.length - 1;
                  const isFirst = idx === 0;

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline dot icon */}
                      <div
                        className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-navy-900 ${
                          isFirst
                            ? 'bg-red-500 animate-pulse'
                            : isLast
                            ? 'bg-emerald-500'
                            : 'bg-blue-600'
                        }`}
                      />

                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {event.title}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {event.time}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {event.description}
                      </p>

                      {event.actor && (
                        <span className="text-[10px] text-slate-400 font-mono mt-1 inline-block">
                          Actor: {event.actor}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-navy-800">
            <button
              onClick={() => navigate(`/jobs/${selectedIncident.jobId}`)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Inspect Chamber {selectedIncident.jobId} Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
