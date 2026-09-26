import React from 'react';
import { AlertOctagon, Siren, Eye, CheckCircle2, ShieldAlert, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { useNavigate } from 'react-router-dom';

interface CriticalAlertBannerProps {
  onOpenEmergencyProtocol?: () => void;
}

export const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({ onOpenEmergencyProtocol }) => {
  const { 
    alerts, 
    acknowledgeAlert, 
    jobs, 
    isSirenPlaying, 
    playEmergencySiren, 
    stopEmergencySiren 
  } = useSafety();
  
  const navigate = useNavigate();

  // Find active critical alert
  const criticalAlert = alerts.find(a => a.severity === 'critical' && a.status !== 'resolved');

  if (!criticalAlert) return null;

  const isAcknowledged = criticalAlert.status === 'acknowledged';

  return (
    <div className="relative overflow-hidden rounded-xl border border-red-300 dark:border-red-800/80 bg-gradient-to-r from-red-600/10 via-red-500/5 to-transparent p-4 sm:p-5 shadow-sm dark:bg-navy-900/90">
      {/* Subtle indicator strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600 dark:bg-red-500 animate-pulse" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0 mt-0.5">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-md shadow-red-500/20 pulse-red">
              <AlertOctagon className="w-6 h-6 animate-pulse-subtle" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-black uppercase tracking-wider rounded bg-red-600 text-white flex items-center gap-1">
                <Siren className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                CRITICAL SAFETY ALERT
              </span>
              {isSirenPlaying && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-500 text-white animate-pulse flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  SIREN ACTIVE
                </span>
              )}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Logged at {criticalAlert.timestamp}
              </span>
              {isAcknowledged && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Acknowledged by {criticalAlert.acknowledgedBy || 'Supervisor'}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
              {criticalAlert.alertType} &bull; <span className="text-red-600 dark:text-red-400">EVACUATE IMMEDIATELY</span>
            </h3>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div>
                <span className="font-semibold text-slate-400">Job:</span>{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">{criticalAlert.jobId}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-400">Location:</span>{' '}
                <span className="font-medium">{criticalAlert.location}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-400">Sensor:</span>{' '}
                <span className="font-mono font-bold text-red-600 dark:text-red-400">{criticalAlert.sensorValue}</span>{' '}
                <span className="text-xs text-slate-400">({criticalAlert.threshold})</span>
              </div>
              {criticalAlert.workerName && (
                <div>
                  <span className="font-semibold text-slate-400">Worker:</span>{' '}
                  <span className="font-medium">{criticalAlert.workerName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
          <button
            onClick={() => {
              if (isSirenPlaying) {
                stopEmergencySiren();
              } else {
                playEmergencySiren(8);
              }
            }}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors flex items-center gap-1.5"
            title={isSirenPlaying ? 'Silence Siren' : 'Sound Topside Siren'}
          >
            {isSirenPlaying ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{isSirenPlaying ? 'Silence Siren' : 'Sound Siren'}</span>
          </button>

          <button
            onClick={() => navigate('/incidents')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-navy-800 border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            View Incident
          </button>

          {!isAcknowledged ? (
            <button
              onClick={() => acknowledgeAlert(criticalAlert.id, 'Rajesh Nagar (Supervisor #04)')}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Acknowledge
            </button>
          ) : (
            <button
              disabled
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-400 border border-slate-200 dark:border-navy-700 flex items-center gap-1.5 cursor-not-allowed"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Acknowledged
            </button>
          )}

          <button
            onClick={() => {
              if (onOpenEmergencyProtocol) {
                onOpenEmergencyProtocol();
              } else {
                navigate(`/jobs/${criticalAlert.jobId}`);
              }
            }}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-red-600/20"
          >
            <ShieldAlert className="w-4 h-4" />
            Emergency Protocol
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
