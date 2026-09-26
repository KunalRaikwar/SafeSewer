import React from 'react';
import { Flame, Wind, Activity, Thermometer, Navigation, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface SensorCardProps {
  type: 'h2s' | 'ch4' | 'o2' | 'temperature' | 'motion' | 'gps' | 'battery';
  value: string | number;
  unit?: string;
  status: 'safe' | 'warning' | 'critical' | 'offline';
  subtitle?: string;
  trend?: string;
  threshold?: string;
  compact?: boolean;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  type,
  value,
  unit,
  status,
  subtitle,
  threshold,
  compact = false,
}) => {
  const configs = {
    h2s: {
      label: 'H₂S (Hydrogen Sulfide)',
      sub: 'Toxic Sewer Gas',
      icon: Wind,
      color: status === 'critical' ? 'text-red-500' : status === 'warning' ? 'text-amber-500' : 'text-emerald-500',
      safeRange: '< 5.0 ppm',
    },
    ch4: {
      label: 'CH₄ (Methane LEL)',
      sub: 'Explosive Gas Level',
      icon: Flame,
      color: status === 'critical' ? 'text-red-500' : status === 'warning' ? 'text-amber-500' : 'text-emerald-500',
      safeRange: '< 0.5%',
    },
    o2: {
      label: 'O₂ (Atmospheric Oxygen)',
      sub: 'Respiration Volume',
      icon: Activity,
      color: status === 'critical' ? 'text-red-500' : status === 'warning' ? 'text-amber-500' : 'text-emerald-500',
      safeRange: '19.5% - 23.5%',
    },
    temperature: {
      label: 'Chamber Temperature',
      sub: 'Subterranean Heat',
      icon: Thermometer,
      color: status === 'critical' ? 'text-red-500' : status === 'warning' ? 'text-amber-500' : 'text-blue-500',
      safeRange: '< 35°C',
    },
    motion: {
      label: 'Worker Motion / Inactivity',
      sub: 'IMU 6-Axis Telemetry',
      icon: Zap,
      color: status === 'warning' || status === 'critical' ? 'text-amber-500' : 'text-emerald-500',
      safeRange: 'Active Kinematics',
    },
    gps: {
      label: 'GPS / Mesh Signal',
      sub: 'Position Lock',
      icon: Navigation,
      color: status === 'offline' ? 'text-slate-400' : 'text-blue-500',
      safeRange: '3D Sat Lock',
    },
    battery: {
      label: 'Node Battery',
      sub: 'Edge Pack Voltage',
      icon: Zap,
      color: status === 'warning' ? 'text-amber-500' : 'text-emerald-500',
      safeRange: '> 20%',
    },
  }[type];

  const Icon = configs.icon;

  const borderColor = {
    safe: 'border-slate-200 dark:border-navy-800 hover:border-emerald-300 dark:hover:border-emerald-800/60',
    warning: 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/20',
    critical: 'border-red-400 dark:border-red-800/80 bg-red-50/30 dark:bg-red-950/30 ring-1 ring-red-400/40',
    offline: 'border-slate-200 dark:border-navy-800 opacity-70',
  }[status];

  if (compact) {
    return (
      <div className={`p-3.5 bg-white dark:bg-navy-900 border rounded-xl flex items-center justify-between ${borderColor}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-100 dark:bg-navy-800 ${configs.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{configs.label}</div>
            <div className="text-base font-bold font-display text-slate-900 dark:text-white">
              {value} {unit && <span className="text-xs font-normal text-slate-500">{unit}</span>}
            </div>
          </div>
        </div>
        <StatusBadge status={status} size="sm" />
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white dark:bg-navy-900 border rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between ${borderColor}`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className={`p-2 rounded-lg bg-slate-50 dark:bg-navy-800/80 ${configs.color} flex-shrink-0 shadow-sm`}>
            <Icon className="w-4 h-4" />
          </div>
          <StatusBadge status={status} size="sm" pulse={status === 'critical'} />
        </div>

        <div className="min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate" title={configs.label}>
            {configs.label}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{subtitle || configs.sub}</p>
        </div>
      </div>

      {/* Value and Unit */}
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white truncate">
            {value}
          </span>
          {unit && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{unit}</span>}
        </div>

        {/* Limit Subtitle Row */}
        <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
          <span>Limit</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
            {threshold || configs.safeRange}
          </span>
        </div>
      </div>

      {/* Visual threshold progress bar for gases */}
      {(type === 'h2s' || type === 'ch4' || type === 'o2') && (
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-navy-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === 'critical'
                ? 'bg-red-500 w-[92%]'
                : status === 'warning'
                ? 'bg-amber-500 w-[60%]'
                : 'bg-emerald-500 w-[24%]'
            }`}
          />
        </div>
      )}
    </div>
  );
};
