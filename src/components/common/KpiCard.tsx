import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  colorScheme?: 'blue' | 'green' | 'amber' | 'red' | 'navy';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  trend,
  trendType = 'positive',
  icon: Icon,
  colorScheme = 'blue',
  onClick,
}) => {
  const schemeStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-100 dark:border-blue-900/40',
      borderHover: 'hover:border-blue-300 dark:hover:border-blue-700/60',
      glow: 'shadow-blue-500/5',
    },
    green: {
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40',
      borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700/60',
      glow: 'shadow-emerald-500/5',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-100 dark:border-amber-900/40',
      borderHover: 'hover:border-amber-300 dark:hover:border-amber-700/60',
      glow: 'shadow-amber-500/5',
    },
    red: {
      iconBg: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border-red-100 dark:border-red-900/40',
      borderHover: 'hover:border-red-300 dark:hover:border-red-700/60',
      glow: 'shadow-red-500/5',
    },
    navy: {
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300 border-slate-200 dark:border-navy-700',
      borderHover: 'hover:border-slate-300 dark:hover:border-navy-600',
      glow: 'shadow-slate-500/5',
    },
  }[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`relative p-4 sm:p-5 bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800/80 rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between ${schemeStyles.borderHover} ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div>
        {/* Top Title & Icon Row */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate" title={title}>
            {title}
          </p>
          <div className={`p-2 rounded-xl border shadow-sm flex-shrink-0 ${schemeStyles.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Big Value Number */}
        <div className="mt-2">
          <span className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            {value}
          </span>
        </div>
      </div>

      {(trend || subtext) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-navy-800/60 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center font-bold gap-1 ${
                trendType === 'positive'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : trendType === 'negative'
                  ? 'text-red-700 dark:text-red-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {trendType === 'positive' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : trendType === 'negative' ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : null}
              {trend}
            </span>
          )}
          {subtext && <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
