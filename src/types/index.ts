export type SafetyStatus = 'safe' | 'warning' | 'critical' | 'offline' | 'info';

export type UserRole = 'supervisor' | 'admin' | 'worker';

export interface SensorReading {
  h2s: number;        // Hydrogen Sulfide (ppm) - Safe < 5, Warning 5-10, Critical > 10
  ch4: number;        // Methane (% LEL) - Safe < 0.5, Warning 0.5-1.0, Critical > 1.0
  o2: number;         // Oxygen (% vol) - Safe 19.5-23.5, Warning 18.0-19.4 or 23.6-24.5, Critical < 18.0 or > 24.5
  temperature: number;// Celsius - Safe < 35, Warning 35-40, Critical > 40
  motion: boolean;    // Motion detected
  gpsSignal: 'locked' | 'weak' | 'disconnected';
  batteryLevel: number; // 0 - 100%
  lastUpdated: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatarUrl?: string;
  currentJobId: string;
  currentLocation: string;
  status: SafetyStatus;
  safetyScore: number; // 0 - 100
  ppeStatus: 'verified' | 'pending' | 'failed';
  ppeConfidence?: number;
  assignedDeviceId: string;
  heartRate: number; // bpm
  shiftStart: string;
  gasExposureScore: 'low' | 'moderate' | 'high';
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  certifications: string[];
  lastUpdate: string;
}

export interface Job {
  id: string;
  title: string;
  chamberNumber: string;
  location: string;
  zone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  depthMeters: number;
  supervisorName: string;
  supervisorPhone: string;
  assignedWorkerIds: string[];
  status: SafetyStatus;
  operationalStatus: 'active' | 'scheduled' | 'completed' | 'paused';
  deviceId: string;
  startTime: string;
  estimatedEndTime: string;
  requiredPpe: string[];
  hazards: string[];
  ventilationStatus: 'operational' | 'standby' | 'alert';
  sensorSummary: SensorReading;
  recentAlertCount: number;
}

export interface IoTDevice {
  id: string; // e.g. "ESP32-001"
  name: string;
  model: string;
  firmwareVersion: string;
  assignedWorkerId: string;
  assignedJobId: string;
  status: 'online' | 'offline' | 'standby' | 'maintenance';
  battery: number;
  signalRssi: number; // dBm e.g. -65
  networkType: '4G LTE' | 'LoRaWAN' | 'Mesh RF';
  lastSync: string;
  sensorsHealth: {
    h2s: 'calibrated' | 'needs_calibration' | 'error';
    ch4: 'calibrated' | 'needs_calibration' | 'error';
    o2: 'calibrated' | 'needs_calibration' | 'error';
    imu: 'active' | 'error';
  };
}

export interface SafetyAlert {
  id: string;
  alertType: string;
  severity: 'critical' | 'warning' | 'info';
  workerId?: string;
  workerName?: string;
  jobId: string;
  location: string;
  sensor: string;
  sensorValue: string;
  threshold: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  resolvedAt?: string;
  actionRequired: string;
}

export interface IncidentTimelineEvent {
  time: string;
  title: string;
  description: string;
  type: 'trigger' | 'alert' | 'notification' | 'dispatch' | 'evacuation' | 'resolution';
  actor?: string;
}

export interface Incident {
  id: string;
  title: string;
  jobId: string;
  workerId: string;
  workerName: string;
  location: string;
  severity: 'critical' | 'warning';
  detectedAt: string;
  resolvedAt?: string;
  responseStatus: 'resolved' | 'investigating' | 'escalated' | 'evacuating';
  primaryCause: string;
  peakGasLevel: string;
  timeline: IncidentTimelineEvent[];
  evacuationTimeMinutes?: number;
}

export interface AISafetyInsight {
  id: string;
  riskScore: number;
  riskLevel: 'LOW RISK' | 'MODERATE RISK' | 'HIGH RISK' | 'CRITICAL RISK';
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  anomalyDetected: boolean;
  predictedHazard: string;
  calculatedAt: string;
}

export interface HistoricalSensorDataPoint {
  time: string;
  h2s: number;
  ch4: number;
  o2: number;
  temperature: number;
  workerExposures?: number;
}
