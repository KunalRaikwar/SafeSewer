import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSafety();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
          critical: <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />,
          info: <Info className="w-5 h-5 text-blue-500" />,
        }[toast.type];

        const borderClass = {
          success: 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-navy-900',
          warning: 'border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-navy-900',
          critical: 'border-red-400 dark:border-red-800 bg-red-50/90 dark:bg-navy-900 shadow-red-500/20',
          info: 'border-blue-200 dark:border-blue-800 bg-white dark:bg-navy-900',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 transition-all animate-in slide-in-from-bottom-5 duration-200 ${borderClass}`}
          >
            <div className="flex-shrink-0 mt-0.5">{icons}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white">
                  {toast.title}
                </h4>
                <span className="text-[10px] text-slate-400">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
