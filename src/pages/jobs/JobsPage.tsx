import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Job } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateJobModal } from '../../components/jobs/CreateJobModal';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Filter, 
  MapPin, 
  Users, 
  Cpu, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Wind
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const JobsPage: React.FC = () => {
  const { jobs, workers } = useSafety();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'warning' | 'critical' | 'offline'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.chamberNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.supervisorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              Operations Hub
            </span>
            <span className="text-xs text-slate-500">
              Total Active Operations: <span className="font-bold text-slate-900 dark:text-white">{jobs.length}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
            Confined Space Job Management
          </h2>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Entry Job
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Job ID, Chamber, Street or Supervisor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'safe', 'warning', 'critical', 'offline'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
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

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-navy-800 bg-slate-50/70 dark:bg-navy-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">Job ID & Chamber</th>
              <th className="py-3.5 px-4">Location / Zone</th>
              <th className="py-3.5 px-4">Assigned Crew</th>
              <th className="py-3.5 px-4">Supervisor</th>
              <th className="py-3.5 px-4">Safety Status</th>
              <th className="py-3.5 px-4">IoT Node</th>
              <th className="py-3.5 px-4">Time Window</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-xs">
            {filteredJobs.map(job => {
              const assignedWorkers = workers.filter(w => job.assignedWorkerIds.includes(w.id));

              return (
                <tr
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-navy-850/60 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                      {job.id}
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5">
                      {job.chamberNumber}
                    </div>
                  </td>

                  <td className="py-4 px-4 max-w-[200px]">
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {job.location}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.zone.split('-')[0]} &bull; {job.depthMeters}m depth
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {assignedWorkers.map(w => (
                          <div
                            key={w.id}
                            title={`${w.name} (${w.id})`}
                            className="w-6 h-6 rounded-full bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-navy-900 font-mono"
                          >
                            {w.id}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {assignedWorkers.length} Workers
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-900 dark:text-slate-200">
                      {job.supervisorName.split('(')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400">{job.supervisorPhone}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <StatusBadge status={job.status} size="sm" pulse={job.status === 'critical'} />
                      <div className="text-[10px] text-slate-400 font-mono">
                        H₂S: <span className="font-semibold text-slate-600 dark:text-slate-300">{job.sensorSummary.h2s} ppm</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-navy-800 rounded font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-navy-700">
                      {job.deviceId}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">
                      {job.startTime} - {job.estimatedEndTime}
                    </div>
                    <div className="text-[10px] text-emerald-500 font-semibold uppercase">
                      {job.operationalStatus}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job.id}`);
                      }}
                      className="p-2 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-navy-800 transition-colors"
                      title="View Job Cockpit"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm space-y-3 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {job.id}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {job.chamberNumber}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.location}</p>
              </div>
              <StatusBadge status={job.status} size="sm" pulse={job.status === 'critical'} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-navy-800 text-slate-600 dark:text-slate-400">
              <div>
                Crew: <span className="font-semibold text-slate-900 dark:text-white">{job.assignedWorkerIds.length} Workers</span>
              </div>
              <div>
                Depth: <span className="font-semibold text-slate-900 dark:text-white">{job.depthMeters}m</span>
              </div>
              <div>
                H₂S: <span className="font-bold text-red-500 font-mono">{job.sensorSummary.h2s} ppm</span>
              </div>
              <div>
                Node: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{job.deviceId}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">{job.startTime} - {job.estimatedEndTime}</span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Details &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      <CreateJobModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
