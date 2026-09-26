import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { 
  Settings, 
  Sliders, 
  ShieldAlert, 
  PhoneCall, 
  Radio, 
  Bell, 
  Save, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { addToast } = useSafety();

  const [h2sWarning, setH2sWarning] = useState('5.0');
  const [h2sCritical, setH2sCritical] = useState('10.0');
  const [ch4Warning, setCh4Warning] = useState('0.5');
  const [ch4Critical, setCh4Critical] = useState('1.0');
  const [o2Min, setO2Min] = useState('19.5');
  const [tempMax, setTempMax] = useState('38.0');

  const [rescuePhone, setRescuePhone] = useState('+91 731 2541100');
  const [policePhone, setPolicePhone] = useState('+91 731 2542200');
  const [hospitalPhone, setHospitalPhone] = useState('+91 731 2543300');

  const [autoSiren, setAutoSiren] = useState(true);
  const [autoEvacuate, setAutoEvacuate] = useState(true);
  const [loraSyncInterval, setLoraSyncInterval] = useState('1.0');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Thresholds Updated', 'Subterranean gas safety thresholds and alert parameters committed to Edge Mesh.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              System Parameters
            </span>
            <span className="text-xs text-slate-500">
              Firmware Standard: SafeSewer Core v2.4.1
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight mt-1">
            Safety Thresholds & Emergency Parameters
          </h2>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gas Alarm Thresholds */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-navy-800">
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Multi-Gas Alert Thresholds
              </h3>
              <p className="text-xs text-slate-500">
                Trigger caution warnings and automatic top-side extraction sirens
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* H2S */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-800 dark:text-slate-200 block">
                H₂S (Hydrogen Sulfide)
              </span>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Warning Level (PPM)</label>
                <input
                  type="number"
                  step="0.1"
                  value={h2sWarning}
                  onChange={e => setH2sWarning(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Critical Evacuation Cutoff (PPM)</label>
                <input
                  type="number"
                  step="0.1"
                  value={h2sCritical}
                  onChange={e => setH2sCritical(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/30 text-xs font-mono font-bold text-red-600"
                />
              </div>
            </div>

            {/* CH4 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-800 dark:text-slate-200 block">
                CH₄ (Methane LEL)
              </span>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Warning Level (% LEL)</label>
                <input
                  type="number"
                  step="0.05"
                  value={ch4Warning}
                  onChange={e => setCh4Warning(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Critical Flammable Cutoff (% LEL)</label>
                <input
                  type="number"
                  step="0.05"
                  value={ch4Critical}
                  onChange={e => setCh4Critical(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/30 text-xs font-mono font-bold text-amber-600"
                />
              </div>
            </div>

            {/* O2 & Temperature */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-800 dark:text-slate-200 block">
                Oxygen & Thermal Limits
              </span>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Minimum Safe Oxygen (% Vol)</label>
                <input
                  type="number"
                  step="0.1"
                  value={o2Min}
                  onChange={e => setO2Min(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Maximum Temperature (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tempMax}
                  onChange={e => setTempMax(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Response Contacts */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-navy-800">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-navy-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-navy-700">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Emergency Dispatch Directory
              </h3>
              <p className="text-xs text-slate-500">
                Automated SOS hotlines for Indore Municipal Quick Response Units
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Municipal Quick Response Rescue Cell
              </label>
              <input
                type="text"
                value={rescuePhone}
                onChange={e => setRescuePhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-xs font-mono font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Indore Fire & Hazmat Division
              </label>
              <input
                type="text"
                value={policePhone}
                onChange={e => setPolicePhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-xs font-mono font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                MY Hospital Trauma Center
              </label>
              <input
                type="text"
                value={hospitalPhone}
                onChange={e => setHospitalPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-xs font-mono font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Automation & Protocols */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Autonomous Safety Protocol Triggers
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-navy-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Acoustic Topside Siren & Strobe Trigger
                </span>
                <span className="text-[11px] text-slate-500">
                  Fire 110dB street-level siren when H₂S &gt; 10 ppm or SOS panic triggered
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoSiren}
                onChange={e => setAutoSiren(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-navy-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Automated Tripod Winch Lock & Evac Notice
                </span>
                <span className="text-[11px] text-slate-500">
                  Transmit audible vibration buzzer to worker wearable HUD within 500ms
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoEvacuate}
                onChange={e => setAutoEvacuate(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
