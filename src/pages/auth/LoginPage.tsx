import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafety } from '../../context/SafetyContext';
import { UserRole } from '../../types';
import { 
  Shield, 
  ShieldCheck, 
  Radio, 
  Flame, 
  Users, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon 
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentRole } = useSafety();

  const [email, setEmail] = useState('rajesh.nagar@indore-safesewer.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('supervisor');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (selectedRole: UserRole = role) => {
    setIsLoading(true);
    setCurrentRole(selectedRole);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'worker') {
        navigate('/worker');
      } else {
        navigate('/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Subterranean Background Accents */}
      <div className="absolute inset-0 map-dark-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Main Two-Column Container */}
      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-navy-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Left Branding Column */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-navy-950 via-navy-900 to-navy-850 border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            {/* Logo and Badges */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-display tracking-tight text-white">
                    SafeSewer
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md uppercase font-mono">
                    AI Platform
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Municipal Confined-Space Safety Ecosystem
                </span>
              </div>
            </div>

            {/* Tagline & Statement */}
            <div className="mt-8 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-white">
                "Protecting Every Worker Below the Surface."
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Combining IoT multi-gas edge telemetry, real-time command centers, automated PPE vision verification, and rapid rescue workflows to eliminate confined-space fatalities.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="mt-8 space-y-3.5">
              {[
                { title: 'Sub-second Gas Spike Detection', desc: 'Electrochemical H₂S, CH₄, O₂ sensors & LoRaWAN mesh' },
                { title: 'AI Pre-Entry PPE Audit', desc: '96% confidence computer vision safety checklist' },
                { title: 'Autonomous Rescue Dispatch', desc: 'Instant tripod hoist alert & topside siren activation' },
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="p-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200">{feat.title}</span>
                    <span className="text-slate-400 block">{feat.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Indore Municipal Corporation &bull; Smart City Project</span>
            <span className="font-mono text-emerald-400">99.8% System Uptime</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-navy-900">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Sign In to Console
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials or select a demonstration role below to start.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Select Operating Role
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800">
                {[
                  { id: 'supervisor', label: 'Supervisor', email: 'rajesh.nagar@indore-safesewer.gov.in' },
                  { id: 'admin', label: 'Municipal Admin', email: 'commissioner@indore-safety.gov.in' },
                  { id: 'worker', label: 'Worker', email: 'suresh.yadav@safesewer.in' },
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRole(r.id as UserRole);
                      setEmail(r.email);
                    }}
                    className={`py-2 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                      role === r.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email / Employee ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-navy-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Security Token / Password
                  </label>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Demo Credentials Pre-filled
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-navy-900 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  <span>Remember session</span>
                </label>
                <span className="text-slate-400 font-mono">Indore Node #4</span>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In as {role.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 1-Click Continue Demo button */}
                <button
                  type="button"
                  onClick={() => handleLogin(role)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-navy-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Continue Instant Prototype Demo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
