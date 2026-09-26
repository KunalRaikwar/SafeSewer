import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  User, 
  Award, 
  Phone, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  LogOut,
  MapPin,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkerProfilePage: React.FC = () => {
  const { workers, jobs } = useSafety();
  const navigate = useNavigate();

  const worker = workers.find(w => w.id === 'W103') || workers[0];
  const job = jobs.find(j => j.id === worker.currentJobId) || jobs[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/worker')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Worker Digital Identity Badge
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">UID: {worker.id}</span>
        </div>
      </div>

      {/* Main Digital ID Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-navy-900 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-display font-black text-xl border border-white/20">
              {worker.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-base font-extrabold">{worker.name}</h3>
              <p className="text-xs text-blue-200">{worker.role}</p>
              <span className="text-[10px] font-mono text-blue-300 block mt-0.5">IMC Confined Space Reg #9942</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-blue-200 block">Safety Score</span>
            <span className="text-2xl font-black font-display text-emerald-300">{worker.safetyScore}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/15 text-xs text-blue-100">
          <div>
            <span className="text-[10px] text-blue-300 block">Assigned Edge Node</span>
            <span className="font-mono font-bold text-white">{worker.assignedDeviceId}</span>
          </div>
          <div>
            <span className="text-[10px] text-blue-300 block">Shift Check-in</span>
            <span className="font-medium text-white">{worker.shiftStart} Today</span>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-2 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 block">
          Primary Emergency Kin Contact
        </span>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              {worker.emergencyContact.name} ({worker.emergencyContact.relation})
            </span>
            <span className="text-slate-500">{worker.emergencyContact.phone}</span>
          </div>
          <a
            href={`tel:${worker.emergencyContact.phone}`}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            Call Kin
          </a>
        </div>
      </div>

      {/* Safety Certifications */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          Verified Safety Credentials
        </h4>
        <div className="space-y-1.5">
          {worker.certifications.map((cert, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 text-xs text-slate-800 dark:text-slate-200 font-medium flex items-center justify-between"
            >
              <span>{cert}</span>
              <span className="text-emerald-500 font-bold text-[11px]">VERIFIED</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exit to Login / Sign Out */}
      <button
        onClick={() => navigate('/login')}
        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Exit Worker Session</span>
      </button>
    </div>
  );
};
