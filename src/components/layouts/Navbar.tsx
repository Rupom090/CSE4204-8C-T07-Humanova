import React, { useState } from 'react';
import { Bell, Search, PlusCircle, CheckCircle, ChevronDown, Check, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { organization, user, updateOrganization, logout } = useAuthStore();
  const { notifications, markAllNotificationsRead, clearNotifications, sidebarCollapsed } = useUiStore();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const orgs = ['Humanova Inc.', 'Alpha AI Corp', 'Nova Tech Labs'];

  const getNotifColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'error': return 'text-danger bg-danger/10 border-danger/20';
      default: return 'text-info bg-info/10 border-info/20';
    }
  };

  return (
    <header 
      className="fixed top-0 right-0 h-16 bg-bg-secondary/80 backdrop-blur-md border-b border-border-subtle z-20 flex items-center justify-between px-6 transition-all duration-200"
      style={{ left: sidebarCollapsed ? '64px' : '240px' }}
    >
      {/* Left Organization Switcher dropdown */}
      <div className="relative">
        <button
          onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-subtle bg-surface hover:bg-surface-hover text-sm font-semibold transition-all cursor-pointer"
        >
          <span className="text-text-primary">{organization?.name || 'Select Org'}</span>
          <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${orgDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {orgDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOrgDropdownOpen(false)} />
            <div className="absolute left-0 mt-2 w-48 rounded-lg bg-surface border border-border-subtle shadow-xl z-50 p-1 flex flex-col gap-0.5">
              {orgs.map((org) => (
                <button
                  key={org}
                  onClick={() => {
                    updateOrganization(org);
                    setOrgDropdownOpen(false);
                  }}
                  className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-hover rounded-md font-medium cursor-pointer"
                >
                  <span>{org}</span>
                  {organization?.name === org && <Check className="w-4 h-4 text-accent-primary" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right icons bar */}
      <div className="flex items-center gap-4">
        {/* Quick Scan CTA */}
        <button
          onClick={() => navigate('/ai-studio')}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-xs font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow cursor-pointer transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4 stroke-[3px]" />
          Quick Scan
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 rounded-lg border border-border-subtle bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-surface animate-pulse" />
            )}
          </button>

          {notifDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 rounded-lg bg-surface border border-border-subtle shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border-subtle">
                  <span className="font-display font-semibold text-xs tracking-wider text-text-primary">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-[10px] text-accent-primary hover:underline font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-border-subtle bg-surface">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-3 text-xs leading-relaxed transition-colors flex gap-2.5 ${notif.read ? 'opacity-60 bg-transparent' : 'bg-surface-hover'}`}
                      >
                        <div className={`p-1.5 rounded border h-fit shrink-0 mt-0.5 ${getNotifColor(notif.type)}`}>
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">{notif.message}</p>
                          <span className="text-[9px] text-text-muted mt-1 block font-display">{notif.timestamp}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-text-muted italic">No notifications found</div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-border-subtle bg-bg-secondary text-center">
                    <button
                      onClick={() => clearNotifications()}
                      className="text-[10px] text-danger hover:underline font-semibold cursor-pointer"
                    >
                      Clear all logs
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* User profile actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-1.5 p-1 rounded-full border border-border-subtle bg-surface hover:bg-surface-hover transition-all cursor-pointer"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-border-subtle"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-accent-primary font-bold">
                {user?.name.charAt(0)}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary mr-1" />
          </button>

          {profileDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-surface border border-border-subtle shadow-xl z-50 p-1 flex flex-col gap-0.5">
                <div className="px-3 py-2 border-b border-border-subtle">
                  <div className="text-xs font-semibold text-text-primary truncate">{user?.name}</div>
                  <div className="text-[10px] text-text-muted font-display uppercase tracking-widest font-bold truncate mt-0.5">{user?.role}</div>
                </div>

                <button
                  onClick={() => {
                    navigate('/settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-hover rounded-md font-medium cursor-pointer"
                >
                  <User className="w-4 h-4 text-text-secondary" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-md font-semibold cursor-pointer border-t border-border-subtle mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
