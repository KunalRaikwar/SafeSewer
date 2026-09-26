import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { IoTDevice } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Cpu, 
  Battery, 
  Wifi, 
  Radio, 
  RefreshCw, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  Signal,
  Wind
} from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const { devices, calibrateDevice, pingDevice, workers } = useSafety();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');

  const filteredDevices = devices.filter(dev => {
    const matchesSearch =
      dev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.assignedWorkerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.assignedJobId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || dev.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              Hardware Fleet Telemetry
            </span>
            <span className="text-xs text-slate-500">
              Total SafeSewer Edge Mk IV Nodes: <span className="font-bold text-slate-900 dark:text-white">{devices.length}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
            IoT Edge Sensor Nodes (ESP32 Multi-Gas)
          </h2>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Node ID (e.g. ESP32-001), worker or job..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1">
          {(['all', 'online', 'offline'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDevices.map(device => {
          const assignedWorker = workers.find(w => w.id === device.assignedWorkerId);

          return (
            <div
              key={device.id}
              className="p-5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-navy-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-navy-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-navy-700">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                        {device.id}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{device.name}</p>
                    </div>
                  </div>
                  <StatusBadge status={device.status} size="sm" />
                </div>

                {/* Battery & Signal Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Battery Pack</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Battery className={`w-4 h-4 ${device.battery < 25 ? 'text-red-500' : 'text-emerald-500'}`} />
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{device.battery}%</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Signal & Protocol</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Signal className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {device.networkType} ({device.signalRssi} dBm)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assignment Info */}
                <div className="mt-3.5 space-y-2 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-slate-100 dark:border-navy-800">
                    <span className="text-slate-500">Assigned Specialist:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {assignedWorker ? `${assignedWorker.name} (${assignedWorker.id})` : 'Standby / Unassigned'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-100 dark:border-navy-800">
                    <span className="text-slate-500">Current Job Code:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{device.assignedJobId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Firmware:</span>
                    <span className="font-mono text-slate-400">{device.firmwareVersion}</span>
                  </div>
                </div>

                {/* Multi-Gas Sensor Health Badges */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                    Sensors Health Status
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 dark:bg-navy-850">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>H₂S: {device.sensorsHealth.h2s}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 dark:bg-navy-850">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>CH₄: {device.sensorsHealth.ch4}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 dark:bg-navy-850">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>O₂: {device.sensorsHealth.o2}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 dark:bg-navy-850">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>IMU Motion: {device.sensorsHealth.imu}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Simulation Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-navy-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => pingDevice(device.id)}
                  className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-blue-500" />
                  Ping Node
                </button>
                <button
                  onClick={() => calibrateDevice(device.id)}
                  className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center justify-center gap-1 transition-colors border border-blue-200 dark:border-blue-800/80"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Calibrate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
