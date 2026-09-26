import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Bell, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  Wind,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkerAlertsPage: React.FC = () => {
  const { alerts } = useSafety();
  const navigate = useNavigate();

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
            Worker Emergency & Safety Feed
          </h2>
          <span className="text-[11px] text-slate-400">Live Topside Pushes & Sensor Warnings</span>
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {alerts.map(alert => {
          const isCritical = alert.severity === 'critical';
          const isWarning = alert.severity === 'warning';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border shadow-sm space-y-2.5 transition-all ${
                isCritical && alert.status !== 'resolved'
                  ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/30 ring-1 ring-red-500/30'
                  : isWarning && alert.status !== 'resolved'
                  ? 'border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/30'
                  : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {isCritical ? (
                    <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {alert.alertType}
                  </h4>
                </div>
                <StatusBadge status={alert.severity} size="sm" pulse={isCritical && alert.status !== 'resolved'} />
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Chamber:</span>
                  <span className="font-semibold">{alert.location}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Sensor Reading:</span>
                  <span className="font-bold text-red-500">{alert.sensorValue}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 text-slate-400">
                  <span>Logged at {alert.timestamp}</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{alert.jobId}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-navy-950 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                <span className="font-bold text-slate-900 dark:text-white">Action: </span>
                {alert.actionRequired}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
