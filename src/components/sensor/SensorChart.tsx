import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { MOCK_HISTORICAL_SENSOR_DATA } from '../../data/mockData';
import { Wind, Flame, Activity, Thermometer, Clock, ShieldAlert } from 'lucide-react';

interface SensorChartProps {
  initialTimeFrame?: '1H' | '6H' | '24H';
  initialGas?: 'h2s' | 'ch4' | 'o2' | 'temperature';
  compact?: boolean;
}

export const SensorChart: React.FC<SensorChartProps> = ({
  initialTimeFrame = '1H',
  initialGas = 'h2s',
  compact = false,
}) => {
  const [timeRange, setTimeRange] = useState<'1H' | '6H' | '24H'>(initialTimeFrame);
  const [selectedMetric, setSelectedMetric] = useState<'h2s' | 'ch4' | 'o2' | 'temperature'>(initialGas);

  const data = MOCK_HISTORICAL_SENSOR_DATA[timeRange];

  const metricConfig = {
    h2s: {
      name: 'Hydrogen Sulfide (H₂S)',
      short: 'H₂S',
      unit: 'ppm',
      stroke: '#EF4444',
      fill: 'rgba(239, 68, 68, 0.15)',
      warningThreshold: 5.0,
      criticalThreshold: 10.0,
      icon: Wind,
      maxDomain: 40,
    },
    ch4: {
      name: 'Methane LEL (CH₄)',
      short: 'CH₄',
      unit: '%',
      stroke: '#F59E0B',
      fill: 'rgba(245, 158, 11, 0.15)',
      warningThreshold: 0.5,
      criticalThreshold: 1.0,
      icon: Flame,
      maxDomain: 1.5,
    },
    o2: {
      name: 'Oxygen Volume (O₂)',
      short: 'O₂',
      unit: '%',
      stroke: '#10B981',
      fill: 'rgba(16, 185, 129, 0.15)',
      warningThreshold: 19.5,
      criticalThreshold: 18.0,
      icon: Activity,
      maxDomain: 25,
    },
    temperature: {
      name: 'Chamber Temperature',
      short: 'Temp',
      unit: '°C',
      stroke: '#3B82F6',
      fill: 'rgba(59, 130, 246, 0.15)',
      warningThreshold: 35.0,
      criticalThreshold: 40.0,
      icon: Thermometer,
      maxDomain: 50,
    },
  }[selectedMetric];

  const Icon = metricConfig.icon;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const isCritical =
        selectedMetric === 'o2'
          ? val < metricConfig.criticalThreshold
          : val >= metricConfig.criticalThreshold;
      const isWarning =
        selectedMetric === 'o2'
          ? val < metricConfig.warningThreshold
          : val >= metricConfig.warningThreshold;

      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs">
          <div className="text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            {label}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-bold text-white text-base font-mono">{val}</span>
            <span className="text-slate-400 font-semibold">{metricConfig.unit}</span>
          </div>
          <div className="mt-1 pt-1 border-t border-slate-800">
            {isCritical ? (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                CRITICAL THRESHOLD BREACH
              </span>
            ) : isWarning ? (
              <span className="text-amber-400 font-semibold">Caution Warning Level</span>
            ) : (
              <span className="text-emerald-400 font-medium">Safe Operational Zone</span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl p-5 shadow-sm">
      {/* Header with Title, Gas selector, and Timeframe tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-navy-800 text-blue-600 dark:text-blue-400">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Environmental Sensor Trends
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Subterranean atmospheric gas fluctuation & telemetry history
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-800 p-1 rounded-lg self-start sm:self-auto">
          {(['1H', '6H', '24H'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                timeRange === t
                  ? 'bg-white dark:bg-navy-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gas metric selector tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-3 pb-4">
        {[
          { id: 'h2s', label: 'H₂S (Toxic)', icon: Wind, color: 'text-red-500' },
          { id: 'ch4', label: 'CH₄ (Methane)', icon: Flame, color: 'text-amber-500' },
          { id: 'o2', label: 'O₂ (Oxygen)', icon: Activity, color: 'text-emerald-500' },
          { id: 'temperature', label: 'Temperature', icon: Thermometer, color: 'text-blue-500' },
        ].map(metric => {
          const isSelected = selectedMetric === metric.id;
          const MIcon = metric.icon;
          return (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-navy-700 dark:text-white border-transparent shadow-sm'
                  : 'bg-slate-50 dark:bg-navy-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-800'
              }`}
            >
              <MIcon className={`w-3.5 h-3.5 ${metric.color}`} />
              <span>{metric.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recharts Chart Canvas */}
      <div className={compact ? 'h-48' : 'h-64 sm:h-72'} style={{ width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sensorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricConfig.stroke} stopOpacity={0.4} />
                <stop offset="95%" stopColor={metricConfig.stroke} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#475569', opacity: 0.2 }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#475569', opacity: 0.2 }}
              domain={[0, 'auto']}
              unit={metricConfig.unit === '%' ? '%' : ''}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Threshold Reference Line */}
            {selectedMetric === 'h2s' && (
              <ReferenceLine
                y={10}
                stroke="#DC2626"
                strokeDasharray="4 4"
                label={{ value: 'Critical Limit 10 ppm', fill: '#EF4444', fontSize: 10, position: 'insideTopRight' }}
              />
            )}
            {selectedMetric === 'o2' && (
              <ReferenceLine
                y={19.5}
                stroke="#D97706"
                strokeDasharray="4 4"
                label={{ value: 'Safe O2 Minimum 19.5%', fill: '#F59E0B', fontSize: 10, position: 'insideBottomRight' }}
              />
            )}

            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={metricConfig.stroke}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#sensorGradient)"
              dot={{ r: 3, fill: metricConfig.stroke, strokeWidth: 1, stroke: '#FFFFFF' }}
              activeDot={{ r: 6, fill: metricConfig.stroke, strokeWidth: 2, stroke: '#FFFFFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: metricConfig.stroke }} />
            {metricConfig.name}
          </span>
          <span className="text-slate-400">
            Threshold: Safe &le; {metricConfig.warningThreshold} {metricConfig.unit}
          </span>
        </div>
        <span className="font-mono text-slate-400">Sampling Rate: 1.0 Hz (Edge LoRa Sync)</span>
      </div>
    </div>
  );
};
