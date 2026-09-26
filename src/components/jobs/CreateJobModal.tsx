import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useSafety } from '../../context/SafetyContext';
import { MapPin, Users, ShieldCheck, CheckSquare, Clock, Plus, AlertTriangle, Layers } from 'lucide-react';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_PPE_ITEMS = [
  'Full SCBA Respirator',
  'Safety Harness Type 4',
  'Multi-Gas Monitor (H2S/CH4/O2/CO)',
  'Explosion-Proof LED Headlamp',
  'Chemical Resistant Gloves',
  'Steel-Toe Anti-Static Boots',
  'Tripod Rescue Retrieval Hoist',
  'Forced Air Ventilation Blower',
];

const SAFETY_CHECKLIST_ITEMS = [
  'Atmospheric Gas Pre-Sweep Conducted (> 19.5% O2, < 5 ppm H2S)',
  'Topside Attendant & Sentry Confirmed on Site',
  'Emergency Retrieval Winch & Harness Anchored',
  'Intrinsically Safe Radios / RF Mesh Verified',
  'Work Permit & Lockout/Tagout (LOTO) Authorized',
];

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  const { workers, createJob } = useSafety();

  const [title, setTitle] = useState('');
  const [chamberNumber, setChamberNumber] = useState('Chamber #38');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('Zone 4 - Central Indore');
  const [depthMeters, setDepthMeters] = useState('5.5');
  const [supervisorName, setSupervisorName] = useState('Rajesh Nagar (Supervisor #04)');
  const [supervisorPhone, setSupervisorPhone] = useState('+91 98261 55667');
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>(['W104', 'W105']);
  const [selectedPpe, setSelectedPpe] = useState<string[]>([
    'Full SCBA Respirator',
    'Safety Harness Type 4',
    'Multi-Gas Monitor (H2S/CH4/O2/CO)',
    'Explosion-Proof LED Headlamp',
  ]);
  const [completedChecklist, setCompletedChecklist] = useState<string[]>([
    'Atmospheric Gas Pre-Sweep Conducted (> 19.5% O2, < 5 ppm H2S)',
    'Topside Attendant & Sentry Confirmed on Site',
  ]);
  const [startTime, setStartTime] = useState('11:00 AM');
  const [estimatedEndTime, setEstimatedEndTime] = useState('03:30 PM');

  const toggleWorker = (id: string) => {
    setSelectedWorkerIds(prev =>
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const togglePpe = (item: string) => {
    setSelectedPpe(prev =>
      prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]
    );
  };

  const toggleChecklist = (item: string) => {
    setCompletedChecklist(prev =>
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    createJob({
      title,
      chamberNumber,
      location,
      zone,
      coordinates: {
        lat: 22.72 + (Math.random() - 0.5) * 0.04,
        lng: 75.86 + (Math.random() - 0.5) * 0.06,
      },
      depthMeters: parseFloat(depthMeters) || 5.0,
      supervisorName,
      supervisorPhone,
      assignedWorkerIds: selectedWorkerIds,
      deviceId: 'ESP32-005',
      startTime,
      estimatedEndTime,
      requiredPpe: selectedPpe,
      hazards: ['Confined Ingress', 'Toxic Silt Accumulation', 'Vapor Pocket Risk'],
      ventilationStatus: 'operational',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Confined-Space Safety Job"
      subtitle="Register new sewer chamber entry with mandatory PPE verification & safety checks."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Job Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Job Title / Operation Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Siphon Chamber Desilting & Structural Inspection"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Chamber / Manhole ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chamber #38"
              value={chamberNumber}
              onChange={e => setChamberNumber(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Municipal Zone
            </label>
            <select
              value={zone}
              onChange={e => setZone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm outline-none"
            >
              <option value="Zone 1 - Heritage Core">Zone 1 - Heritage Core (Rajwada)</option>
              <option value="Zone 2 - North Indore">Zone 2 - North Indore (Vijay Nagar)</option>
              <option value="Zone 3 - Central East">Zone 3 - Central East (Palasia)</option>
              <option value="Zone 4 - Central Indore">Zone 4 - Central Indore (M.G. Road)</option>
              <option value="Zone 5 - East Ring">Zone 5 - East Ring (Bypass)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Exact Street Address / Landmark *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Near Geeta Bhawan Square, A.B. Road, Indore"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Chamber Depth (Meters)
            </label>
            <input
              type="number"
              step="0.1"
              value={depthMeters}
              onChange={e => setDepthMeters(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Assigned Supervisor
            </label>
            <input
              type="text"
              value={supervisorName}
              onChange={e => setSupervisorName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white text-sm outline-none"
            />
          </div>
        </div>

        {/* Worker Assignment */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Assign Qualified Workers ({selectedWorkerIds.length} Selected)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800">
            {workers.map(w => {
              const isSelected = selectedWorkerIds.includes(w.id);
              return (
                <div
                  key={w.id}
                  onClick={() => toggleWorker(w.id)}
                  className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-semibold'
                      : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-bold">{w.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{w.id} &bull; Score: {w.safetyScore}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Required PPE Checklist */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Mandatory PPE Requirements ({selectedPpe.length})
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AVAILABLE_PPE_ITEMS.map(item => {
              const isChecked = selectedPpe.includes(item);
              return (
                <label
                  key={item}
                  onClick={() => togglePpe(item)}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-navy-800 hover:bg-slate-50 dark:hover:bg-navy-850 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{item}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Pre-Entry Safety Checklist */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Pre-Entry Verification Protocol ({completedChecklist.length}/{SAFETY_CHECKLIST_ITEMS.length})
          </label>
          <div className="space-y-1.5">
            {SAFETY_CHECKLIST_ITEMS.map(check => {
              const isChecked = completedChecklist.includes(check);
              return (
                <label
                  key={check}
                  onClick={() => toggleChecklist(check)}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={`text-xs ${isChecked ? 'text-slate-900 dark:text-slate-200 font-semibold' : 'text-slate-400'}`}>
                    {check}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Authorize & Dispatch Job
          </button>
        </div>
      </form>
    </Modal>
  );
};
