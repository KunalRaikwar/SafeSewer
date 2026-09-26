import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { KpiCard } from '../../components/common/KpiCard';
import { CriticalAlertBanner } from '../../components/common/CriticalAlertBanner';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { SensorCard } from '../../components/common/SensorCard';
import { SensorChart } from '../../components/sensor/SensorChart';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmergencySosModal } from '../../components/emergency/EmergencySosModal';
import { CreateJobModal } from '../../components/jobs/CreateJobModal';
import { 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Users, 
  Sparkles, 
  Cpu, 
  Plus, 
  ExternalLink, 
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { 
    kpis, 
    workers, 
    jobs, 
    aiInsights, 
    setSelectedWorker, 
    setSelectedJob,
    sosActive,
    resolveEmergencySos
  } = useSafety();

  const navigate = useNavigate();
  const [showSosModal, setShowSosModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);

  // Active highlighted job for live sensor telemetry HUD (e.g. SS-127)
  const criticalOrActiveJob = jobs.find(j => j.status === 'critical') || jobs[0];

  return (
    <div className="space-y-6">
      {/* Top Header Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              IMC Real-Time Operations
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Live Gateway Sync: <span className="font-mono text-emerald-500 font-semibold">12ms</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
            Safety Command Center
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCreateJobModal(true)}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Create Entry Job
          </button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      <CriticalAlertBanner onOpenEmergencyProtocol={() => setShowSosModal(true)} />

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Confined Jobs"
          value={kpis.activeJobs}
          trend="+8.2% from yesterday"
          trendType="positive"
          subtext="across 6 municipal zones"
          icon={Briefcase}
          colorScheme="blue"
          onClick={() => navigate('/jobs')}
        />
        <KpiCard
          title="Safe Workers Below"
          value={kpis.safeWorkers}
          trend="96.4% Compliance"
          trendType="positive"
          subtext="PPE and vitals green"
          icon={ShieldCheck}
          colorScheme="green"
          onClick={() => navigate('/workers')}
        />
        <KpiCard
          title="Caution Warnings"
          value={kpis.warningWorkers}
          trend="Elevated micro-pockets"
          trendType="neutral"
          subtext="Sector 1 & 4 monitored"
          icon={AlertTriangle}
          colorScheme="amber"
          onClick={() => navigate('/alerts')}
        />
        <KpiCard
          title="Critical Atmospheric Alerts"
          value={kpis.criticalWorkers}
          trend="Evacuation protocol active"
          trendType="negative"
          subtext="Chamber #27 H2S spike"
          icon={AlertOctagon}
          colorScheme="red"
          onClick={() => navigate('/alerts')}
        />
      </div>

      {/* Central Section: Live Map + Live Worker Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Live Interactive Map (Col 8) */}
        <div className="lg:col-span-8 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Live Subterranean GIS Map
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live telemetry markers for all Indore municipal chambers & worker wearables
              </p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Full GIS View &rarr;
            </button>
          </div>

          <InteractiveMap height="h-[380px]" />
        </div>

        {/* Live Worker Status Panel (Col 4) */}
        <div className="lg:col-span-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Live Worker Fleet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Subterranean safety & vitals
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {workers.length} On Duty
              </span>
            </div>

            {/* Worker List Rows */}
            <div className="mt-3 space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {workers.slice(0, 5).map(worker => (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-navy-800 hover:border-slate-300 dark:hover:border-navy-600 bg-slate-50/50 dark:bg-navy-950/40 hover:bg-slate-100 dark:hover:bg-navy-850 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-navy-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center font-mono">
                      {worker.id}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {worker.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                        {worker.currentJobId} &bull; {worker.currentLocation.split(',')[0]}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={worker.status} size="sm" pulse={worker.status === 'critical'} />
                    <span className="text-[10px] text-slate-400 font-mono">{worker.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/workers')}
            className="mt-3 w-full py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-200 transition-colors text-center"
          >
            View All {workers.length} Workers &rarr;
          </button>
        </div>
      </div>

      {/* Sensor Monitoring HUD (6 Sensor Cards for Chamber #27 / Active Job) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Real-Time Atmospheric Sensor Telemetry &bull;{' '}
              <span className="text-blue-600 dark:text-blue-400 font-mono">{criticalOrActiveJob.id} ({criticalOrActiveJob.chamberNumber})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Depth: {criticalOrActiveJob.depthMeters}m &bull; Location: {criticalOrActiveJob.location}
            </p>
          </div>
          <span className="text-[11px] text-emerald-500 font-mono flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LoRa Edge Stream Active (Sampling 1.0 Hz)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <SensorCard
            type="h2s"
            value={criticalOrActiveJob.sensorSummary.h2s}
            unit="ppm"
            status={
              criticalOrActiveJob.sensorSummary.h2s > 10
                ? 'critical'
                : criticalOrActiveJob.sensorSummary.h2s > 5
                ? 'warning'
                : 'safe'
            }
            threshold="< 5.0 ppm"
          />
          <SensorCard
            type="ch4"
            value={criticalOrActiveJob.sensorSummary.ch4}
            unit="%"
            status={
              criticalOrActiveJob.sensorSummary.ch4 > 1.0
                ? 'critical'
                : criticalOrActiveJob.sensorSummary.ch4 > 0.5
                ? 'warning'
                : 'safe'
            }
            threshold="< 0.5%"
          />
          <SensorCard
            type="o2"
            value={criticalOrActiveJob.sensorSummary.o2}
            unit="%"
            status={criticalOrActiveJob.sensorSummary.o2 < 19.5 ? 'critical' : 'safe'}
            threshold="19.5 - 23.5%"
          />
          <SensorCard
            type="temperature"
            value={criticalOrActiveJob.sensorSummary.temperature}
            unit="°C"
            status={criticalOrActiveJob.sensorSummary.temperature > 35 ? 'warning' : 'safe'}
            threshold="< 35°C"
          />
          <SensorCard
            type="motion"
            value={criticalOrActiveJob.sensorSummary.motion ? 'Active' : 'Stationary'}
            status={criticalOrActiveJob.sensorSummary.motion ? 'safe' : 'warning'}
            subtitle="IMU 6-Axis"
          />
          <SensorCard
            type="gps"
            value="3D Locked"
            status="safe"
            subtitle="Mesh RF Gateway"
          />
        </div>
      </div>

      {/* Sensor Trend Chart & AI Safety Intelligence Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sensor Recharts Component (Col 8) */}
        <div className="lg:col-span-8">
          <SensorChart />
        </div>

        {/* AI Safety Intelligence Panel (Col 4) */}
        <div className="lg:col-span-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    AI Safety Intelligence
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Simulated Predictive Engine</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-xs font-black rounded uppercase font-mono ${
                aiInsights.riskScore > 75
                  ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              }`}>
                {aiInsights.riskLevel}
              </span>
            </div>

            {/* Risk Score Circle / Meter */}
            <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Aggregated Risk Score
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Atmospheric + Worker fatigue index</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black font-display text-red-500">
                  {aiInsights.riskScore}
                </span>
                <span className="text-xs text-slate-400 font-mono"> / 100</span>
              </div>
            </div>

            {/* Key Insights List */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Simulated Pattern Detections
              </span>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {aiInsights.keyInsights.slice(0, 4).map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{aiInsights.calculatedAt}</span>
            <button
              onClick={() => navigate('/reports')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Full AI Audit &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EmergencySosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
        workerId="W103"
        workerName="Suresh Yadav"
        location="Chamber #27, Indore"
        jobId="SS-127"
      />

      <CreateJobModal
        isOpen={showCreateJobModal}
        onClose={() => setShowCreateJobModal(false)}
      />
    </div>
  );
};
