import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SensorCard } from '../../components/common/SensorCard';
import { SensorChart } from '../../components/sensor/SensorChart';
import { EmergencySosModal } from '../../components/emergency/EmergencySosModal';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  Wind, 
  Flame, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Radio, 
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, workers, alerts, devices, incidents, setSelectedWorker } = useSafety();

  const [showSosModal, setShowSosModal] = useState(false);

  const job = jobs.find(j => j.id === id) || jobs[0];
  const assignedWorkers = workers.filter(w => job.assignedWorkerIds.includes(w.id));
  const jobAlerts = alerts.filter(a => a.jobId === job.id);
  const assignedDevice = devices.find(d => d.id === job.deviceId);
  const relatedIncidents = incidents.filter(i => i.jobId === job.id);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/jobs')}
            className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Back to all jobs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                {job.id}
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {job.chamberNumber}
              </span>
              <StatusBadge status={job.status} size="sm" pulse={job.status === 'critical'} />
            </div>
            <h2 className="text-lg sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-0.5">
              {job.title}
            </h2>
          </div>
        </div>

        {/* Emergency Trigger Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSosModal(true)}
            className="px-4 py-2.5 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/25 flex items-center gap-2 transition-all pulse-red"
          >
            <ShieldAlert className="w-4 h-4" />
            Dispatch Rescue Protocol
          </button>
        </div>
      </div>

      {/* Main Grid: Job Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Environmental Telemetry & Chart */}
        <div className="lg:col-span-2 space-y-5">
          {/* Live Sensor Gauges for this chamber */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Live Atmospheric Conditions &bull; {job.chamberNumber}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time telemetry stream from IoT Node {job.deviceId} at {job.depthMeters}m depth
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-500 font-semibold">
                Updated {job.sensorSummary.lastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <SensorCard
                type="h2s"
                value={job.sensorSummary.h2s}
                unit="ppm"
                status={job.sensorSummary.h2s > 10 ? 'critical' : job.sensorSummary.h2s > 5 ? 'warning' : 'safe'}
                threshold="< 5.0 ppm"
              />
              <SensorCard
                type="ch4"
                value={job.sensorSummary.ch4}
                unit="%"
                status={job.sensorSummary.ch4 > 1.0 ? 'critical' : job.sensorSummary.ch4 > 0.5 ? 'warning' : 'safe'}
                threshold="< 0.5%"
              />
              <SensorCard
                type="o2"
                value={job.sensorSummary.o2}
                unit="%"
                status={job.sensorSummary.o2 < 19.5 ? 'critical' : 'safe'}
                threshold="19.5 - 23.5%"
              />
              <SensorCard
                type="temperature"
                value={job.sensorSummary.temperature}
                unit="°C"
                status={job.sensorSummary.temperature > 35 ? 'warning' : 'safe'}
                threshold="< 35°C"
              />
              <SensorCard
                type="motion"
                value={job.sensorSummary.motion ? 'Active' : 'No Motion'}
                status={job.sensorSummary.motion ? 'safe' : 'warning'}
              />
              <SensorCard
                type="gps"
                value="Locked"
                status="safe"
                subtitle="Lat 22.7196, Lng 75.8577"
              />
            </div>
          </div>

          {/* Historical Trends Chart */}
          <SensorChart initialGas={job.status === 'critical' ? 'h2s' : 'o2'} />

          {/* Incident Timeline if exists */}
          {relatedIncidents.length > 0 && (
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Chamber Incident Timeline & Forensics
                </h3>
                <span className="text-xs font-mono font-bold text-red-500">
                  {relatedIncidents[0].id}
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-navy-800">
                {relatedIncidents[0].timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-navy-900" />
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {event.title}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-slate-400">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Assigned Crew, Location & PPE Verification */}
        <div className="space-y-5">
          {/* Job Overview Card */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Chamber Specifications
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500">Location Address</span>
                <span className="font-semibold text-right text-slate-900 dark:text-white max-w-[180px]">
                  {job.location}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500">Municipal Zone</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.zone}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500">Vertical Ingress Depth</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{job.depthMeters} Meters</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-navy-800">
                <span className="text-slate-500">Ventilation Status</span>
                <span className={`font-bold uppercase ${
                  job.ventilationStatus === 'alert' ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {job.ventilationStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shift Window</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.startTime} - {job.estimatedEndTime}</span>
              </div>
            </div>

            {/* Supervisor Info */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Designated Supervisor</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-slate-900 dark:text-white">{job.supervisorName}</span>
                <a href={`tel:${job.supervisorPhone}`} className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold hover:underline">
                  <Phone className="w-3 h-3" />
                  Call
                </a>
              </div>
            </div>
          </div>

          {/* Assigned Workers Crew Card */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Assigned Workers ({assignedWorkers.length})
              </h3>
              <span className="text-xs text-slate-400">Click to inspect</span>
            </div>

            <div className="space-y-2.5">
              {assignedWorkers.map(w => (
                <div
                  key={w.id}
                  onClick={() => setSelectedWorker(w)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-navy-800 hover:border-slate-300 dark:hover:border-navy-600 bg-slate-50/50 dark:bg-navy-950/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                      {w.id}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {w.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {w.role} &bull; HR: <span className="font-mono font-semibold">{w.heartRate} bpm</span>
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={w.status} size="sm" pulse={w.status === 'critical'} />
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory PPE Checklist */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Safety Equipment (PPE)
            </h3>
            <div className="space-y-1.5">
              {job.requiredPpe.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
        workerId={assignedWorkers[0]?.id || 'W103'}
        workerName={assignedWorkers[0]?.name || 'Suresh Yadav'}
        location={job.location}
        jobId={job.id}
      />
    </div>
  );
};
