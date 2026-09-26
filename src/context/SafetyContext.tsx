import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Worker, Job, IoTDevice, SafetyAlert, Incident, AISafetyInsight, UserRole } from '../types';
import { 
  INITIAL_WORKERS, 
  INITIAL_JOBS, 
  INITIAL_DEVICES, 
  INITIAL_ALERTS, 
  INITIAL_INCIDENTS, 
  MOCK_AI_INSIGHTS 
} from '../data/mockData';
import { soundAlert } from '../utils/audioAlert';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface SafetyContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  
  // Audio Siren Controls
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  isSirenPlaying: boolean;
  playEmergencySiren: (seconds?: number) => void;
  stopEmergencySiren: () => void;

  // Entities
  workers: Worker[];
  jobs: Job[];
  devices: IoTDevice[];
  alerts: SafetyAlert[];
  incidents: Incident[];
  aiInsights: AISafetyInsight;
  
  // Selection
  selectedWorker: Worker | null;
  setSelectedWorker: (worker: Worker | null) => void;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  
  // Actions
  acknowledgeAlert: (alertId: string, officerName?: string) => void;
  resolveAlert: (alertId: string) => void;
  createJob: (newJob: Omit<Job, 'id' | 'status' | 'operationalStatus' | 'sensorSummary' | 'recentAlertCount'>) => Job;
  triggerEmergencySos: (workerId: string, details?: string) => void;
  resolveEmergencySos: () => void;
  sosActive: boolean;
  sosDetails: { workerId: string; workerName: string; location: string; timestamp: string } | null;
  
  // Simulations
  simulateGasSpike: () => void;
  simulateNormalizeConditions: () => void;
  calibrateDevice: (deviceId: string) => void;
  pingDevice: (deviceId: string) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Statistics
  kpis: {
    activeJobs: number;
    safeWorkers: number;
    warningWorkers: number;
    criticalWorkers: number;
    totalIncidents: number;
    averageSafetyScore: number;
  };
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentRole, setCurrentRole] = useState<UserRole>('supervisor');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);

  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [devices, setDevices] = useState<IoTDevice[]>(INITIAL_DEVICES);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(INITIAL_ALERTS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [aiInsights, setAiInsights] = useState<AISafetyInsight>(MOCK_AI_INSIGHTS);

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [sosDetails, setSosDetails] = useState<{ workerId: string; workerName: string; location: string; timestamp: string } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleAudioMute = () => {
    setIsAudioMuted(prev => {
      const next = !prev;
      soundAlert.setMuted(next);
      return next;
    });
  };

  const playEmergencySiren = useCallback((seconds: number = 8) => {
    setIsSirenPlaying(true);
    soundAlert.playSiren(seconds);
    setTimeout(() => {
      setIsSirenPlaying(false);
    }, seconds * 1000);
  }, []);

  const stopEmergencySiren = useCallback(() => {
    setIsSirenPlaying(false);
    soundAlert.stopSiren();
  }, []);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-4), { id, type, title, message, timestamp: new Date().toLocaleTimeString() }]);
    
    if (type === 'critical') {
      playEmergencySiren(6);
    } else if (type === 'warning') {
      soundAlert.playWarningBeep();
    } else if (type === 'success') {
      soundAlert.playSuccessTone();
    }

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, [playEmergencySiren]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Demo mode periodic sensor ticker
  useEffect(() => {
    if (!demoMode) return;

    const interval = setInterval(() => {
      setJobs(prevJobs =>
        prevJobs.map(job => {
          if (job.operationalStatus !== 'active') return job;

          const isCritical = job.status === 'critical';
          const isWarning = job.status === 'warning';

          const h2sBase = isCritical ? 31.0 : isWarning ? 6.5 : 1.5;
          const h2sDelta = (Math.random() - 0.48) * 0.8;
          const newH2S = Math.max(0.2, Number((h2sBase + h2sDelta).toFixed(1)));

          const ch4Delta = (Math.random() - 0.5) * 0.04;
          const newCH4 = Math.max(0.05, Number((job.sensorSummary.ch4 + ch4Delta).toFixed(2)));

          const o2Base = isCritical ? 17.8 : isWarning ? 19.4 : 20.8;
          const o2Delta = (Math.random() - 0.5) * 0.1;
          const newO2 = Math.min(21.4, Math.max(16.5, Number((o2Base + o2Delta).toFixed(1))));

          const tempDelta = (Math.random() - 0.5) * 0.2;
          const newTemp = Number((job.sensorSummary.temperature + tempDelta).toFixed(1));

          return {
            ...job,
            sensorSummary: {
              ...job.sensorSummary,
              h2s: newH2S,
              ch4: newCH4,
              o2: newO2,
              temperature: newTemp,
              lastUpdated: 'Just now',
            },
          };
        })
      );

      setWorkers(prevWorkers =>
        prevWorkers.map(w => {
          const hrDelta = Math.floor((Math.random() - 0.5) * 4);
          const baseHr = w.status === 'critical' ? 112 : w.status === 'warning' ? 88 : 74;
          return {
            ...w,
            heartRate: Math.max(60, Math.min(135, baseHr + hrDelta)),
            lastUpdate: 'Just now',
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [demoMode]);

  // Alert actions
  const acknowledgeAlert = (alertId: string, officerName = 'Command Center Supervisor') => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              status: 'acknowledged',
              acknowledgedBy: officerName,
            }
          : a
      )
    );
    stopEmergencySiren();
    addToast('info', 'Alert Acknowledged', `Alert #${alertId} acknowledged by ${officerName}. Siren muted.`);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              status: 'resolved',
              resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : a
      )
    );
    stopEmergencySiren();
    addToast('success', 'Alert Resolved', `Alert #${alertId} marked as resolved. Safe thresholds restored.`);
  };

  // Create Job
  const createJob = (newJobData: Omit<Job, 'id' | 'status' | 'operationalStatus' | 'sensorSummary' | 'recentAlertCount'>): Job => {
    const newId = `SS-${130 + jobs.length + 1}`;
    const newJob: Job = {
      ...newJobData,
      id: newId,
      status: 'safe',
      operationalStatus: 'active',
      recentAlertCount: 0,
      sensorSummary: {
        h2s: 1.1,
        ch4: 0.12,
        o2: 20.9,
        temperature: 29.0,
        motion: true,
        gpsSignal: 'locked',
        batteryLevel: 98,
        lastUpdated: 'Just now',
      },
    };

    setJobs(prev => [newJob, ...prev]);
    
    if (newJob.assignedWorkerIds.length > 0) {
      setWorkers(prevWorkers =>
        prevWorkers.map(w =>
          newJob.assignedWorkerIds.includes(w.id)
            ? { ...w, currentJobId: newId, currentLocation: newJob.location }
            : w
        )
      );
    }

    addToast('success', 'Safety Job Created', `Job ${newId} (${newJob.chamberNumber}) created and assigned.`);
    return newJob;
  };

  // Emergency SOS Workflow
  const triggerEmergencySos = (workerId: string, details = 'Manual Panic SOS Triggered from Confined Chamber') => {
    const worker = workers.find(w => w.id === workerId) || workers[0];
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setSosActive(true);
    setSosDetails({
      workerId: worker.id,
      workerName: worker.name,
      location: worker.currentLocation,
      timestamp,
    });

    setWorkers(prev =>
      prev.map(w => (w.id === worker.id ? { ...w, status: 'critical', heartRate: 128 } : w))
    );

    const newAlert: SafetyAlert = {
      id: `ALT-SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      alertType: 'EMERGENCY SOS PANIC BUTTON ACTIVATED',
      severity: 'critical',
      workerId: worker.id,
      workerName: worker.name,
      jobId: worker.currentJobId,
      location: worker.currentLocation,
      sensor: 'Worker Wearable Panic Trigger',
      sensorValue: 'ACTIVE SOS BEACON',
      threshold: 'Instant Emergency Trigger',
      timestamp,
      status: 'active',
      actionRequired: `IMMEDIATE RESCUE PROTOCOL - Worker ${worker.name} activated SOS. Coordinates transmitted to Quick Response Team.`,
    };

    setAlerts(prev => [newAlert, ...prev]);

    const newIncident: Incident = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: `Emergency SOS: ${worker.name} in ${worker.currentLocation}`,
      jobId: worker.currentJobId,
      workerId: worker.id,
      workerName: worker.name,
      location: worker.currentLocation,
      severity: 'critical',
      detectedAt: `${timestamp} Today`,
      responseStatus: 'evacuating',
      primaryCause: details,
      peakGasLevel: 'Emergency Beacon Broadcast Active',
      timeline: [
        {
          time: timestamp,
          title: 'SOS Panic Beacon Fired by Worker',
          description: `Worker ${worker.name} triggered high-priority SOS alert from confined depth.`,
          type: 'trigger',
          actor: `${worker.name} (${worker.id})`,
        },
        {
          time: timestamp,
          title: 'Topside Acoustic Siren Activated & Command Broadcast',
          description: 'Topside sirens (110dB) and digital console dispatched emergency flash alert.',
          type: 'alert',
          actor: 'SafeSewer Core Alert Engine',
        },
        {
          time: timestamp,
          title: 'Rescue Dispatch Team Alerted with GPS Pinpoint',
          description: `Indore Municipal Rescue Division notified for ${worker.currentLocation}.`,
          type: 'dispatch',
          actor: 'Automated Dispatch Simulation',
        }
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);
    addToast('critical', '🚨 EMERGENCY SOS TRIGGERED', `Acoustic Siren Fired for ${worker.name} at ${worker.currentLocation}!`);
  };

  const resolveEmergencySos = () => {
    setSosActive(false);
    setSosDetails(null);
    stopEmergencySiren();
    addToast('success', 'Emergency Stand Down', 'SOS emergency protocol marked resolved. Siren silenced.');
  };

  // Simulations for live presentation
  const simulateGasSpike = () => {
    setJobs(prev =>
      prev.map(j =>
        j.id === 'SS-127'
          ? {
              ...j,
              status: 'critical',
              sensorSummary: {
                ...j.sensorSummary,
                h2s: 38.6,
                o2: 17.2,
                ch4: 1.15,
                temperature: 35.8,
              },
            }
          : j
      )
    );

    setWorkers(prev =>
      prev.map(w =>
        w.id === 'W103'
          ? { ...w, status: 'critical', heartRate: 122 }
          : w.id === 'W101'
          ? { ...w, status: 'warning', heartRate: 98 }
          : w
      )
    );

    setAiInsights(prev => ({
      ...prev,
      riskScore: 94,
      riskLevel: 'CRITICAL RISK',
      summary: 'CRITICAL: Severe H2S spike (38.6 ppm) and O2 deficiency detected in Chamber #27. Evacuation mandatory.',
      anomalyDetected: true,
      calculatedAt: 'Updated just now by AI Neural Engine',
    }));

    addToast('critical', 'Simulation: Toxic Gas Spike Triggered', 'Chamber #27 H2S reached 38.6 ppm. Acoustic siren activated!');
  };

  const simulateNormalizeConditions = () => {
    setJobs(prev =>
      prev.map(j => ({
        ...j,
        status: 'safe',
        sensorSummary: {
          ...j.sensorSummary,
          h2s: 1.4,
          o2: 20.8,
          ch4: 0.15,
          temperature: 29.2,
        },
      }))
    );

    setWorkers(prev =>
      prev.map(w => ({
        ...w,
        status: 'safe',
        heartRate: 74,
      }))
    );

    setAiInsights(prev => ({
      ...prev,
      riskScore: 24,
      riskLevel: 'LOW RISK',
      summary: 'All subterranean sectors operating within normal atmospheric parameters. Air blowers optimal.',
      anomalyDetected: false,
      calculatedAt: 'Updated just now by AI Neural Engine',
    }));

    stopEmergencySiren();
    addToast('success', 'Simulation: Atmosphere Normalized', 'All confined chambers flushed to safe 20.8% O2 and < 2 ppm H2S. Siren stopped.');
  };

  const calibrateDevice = (deviceId: string) => {
    setDevices(prev =>
      prev.map(d =>
        d.id === deviceId
          ? {
              ...d,
              lastSync: 'Just now',
              sensorsHealth: {
                h2s: 'calibrated',
                ch4: 'calibrated',
                o2: 'calibrated',
                imu: 'active',
              },
            }
          : d
      )
    );
    addToast('success', 'Device Calibrated', `${deviceId} multi-gas electro-chemical sensors calibrated successfully.`);
  };

  const pingDevice = (deviceId: string) => {
    const dev = devices.find(d => d.id === deviceId);
    addToast('info', 'IoT Ping Received', `${deviceId} signal RSSI ${dev?.signalRssi || -65} dBm (${dev?.networkType || '4G LTE'}). Sync latency 42ms.`);
  };

  // KPIs
  const activeJobs = jobs.filter(j => j.operationalStatus === 'active').length;
  const safeWorkers = workers.filter(w => w.status === 'safe').length;
  const warningWorkers = workers.filter(w => w.status === 'warning').length;
  const criticalWorkers = workers.filter(w => w.status === 'critical').length;
  const totalIncidents = incidents.length;
  const averageSafetyScore = Math.round(
    workers.reduce((acc, curr) => acc + curr.safetyScore, 0) / (workers.length || 1)
  );

  return (
    <SafetyContext.Provider
      value={{
        theme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        demoMode,
        setDemoMode,
        isAudioMuted,
        toggleAudioMute,
        isSirenPlaying,
        playEmergencySiren,
        stopEmergencySiren,
        workers,
        jobs,
        devices,
        alerts,
        incidents,
        aiInsights,
        selectedWorker,
        setSelectedWorker,
        selectedJob,
        setSelectedJob,
        acknowledgeAlert,
        resolveAlert,
        createJob,
        triggerEmergencySos,
        resolveEmergencySos,
        sosActive,
        sosDetails,
        simulateGasSpike,
        simulateNormalizeConditions,
        calibrateDevice,
        pingDevice,
        toasts,
        addToast,
        removeToast,
        kpis: {
          activeJobs,
          safeWorkers,
          warningWorkers,
          criticalWorkers,
          totalIncidents,
          averageSafetyScore,
        },
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = (): SafetyContextType => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
