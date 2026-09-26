import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Briefcase, Activity, Bell, User, ShieldCheck } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { alerts } = useSafety();

  const workerAlerts = alerts.filter(a => a.status === 'active');

  const navItems = [
    { name: 'Home', href: '/worker', icon: Home },
    { name: 'Job', href: '/worker/job', icon: Briefcase },
    { name: 'Safety', href: '/worker/safety', icon: Activity },
    { name: 'Alerts', href: '/worker/alerts', icon: Bell, badge: workerAlerts.length },
    { name: 'Profile', href: '/worker/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-t border-slate-200 dark:border-navy-800 px-3 py-2 flex items-center justify-around shadow-lg">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-black rounded-full font-mono animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] leading-none">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
