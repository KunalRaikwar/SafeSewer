import React, { useState } from 'react';
import { Modal } from './Modal';
import { FileText, Download, CheckCircle2, FileSpreadsheet, ShieldAlert, Sparkles, Building2 } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useSafety();
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'compliance'>('pdf');
  const [selectedScope, setSelectedScope] = useState<'all' | 'critical' | 'incidents'>('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
      addToast(
        'success',
        'Report Generated Successfully',
        `SafeSewer_${selectedFormat.toUpperCase()}_Safety_Report_${new Date().toISOString().slice(0, 10)}.pdf downloaded.`
      );
    }, 1400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Safety & Compliance Report"
      subtitle="Generate audit-ready documentation for municipal governance and OSHA/BIS safety compliance."
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Select Export Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'pdf',
                title: 'Executive PDF',
                desc: 'Visual charts, incident timelines & sign-offs',
                icon: FileText,
              },
              {
                id: 'csv',
                title: 'Telemetry CSV',
                desc: 'Raw multi-gas sensor logs & timestamps',
                icon: FileSpreadsheet,
              },
              {
                id: 'compliance',
                title: 'Municipal Audit',
                desc: 'Official Confined Space Clearance Cert',
                icon: Building2,
              },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = selectedFormat === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFormat(item.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 dark:border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-navy-700 hover:border-slate-300 dark:hover:border-navy-600 bg-slate-50/40 dark:bg-navy-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Scope & Included Data
          </label>
          <div className="space-y-2">
            {[
              { id: 'all', title: 'Full Comprehensive Operational Report (All 6 Zones)', count: '148 Jobs / 8 Workers' },
              { id: 'critical', title: 'High-Risk & Atmospheric Alarm Incidents Only', count: '12 Events' },
              { id: 'incidents', title: 'Chamber #27 H2S Evacuation Incident Timeline (INC-2026-042)', count: 'Deep Forensic Audit' },
            ].map(opt => (
              <label
                key={opt.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="exportScope"
                    checked={selectedScope === opt.id}
                    onChange={() => setSelectedScope(opt.id as any)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {opt.title}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{opt.count}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Includes AI Safety Risk score & simulated compliance stamp</span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">Verified 99.8% Uptime</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Compiling Report...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Report ({selectedFormat.toUpperCase()})
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
