import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from '../common/Toast';
import { useSafety } from '../../context/SafetyContext';
import { 
  Shield, 
  Wifi, 
  Battery, 
  ArrowLeft, 
  Radio, 
  Sun, 
  Moon, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const WorkerLayout: React.FC = () => {
  const { theme, toggleTheme, demoMode, setDemoMode, simulateGasSpike, simulateNormalizeConditions } = useSafety();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center sm:p-4 transition-colors">
      {/* Mobile Device Frame Container */}
      <div className="w-full sm:max-w-md min-h-screen sm:min-h-[844px] bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 sm:rounded-[36px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Android / Wearable Top Status Bar */}
        <div className="bg-slate-900 text-slate-400 px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-mono border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold">10:31</span>
            <span className="text-[10px] px-1 bg-emerald-500/20 text-emerald-400 rounded">ESP32-MESH</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-emerald-400 font-bold">4G LTE</span>
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-slate-300">88%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Worker App Header */}
        <header className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
                  SafeSewer
                </span>
                <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono rounded font-bold">
                  WORKER HUD
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Suresh Yadav &bull; Node Alpha-3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-blue-600 dark:text-blue-400 transition-colors"
              title="Switch back to Supervisor Command Center"
            >
              Command Hub &rarr;
            </button>
          </div>
        </header>

        {/* Main Worker Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 p-4 space-y-4">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />

        {/* Floating Simulation Helper inside Mobile view */}
        <div className="absolute bottom-16 right-3 z-30 flex items-center gap-1">
          <button
            onClick={() => simulateGasSpike()}
            className="p-2 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 text-[10px] font-bold hover:scale-105 active:scale-95 transition-all"
            title="Simulate Toxic Spike"
          >
            Spike!
          </button>
          <button
            onClick={() => simulateNormalizeConditions()}
            className="p-2 rounded-full bg-emerald-600 text-white shadow-lg text-[10px] font-bold hover:scale-105 active:scale-95 transition-all"
            title="Normalize Gas"
          >
            Flush
          </button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};
