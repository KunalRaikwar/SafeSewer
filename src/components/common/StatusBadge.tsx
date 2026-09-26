import React from 'react';
import { SafetyStatus } from '../../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, WifiOff, Info } from 'lucide-react';

interface StatusBadgeProps {
  status: SafetyStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  pulse?: boolean;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  pulse = false,
  label,
  className = '',
}) => {
  const normStatus = status.toLowerCase();

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-navy-800 dark:text-slate-300 dark:border-navy-700';
  let dotClass = 'bg-slate-400';
  let icon = <WifiOff className="w-3 h-3" />;
  let defaultLabel = 'OFFLINE';

  if (normStatus === 'safe' || normStatus === 'verified' || normStatus === 'online' || normStatus === 'resolved') {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60';
    dotClass = 'bg-emerald-500';
    icon = <ShieldCheck className="w-3 h-3" />;
    defaultLabel = 'SAFE';
  } else if (normStatus === 'warning' || normStatus === 'pending' || normStatus === 'standby' || normStatus === 'acknowledged') {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60';
    dotClass = 'bg-amber-500';
    icon = <AlertTriangle className="w-3 h-3" />;
    defaultLabel = 'WARNING';
  } else if (normStatus === 'critical' || normStatus === 'failed' || normStatus === 'evacuating' || normStatus === 'active') {
    bgClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60';
    dotClass = 'bg-red-500';
    icon = <AlertOctagon className="w-3 h-3" />;
    defaultLabel = 'CRITICAL';
  } else if (normStatus === 'info' || normStatus === 'investigating') {
    bgClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60';
    dotClass = 'bg-blue-500';
    icon = <Info className="w-3 h-3" />;
    defaultLabel = 'INFO';
  }

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] font-bold gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2',
  };

  const displayText = label || defaultLabel;

  return (
    <span
      className={`inline-flex items-center flex-shrink-0 whitespace-nowrap rounded-full border tracking-wide uppercase font-sans ${sizeClasses[size]} ${bgClass} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClass}`}
          ></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotClass}`}></span>
        </span>
      )}
      {!pulse && <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />}
      {showIcon && icon}
      <span>{displayText}</span>
    </span>
  );
};
