import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Binary, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  FileText, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, notifications } = useUiStore();
  const { user, logout } = useAuthStore();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'AI Studio', path: '/ai-studio', icon: <Binary className="w-5 h-5" /> },
    { label: 'Verification', path: '/verification', icon: <ShieldCheck className="w-5 h-5" /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Community', path: '/community', icon: <Users className="w-5 h-5" /> },
    { label: 'Reports', path: '/reports', icon: <FileText className="w-5 h-5" /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  // Count unread notifications for a little red badge in the sidebar for Verification or settings if we like
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 bg-bg-secondary border-r border-border-subtle flex flex-col justify-between z-30 overflow-hidden"
    >
      {/* Header section with brand logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle">
          <NavLink to="/" className="flex items-center gap-2">
            {/* Logo Shield shape */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-secondary to-accent-primary flex items-center justify-center shadow-lg shadow-accent-glow shrink-0">
              <span className="text-bg-primary font-display font-black text-sm">H</span>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="font-display font-bold text-base tracking-wider bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent uppercase shrink-0"
                >
                  Humanova
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>

          {/* Toggle sidebar button */}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1 rounded bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-subtle transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="absolute right-3.5 top-4.5 p-1 rounded bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-subtle transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="mt-6 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-surface border-l-2 border-accent-primary text-accent-primary' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface/50 border-l-2 border-transparent'
                }
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="font-sans font-medium transition-all duration-200">{item.label}</span>
              )}

              {/* Badges for Notifications */}
              {item.path === '/verification' && unreadCount > 0 && (
                <span className={`
                  absolute rounded-full bg-danger text-text-primary font-display font-bold text-[10px] flex items-center justify-center shrink-0
                  ${sidebarCollapsed ? 'top-1 right-2 w-4 h-4' : 'right-3 px-1.5 py-0.5'}
                `}>
                  {unreadCount}
                </span>
              )}

              {/* Tooltip for collapsed view */}
              {sidebarCollapsed && (
                <div className="absolute left-16 px-2 py-1 bg-surface border border-border-subtle text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shrink-0 z-50 whitespace-nowrap font-sans font-medium shadow-xl">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User profile drawer footer */}
      <div className="p-3 border-t border-border-subtle bg-surface/20">
        <div className="flex items-center justify-between gap-3">
          {user && (
            <div className="flex items-center gap-2 overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-border-subtle object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-accent-primary font-bold shrink-0">
                  {user.name.charAt(0)}
                </div>
              )}
              {!sidebarCollapsed && (
                <div className="overflow-hidden shrink-0">
                  <div className="text-xs font-semibold text-text-primary truncate max-w-[120px]">{user.name}</div>
                  <div className="text-[10px] text-text-muted truncate max-w-[120px] font-display font-bold uppercase">{user.role}</div>
                </div>
              )}
            </div>
          )}

          {!sidebarCollapsed && (
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded hover:bg-danger/10 text-text-muted hover:text-danger border border-transparent hover:border-danger/20 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
