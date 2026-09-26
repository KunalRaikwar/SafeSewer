import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  MapPin,
  Users,
  Cpu,
  Bell,
  AlertTriangle,
  FileBarChart2,
  Settings,
  Shield,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Radio,
  Flame,
  Sparkles
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const location = useLocation();
  const { alerts, incidents, jobs } = useSafety();

  const criticalAlertCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const activeJobCount = jobs.filter(j => j.operationalStatus === 'active').length;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Active Jobs', href: '/jobs', icon: Briefcase, badge: activeJobCount },
    { name: 'Live Map View', href: '/map', icon: MapPin },
    { name: 'Worker Fleet', href: '/workers', icon: Users },
    { name: 'IoT Edge Nodes', href: '/devices', icon: Cpu },
    { name: 'Safety Alerts', href: '/alerts', icon: Bell, badge: criticalAlertCount, badgeVariant: 'critical' },
    { name: 'Incidents & Timelines', href: '/incidents', icon: AlertTriangle },
    { name: 'Reports & Analytics', href: '/reports', icon: FileBarChart2 },
    { name: 'Settings & Thresholds', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 dark:bg-navy-950 border-r border-slate-800 text-slate-300 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-blue-600/30">
              <Shield className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-extrabold font-display tracking-tight text-white flex items-center gap-1.5">
                  SafeSewer
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-400 font-mono rounded border border-blue-500/30">
                    AI PRO
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  Confined Space Safety Platform
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}

                {/* Badge count */}
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                      item.badgeVariant === 'critical'
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed tiny badge dot */}
                {collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                      item.badgeVariant === 'critical' ? 'bg-red-500 animate-ping' : 'bg-blue-400'
                    }`}
                  />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Switch to Worker Mobile View Shortcut */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <NavLink
            to="/worker"
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            title="Open Worker Mobile HUD"
          >
            <Smartphone className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Worker Mobile HUD</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
};
