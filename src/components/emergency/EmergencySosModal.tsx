import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useSafety } from '../../context/SafetyContext';
import { 
  AlertOctagon, 
  Siren, 
  Radio, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
} from 'lucide-react';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerId?: string;
  workerName?: string;
  location?: string;
  jobId?: string;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  workerId = 'W103',
  workerName = 'Suresh Yadav',
  location = 'Chamber #27, Indore (Near M.G. Road)',
  jobId = 'SS-127',
}) => {
  const { 
    triggerEmergencySos, 
    resolveEmergencySos, 
    isSirenPlaying, 
    playEmergencySiren, 
    stopEmergencySiren, 
    isAudioMuted, 
    toggleAudioMute 
  } = useSafety();

  const [step, setStep] = useState<'confirm' | 'broadcasting' | 'active'>('confirm');

  const handleTrigger = () => {
    setStep('broadcasting');
    triggerEmergencySos(workerId, `Emergency Panic Alarm Triggered at ${location}`);
    playEmergencySiren(10);

    setTimeout(() => {
      setStep('active');
    }, 1800);
  };

  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'confirm' ? 'Confirm Emergency SOS Alarm' : '🚨 SOS BROADCAST ACTIVE'}
      subtitle={
        step === 'confirm'
          ? 'Instantly broadcasts critical evacuation order to Command Center and Rescue units.'
          : 'High-priority extraction protocol dispatched to Indore Quick Response Team.'
      }
      maxWidth="lg"
    >
      {step === 'confirm' && (
        <div className="space-y-5">
          {/* Warning notice */}
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs text-red-900 dark:text-red-200 space-y-1">
              <p className="font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                Life-Safety Immediate Intervention
              </p>
              <p>
                Triggering SOS will initiate acoustic topside sirens (110dB), notify municipal supervisors, and lock topside winch extraction.
              </p>
            </div>
          </div>

          {/* Details Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-navy-800">
              <span className="text-slate-500">Worker ID & Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{workerId} &bull; {workerName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-navy-800">
              <span className="text-slate-500">Current Job Code</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{jobId}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-500">Subterranean Location</span>
              <span className="font-semibold text-right text-slate-900 dark:text-white max-w-[240px]">
                {location}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTrigger}
              className="px-6 py-2.5 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 pulse-red"
            >
              <Siren className="w-4 h-4 animate-spin" />
              TRIGGER EMERGENCY SOS
            </button>
          </div>
        </div>
      )}

      {step === 'broadcasting' && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-600/20 flex items-center justify-center animate-ping" />
            <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <Radio className="w-7 h-7 animate-pulse" />
            </div>
          </div>
          <h4 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            Broadcasting High-Priority Beacon & Sounding Siren...
          </h4>
          <p className="text-xs text-slate-500 max-w-sm">
            Transmitting 4G LTE / LoRaWAN packet to Indore Municipal Disaster Management Cell.
          </p>
        </div>
      )}

      {step === 'active' && (
        <div className="space-y-5 py-2">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-300">
              SOS ACTIVATED & ACOUSTIC SIREN FIRING
            </h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              Topside sentry, supervisor console, and quick-response team have locked coordinates.
            </p>
          </div>

          {/* Real-time Status checklist */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Supervisor Notified</span>
              </div>
              <span className="text-slate-400 font-mono">10:31:02 AM</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Indore Municipal Rescue Dispatched</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ETA: 4 Mins</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Continuous GPS & Mesh Pinpoint Shared</span>
              </div>
              <span className="text-blue-500 font-mono">22.7196° N, 75.8577° E</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-800">
            <button
              type="button"
              onClick={toggleAudioMute}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1.5 font-semibold"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />}
              {isAudioMuted ? 'Unmute Acoustic Alarm Siren' : 'Mute Acoustic Alarm Siren'}
            </button>

            <button
              type="button"
              onClick={() => {
                resolveEmergencySos();
                handleClose();
              }}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-navy-700 text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Stand Down / Resolve SOS
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
