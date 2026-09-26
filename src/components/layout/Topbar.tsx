import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  LogOut,
  Flame,
  Volume2,
  VolumeX,
  Siren
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { 
    theme, 
    toggleTheme, 
    demoMode, 
    setDemoMode, 
    currentRole, 
    setCurrentRole, 
    alerts, 
    simulateGasSpike, 
    simulateNormalizeConditions,
    isAudioMuted,
    toggleAudioMute,
    isSirenPlaying,
    playEmergencySiren,
    stopEmergencySiren
  } = useSafety();

  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeAlerts = alerts.filter(a => a.status !== 'resolved');

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Safety Command Center';
      case '/jobs':
        return 'Active Chamber Jobs';
      case '/map':
        return 'Subterranean GIS Safety Map';
      case '/workers':
        return 'Worker Fleet & PPE Compliance';
      case '/devices':
        return 'IoT Edge Gas Detection Nodes';
      case '/alerts':
        return 'Emergency & Safety Alerts Center';
      case '/incidents':
        return 'Incident Command & Forensics';
      case '/reports':
        return 'Municipal Compliance & Analytics';
      case '/settings':
        return 'System Thresholds & Configurations';
      default:
        return 'Safety Operations Hub';
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setShowRoleMenu(false);
    if (role === 'worker') {
      navigate('/worker');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-navy-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {getPageTitle()}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
            Indore Municipal Corporation &bull; Live Edge Telemetry
          </p>
        </div>
      </div>

      {/* Middle: Search input */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search chambers, workers, alerts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-100 dark:bg-navy-950 border border-transparent dark:border-navy-700/80 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-navy-900 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Siren Sound Controller */}
        <button
          onClick={() => {
            if (isSirenPlaying) {
              stopEmergencySiren();
            } else {
              playEmergencySiren(8);
            }
          }}
          className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${
            isSirenPlaying
              ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/30 ring-2 ring-red-400'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-navy-800'
          }`}
          title={isSirenPlaying ? 'Stop Topside Siren' : 'Test Acoustic Topside Siren'}
        >
          <Siren className={`w-4 h-4 ${isSirenPlaying ? 'animate-spin' : ''}`} />
          <span className="hidden xl:inline">{isSirenPlaying ? 'SIREN ACTIVE' : 'Test Siren'}</span>
        </button>

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={toggleAudioMute}
          className={`p-2 rounded-lg transition-colors ${
            isAudioMuted
              ? 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-navy-800'
          }`}
          title={isAudioMuted ? 'Unmute Emergency Audio Alarms' : 'Mute Emergency Audio Alarms'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Simulation Triggers Dropdown for live testing / demo */}
        <div className="relative">
          <button
            onClick={() => setShowSimMenu(!showSimMenu)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-navy-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-navy-700 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Simulate</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showSimMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                Live Scenario Controls
              </div>
              <button
                onClick={() => {
                  simulateGasSpike();
                  setShowSimMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold flex items-center gap-2 transition-colors"
              >
                <Flame className="w-4 h-4" />
                Trigger Toxic H₂S Spike & Siren (38 ppm)
              </button>
              <button
                onClick={() => {
                  simulateNormalizeConditions();
                  setShowSimMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Flush Atmosphere & Silence Siren
              </button>
            </div>
          )}
        </div>

        {/* Demo Mode Toggle Badge */}
        <button
          onClick={() => setDemoMode(prev => !prev)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
            demoMode
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-navy-800 dark:text-slate-400 dark:border-navy-700'
          }`}
          title="Toggle live mock data fluctuation"
        >
          <span className={`w-2 h-2 rounded-full ${demoMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span className="hidden sm:inline">DEMO MODE</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-navy-800 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-navy-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-navy-900 animate-ping" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-navy-800">
                <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-900 dark:text-white">
                  Active Alerts ({activeAlerts.length})
                </span>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/alerts');
                  }}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {activeAlerts.slice(0, 3).map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/alerts');
                    }}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-navy-800 hover:bg-slate-50 dark:hover:bg-navy-800/60 cursor-pointer text-xs space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                        {alert.alertType}
                      </span>
                      <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                      {alert.location} &bull; {alert.sensorValue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-blue-600 flex items-center justify-center font-bold text-xs">
              {currentRole === 'supervisor' ? 'RN' : currentRole === 'admin' ? 'AD' : 'SY'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                {currentRole === 'supervisor' ? 'Rajesh Nagar' : currentRole === 'admin' ? 'Municipal Admin' : 'Suresh Yadav'}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">{currentRole}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in">
              <div className="px-2 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                Switch Active Profile
              </div>
              {[
                { role: 'supervisor', name: 'Supervisor (Rajesh Nagar)', desc: 'Command center & dispatch' },
                { role: 'admin', name: 'Municipal Admin', desc: 'Full zone oversight & reports' },
                { role: 'worker', name: 'Worker (Suresh Yadav)', desc: 'Mobile-first safety app' },
              ].map(item => (
                <button
                  key={item.role}
                  onClick={() => handleRoleChange(item.role as UserRole)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currentRole === item.role
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </button>
              ))}

              <div className="my-1 border-t border-slate-100 dark:border-navy-800" />
              <button
                onClick={() => navigate('/login')}
                className="w-full text-left px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out / Exit Demo
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
