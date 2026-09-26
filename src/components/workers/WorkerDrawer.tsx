import React from 'react';
import { Drawer } from '../common/Drawer';
import { useSafety } from '../../context/SafetyContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Heart, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Phone, 
  Clock, 
  UserCheck, 
  Radio, 
  Activity,
  Award,
  AlertOctagon,
  Flame,
  Wind
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkerDrawer: React.FC = () => {
  const { selectedWorker, setSelectedWorker, jobs, devices, alerts, triggerEmergencySos } = useSafety();
  const navigate = useNavigate();

  if (!selectedWorker) return null;

  const currentJob = jobs.find(j => j.id === selectedWorker.currentJobId);
  const assignedDevice = devices.find(d => d.id === selectedWorker.assignedDeviceId);
  const workerAlerts = alerts.filter(a => a.workerId === selectedWorker.id);

  return (
    <Drawer
      isOpen={!!selectedWorker}
      onClose={() => setSelectedWorker(null)}
      title={`Worker Dossier: ${selectedWorker.name}`}
      subtitle={`ID: ${selectedWorker.id} • ${selectedWorker.role}`}
      width="xl"
    >
      <div className="space-y-6">
        {/* Top Worker Profile Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold font-display text-lg flex items-center justify-center shadow-md">
              {selectedWorker.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedWorker.name}
                </h3>
                <StatusBadge status={selectedWorker.status} size="sm" pulse={selectedWorker.status === 'critical'} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedWorker.role}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {selectedWorker.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Shift: {selectedWorker.shiftStart}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-navy-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Safety Score</span>
            <span className={`text-2xl font-black font-display ${
              selectedWorker.safetyScore >= 90
                ? 'text-emerald-500'
                : selectedWorker.safetyScore >= 75
                ? 'text-amber-500'
                : 'text-red-500'
            }`}>
              {selectedWorker.safetyScore}<span className="text-xs text-slate-400">/100</span>
            </span>
          </div>
        </div>

        {/* Live Vitals & Biometrics Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Real-Time Edge Vitals
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white dark:bg-navy-850 rounded-xl border border-slate-200 dark:border-navy-800">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Heart Rate</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className={`text-xl font-bold font-mono ${
                  selectedWorker.heartRate > 105 ? 'text-red-500' : 'text-slate-900 dark:text-white'
                }`}>
                  {selectedWorker.heartRate}
                </span>
                <span className="text-xs text-slate-400">BPM</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {selectedWorker.heartRate > 105 ? 'Elevated exertion' : 'Normal resting rate'}
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-navy-850 rounded-xl border border-slate-200 dark:border-navy-800">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Gas Exposure</span>
                <Wind className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-1">
                <span className={`text-sm font-bold uppercase ${
                  selectedWorker.gasExposureScore === 'high'
                    ? 'text-red-500 font-extrabold'
                    : selectedWorker.gasExposureScore === 'moderate'
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }`}>
                  {selectedWorker.gasExposureScore} Risk
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Accumulated dose score</span>
            </div>

            <div className="p-3 bg-white dark:bg-navy-850 rounded-xl border border-slate-200 dark:border-navy-800 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>PPE Verification</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  {selectedWorker.ppeStatus}
                </span>
                {selectedWorker.ppeConfidence && (
                  <span className="text-xs text-slate-400">({selectedWorker.ppeConfidence}%)</span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">AI Vision camera check</span>
            </div>
          </div>
        </div>

        {/* Current Active Chamber Job */}
        {currentJob && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Deployment</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentJob.id} &bull; {currentJob.chamberNumber}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{currentJob.location}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedWorker(null);
                  navigate(`/jobs/${currentJob.id}`);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Inspect Job
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-navy-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Depth</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentJob.depthMeters} meters</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">H₂S Chamber</span>
                <span className="font-bold text-red-500 font-mono">{currentJob.sensorSummary.h2s} ppm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Ventilation</span>
                <span className="font-semibold text-emerald-500 capitalize">{currentJob.ventilationStatus}</span>
              </div>
            </div>
          </div>
        )}

        {/* Assigned IoT Edge Device */}
        {assignedDevice && (
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {assignedDevice.id} ({assignedDevice.model})
                </span>
              </div>
              <StatusBadge status={assignedDevice.status} size="sm" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div>Battery: <span className="font-semibold">{assignedDevice.battery}%</span></div>
              <div>Signal: <span className="font-semibold">{assignedDevice.signalRssi} dBm</span></div>
              <div>Sync: <span className="font-semibold">{assignedDevice.lastSync}</span></div>
            </div>
          </div>
        )}

        {/* Certifications */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Safety Certifications & Permissions
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {selectedWorker.certifications.map(cert => (
              <span
                key={cert}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Emergency Contact
          </span>
          <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-medium">
            <span>{selectedWorker.emergencyContact.name} ({selectedWorker.emergencyContact.relation})</span>
            <a
              href={`tel:${selectedWorker.emergencyContact.phone}`}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              {selectedWorker.emergencyContact.phone}
            </a>
          </div>
        </div>

        {/* Action Button: Panic SOS Simulation */}
        <div className="pt-2">
          <button
            onClick={() => {
              triggerEmergencySos(selectedWorker.id);
              setSelectedWorker(null);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-colors"
          >
            <AlertOctagon className="w-4 h-4" />
            Dispatch Direct Emergency Extraction Protocol
          </button>
        </div>
      </div>
    </Drawer>
  );
};
