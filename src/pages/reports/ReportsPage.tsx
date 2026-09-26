import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { MOCK_REPORT_METRICS, MOCK_HISTORICAL_SENSOR_DATA } from '../../data/mockData';
import { ExportModal } from '../../components/common/ExportModal';
import { 
  FileBarChart2, 
  Download, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Brain, 
  Building2,
  Sparkles
} from 'lucide-react';

const INCIDENTS_OVER_TIME = [
  { month: 'Apr', incidents: 6, gasSpikes: 14 },
  { month: 'May', incidents: 4, gasSpikes: 11 },
  { month: 'Jun', incidents: 7, gasSpikes: 18 },
  { month: 'Jul', incidents: 3, gasSpikes: 9 },
  { month: 'Aug', incidents: 2, gasSpikes: 7 },
  { month: 'Sep (MTD)', incidents: 1, gasSpikes: 4 },
];

const ALERT_DISTRIBUTION = [
  { name: 'H₂S Toxic Gas Spikes', value: 48, color: '#EF4444' },
  { name: 'Oxygen Deficiency (<19.5%)', value: 24, color: '#3B82F6' },
  { name: 'Methane LEL Pre-ignition', value: 16, color: '#F59E0B' },
  { name: 'Motion / Inactivity Alert', value: 8, color: '#10B981' },
  { name: 'PPE Mask Dislodged', value: 4, color: '#8B5CF6' },
];

const WORKER_SAFETY_DISTRIBUTION = [
  { range: '90 - 100% (Exemplary)', count: 5, fill: '#10B981' },
  { range: '75 - 89% (Compliant)', count: 2, fill: '#F59E0B' },
  { range: '< 75% (Intervention)', count: 1, fill: '#EF4444' },
];

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'Last 7 Days' | 'Last 30 Days' | 'Year to Date'>('Last 30 Days');
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header and Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              Governance & Compliance
            </span>
            <span className="text-xs text-slate-500">
              Audit Standard: <span className="font-semibold text-slate-900 dark:text-white">OSHA 1910.146 / BIS Subterranean</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
            Safety Analytics & Compliance Reports
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date range picker */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value as any)}
              className="bg-transparent text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Year to Date">Year to Date (2026)</option>
            </select>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            Export Safety Dossier
          </button>
        </div>
      </div>

      {/* High-level KPIs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Jobs Done</span>
          <span className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1 block">
            {MOCK_REPORT_METRICS.totalJobsCompleted}
          </span>
          <span className="text-[11px] text-emerald-500 font-semibold mt-0.5 block">+12% vs last month</span>
        </div>

        <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Man-Hours Below</span>
          <span className="text-2xl font-bold font-display text-blue-600 dark:text-blue-400 mt-1 block">
            {MOCK_REPORT_METRICS.totalManHoursUnderground}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Zero permanent harm</span>
        </div>

        <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Incidents Averted</span>
          <span className="text-2xl font-bold font-display text-emerald-500 mt-1 block">
            {MOCK_REPORT_METRICS.criticalAlertsPrevented}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Pre-emptive alarms</span>
        </div>

        <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Rescue Dispatch</span>
          <span className="text-2xl font-bold font-display text-amber-500 font-mono mt-1 block">
            {MOCK_REPORT_METRICS.averageResponseTimeSeconds}s
          </span>
          <span className="text-[11px] text-emerald-500 font-semibold mt-0.5 block">-8s faster</span>
        </div>

        <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Safety Compliance</span>
          <span className="text-2xl font-bold font-display text-slate-900 dark:text-white font-mono mt-1 block">
            {MOCK_REPORT_METRICS.safetyCompliancePercentage}%
          </span>
          <span className="text-[11px] text-emerald-500 font-semibold mt-0.5 block">Audit passed</span>
        </div>

        <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">IoT Mesh Uptime</span>
          <span className="text-2xl font-bold font-display text-emerald-500 font-mono mt-1 block">
            {MOCK_REPORT_METRICS.deviceUptimePercentage}%
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">ESP32 LoRa nodes</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incidents Over Time Bar Chart (Col 8) */}
        <div className="lg:col-span-8 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Subterranean Incidents & Gas Spikes Trend
              </h3>
              <p className="text-xs text-slate-500">6-Month historical frequency following SafeSewer edge deployment</p>
            </div>
          </div>

          <div className="h-64" style={{ width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INCIDENTS_OVER_TIME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#FFF',
                  }}
                />
                <Bar dataKey="gasSpikes" name="Gas Threshold Spikes" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incidents" name="Full Evacuations Triggered" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Distribution Donut (Col 4) */}
        <div className="lg:col-span-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Alert Trigger Breakdown
            </h3>
            <p className="text-xs text-slate-500">Classification of atmospheric alarms</p>

            <div className="h-44 mt-2" style={{ width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ALERT_DISTRIBUTION}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ALERT_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            {ALERT_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-bold font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Municipal Zone Performance Table */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Indore Municipal Corporation &bull; Zone Safety Index
            </h3>
            <p className="text-xs text-slate-500">Chamber risk levels by administrative sector</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {MOCK_REPORT_METRICS.indoreMunicipalZoneStats.map(zone => (
            <div
              key={zone.zone}
              className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 space-y-2"
            >
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {zone.zone}
              </h4>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-500">Completed Jobs:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{zone.jobs}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-500">Risk Score:</span>
                <span className={`font-bold font-mono ${zone.riskScore > 70 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {zone.riskScore}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};
