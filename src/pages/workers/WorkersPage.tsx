import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Worker } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Heart, 
  Cpu, 
  Clock, 
  ExternalLink, 
  Wind, 
  Filter,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Award
} from 'lucide-react';

export const WorkersPage: React.FC = () => {
  const { workers, setSelectedWorker, jobs } = useSafety();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.currentJobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.assignedDeviceId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              Worker Safety Roster
            </span>
            <span className="text-xs text-slate-500">
              Active Registered Field Specialists: <span className="font-bold text-slate-900 dark:text-white">{workers.length}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
            Worker Safety Fleet & PPE Verification
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search workers by name, ID, chamber or device..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1">
          {(['all', 'safe', 'warning', 'critical'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Workers Table */}
      <div className="hidden md:block bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-navy-800 bg-slate-50/70 dark:bg-navy-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">Worker Profile</th>
              <th className="py-3.5 px-4">Current Deployment</th>
              <th className="py-3.5 px-4">Live Safety Status</th>
              <th className="py-3.5 px-4">PPE Verification</th>
              <th className="py-3.5 px-4">Biometrics</th>
              <th className="py-3.5 px-4">Edge Device</th>
              <th className="py-3.5 px-4">Safety Score</th>
              <th className="py-3.5 px-4 text-right">Inspection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-xs">
            {filteredWorkers.map(worker => (
              <tr
                key={worker.id}
                onClick={() => setSelectedWorker(worker)}
                className="hover:bg-slate-50 dark:hover:bg-navy-850/60 cursor-pointer transition-colors group"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold font-display text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                      {worker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-blue-500 transition-colors">
                        {worker.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {worker.id} &bull; {worker.role}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {worker.currentJobId}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                    {worker.currentLocation}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <StatusBadge status={worker.status} size="sm" pulse={worker.status === 'critical'} />
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    {worker.ppeStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        PPE Verified ({worker.ppeConfidence}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                        <AlertTriangle className="w-4 h-4" />
                        PPE Re-Check Req.
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-mono">
                    <Heart className={`w-3.5 h-3.5 ${worker.heartRate > 105 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                    <span className="font-bold">{worker.heartRate}</span> bpm
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-navy-800 rounded font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-navy-700">
                    {worker.assignedDeviceId}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold font-mono text-sm ${
                      worker.safetyScore >= 90 ? 'text-emerald-500' : worker.safetyScore >= 75 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {worker.safetyScore}
                    </span>
                    <div className="w-16 bg-slate-100 dark:bg-navy-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          worker.safetyScore >= 90 ? 'bg-emerald-500' : worker.safetyScore >= 75 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${worker.safetyScore}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWorker(worker);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-blue-600 dark:text-blue-400 font-semibold transition-colors"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Worker Cards */}
      <div className="md:hidden space-y-3">
        {filteredWorkers.map(worker => (
          <div
            key={worker.id}
            onClick={() => setSelectedWorker(worker)}
            className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm space-y-3 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold font-display text-sm flex items-center justify-center">
                  {worker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {worker.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">{worker.id} &bull; {worker.role}</p>
                </div>
              </div>
              <StatusBadge status={worker.status} size="sm" pulse={worker.status === 'critical'} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-navy-800 text-slate-600 dark:text-slate-400">
              <div>Job: <span className="font-mono font-bold text-blue-500">{worker.currentJobId}</span></div>
              <div>Heart Rate: <span className="font-mono font-bold text-slate-900 dark:text-white">{worker.heartRate} bpm</span></div>
              <div>PPE: <span className="font-semibold text-emerald-500">{worker.ppeStatus}</span></div>
              <div>Score: <span className="font-bold text-emerald-500">{worker.safetyScore}/100</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
