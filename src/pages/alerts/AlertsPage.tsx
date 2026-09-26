import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { SafetyAlert } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Bell, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  Wind, 
  ShieldAlert, 
  ShieldCheck,
  Check,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert } = useSafety();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.alertType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.workerName && alert.workerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'resolved'
        ? alert.status === 'resolved'
        : alert.severity === activeTab && alert.status !== 'resolved';

    return matchesSearch && matchesTab;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && a.status !== 'resolved').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              Safety Dispatch & Escalation
            </span>
            <span className="text-xs text-slate-500">
              Live Edge Anomaly Feed
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
            Emergency & Safety Alerts Center
          </h2>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by type, worker, chamber, or location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Alerts', count: alerts.length },
            { id: 'critical', label: 'Critical', count: criticalCount, isCrit: true },
            { id: 'warning', label: 'Warnings', count: warningCount, isWarn: true },
            { id: 'resolved', label: 'Resolved', count: resolvedCount },
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : tab.isCrit && tab.count > 0
                      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 font-bold'
                      : 'bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert Cards Stack */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No active alerts in this filter</h3>
            <p className="text-xs text-slate-500 mt-1">All subterranean parameters are currently within safe operational thresholds.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isResolved = alert.status === 'resolved';
            const isAcknowledged = alert.status === 'acknowledged';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all duration-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                  isCritical && !isResolved
                    ? 'border-red-300 dark:border-red-800/80 bg-red-50/20 dark:bg-red-950/20'
                    : isWarning && !isResolved
                    ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/20'
                    : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 opacity-80'
                }`}
              >
                {/* Left Side Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl flex-shrink-0 mt-0.5 bg-slate-100 dark:bg-navy-800">
                    {isCritical ? (
                      <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{alert.id}</span>
                      <StatusBadge status={alert.severity} size="sm" pulse={isCritical && !isResolved} />
                      <span className="text-xs text-slate-400">&bull;</span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {alert.timestamp}
                      </span>
                      {isAcknowledged && (
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                          Acknowledged by {alert.acknowledgedBy}
                        </span>
                      )}
                      {isResolved && (
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                          Resolved at {alert.resolvedAt}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                      {alert.alertType}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{alert.location}</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 ml-1">({alert.jobId})</span>
                      </div>
                      {alert.workerName && (
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Worker: {alert.workerName} ({alert.workerId})</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 font-mono">
                        <Wind className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-red-500">{alert.sensorValue}</span>
                        <span className="text-slate-400">({alert.threshold})</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Protocol Action:</span>{' '}
                      {alert.actionRequired}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 lg:flex-shrink-0">
                  <button
                    onClick={() => navigate(`/jobs/${alert.jobId}`)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Job
                  </button>

                  {!isAcknowledged && !isResolved && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id, 'Rajesh Nagar (Supervisor #04)')}
                      className="px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Acknowledge
                    </button>
                  )}

                  {!isResolved ? (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolve Alert
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-navy-800 rounded-lg">
                      Archived
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
