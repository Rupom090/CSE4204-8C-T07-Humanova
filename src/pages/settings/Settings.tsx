import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Building, 
  Key, 
  Users as UsersIcon, 
  ShieldCheck, 
  Check, 
  Trash2, 
  PlusCircle, 
  Mail,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { useProviderStore } from '@/stores/providerStore';
import { mockAuditLogs } from '@/services/api';
import ToastTypes from '@/components/ui/demo';

export const Settings: React.FC = () => {
  const { user, organization, updateOrganization } = useAuthStore();
  const { apiKeys, setApiKey, providers } = useProviderStore();
  const { addNotification } = useUiStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'api-keys' | 'members' | 'audit-logs'>('api-keys');

  // API Key visibilities
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({
    openai: false,
    gemini: false,
    deepseek: false,
  });

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || 'Aiden Vance');
  const [orgName, setOrgName] = useState(organization?.name || 'Humanova Inc.');

  // Members list state
  interface WorkspaceMember {
    id: string;
    name: string;
    email: string;
    role: string;
    joined: string;
    avatar?: string;
  }

  const [members, setMembers] = useState<WorkspaceMember[]>([
    { id: 'mem-1', name: 'Dr. Sarah Connor', email: 's.connor@humanova.ai', role: 'Verifier', joined: '12 Jan 2026', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80' },
    { id: 'mem-2', name: 'Aiden Vance', email: 'aiden.vance@humanova.ai', role: 'Admin', joined: '04 Jan 2026', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80' },
    { id: 'mem-3', name: 'Alan Turing', email: 'a.turing@humanova.ai', role: 'Verifier', joined: '15 Feb 2026', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80' },
    { id: 'mem-4', name: 'Grace Hopper', email: 'g.hopper@humanova.ai', role: 'Auditor', joined: '01 Mar 2026', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Verifier' | 'Auditor' | 'Viewer'>('Verifier');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const toggleShowKey = (prov: string) => {
    setShowKey((prev) => ({ ...prev, [prov]: !prev[prov] }));
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization(orgName);
    addNotification('Profile & Organization settings updated successfully.', 'success');
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember = {
      id: `mem-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      joined: 'Today',
      avatar: undefined,
    };

    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    setInviteModalOpen(false);
    addNotification(`Invite successfully dispatched to ${inviteEmail}!`, 'success');
  };

  const handleRemoveMember = (id: string, name: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    addNotification(`Access revoked for workspace user ${name}.`, 'warning');
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary">
            Settings Center
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Configure prompt engine API endpoints, manage organization teams, and review workspace audit logs.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface/50 border border-border-subtle p-0.5 rounded-lg w-fit">
          {(['profile', 'api-keys', 'members', 'audit-logs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider font-display transition-all cursor-pointer capitalize ${
                activeTab === tab 
                  ? 'bg-surface text-accent-primary border border-border-subtle shadow-md' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}

      {/* TAB 1: PROFILE & ORGANIZATION */}
      {activeTab === 'profile' && (
        <div className="glass-card p-6 rounded-xl border border-border-subtle max-w-2xl">
          <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-accent-primary" /> Profile & Workspace settings
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-display font-bold tracking-wider text-text-secondary uppercase mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-bg-primary/50 hover:bg-bg-primary/80 border border-border-subtle focus:border-accent-primary focus:outline-none transition-all rounded-lg p-2.5 text-xs text-text-primary font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-display font-bold tracking-wider text-text-secondary uppercase mb-2 block">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-bg-primary/50 hover:bg-bg-primary/80 border border-border-subtle focus:border-accent-primary focus:outline-none transition-all rounded-lg p-2.5 text-xs text-text-primary font-medium"
                />
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4 mt-6 text-right">
              <button
                type="submit"
                className="py-2 px-5 rounded-lg bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-xs font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow cursor-pointer transition-all active:scale-95"
              >
                Save Configurations
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: API KEYS */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(['openai', 'gemini', 'deepseek'] as const).map((prov) => {
              const provData = providers.find((p) => p.id === prov);
              const keyVal = apiKeys[prov];

              return (
                <div 
                  key={prov}
                  className="glass-card p-5 rounded-xl border border-border-subtle flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-display font-bold uppercase text-text-primary">
                        {provData?.name}
                      </span>
                      <span className="inline-flex h-2 w-2 relative shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                      </span>
                    </div>

                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      API endpoint key for delegating verification prompt scans to engine nets.
                    </p>

                    <div className="relative">
                      <input
                        type={showKey[prov] ? 'text' : 'password'}
                        value={keyVal}
                        onChange={(e) => setApiKey(prov, e.target.value)}
                        className="w-full bg-bg-primary/80 border border-border-subtle rounded-lg pl-3 pr-10 py-2 font-mono text-xs text-text-primary focus:border-accent-primary focus:outline-none"
                      />
                      <button
                        onClick={() => toggleShowKey(prov)}
                        className="absolute right-2.5 top-2 p-1 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                      >
                        {showKey[prov] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-text-secondary border-t border-border-subtle/50 pt-3">
                    <span>Last Used: {provData?.lastUsed || 'Never'}</span>
                    <button
                      onClick={() => addNotification(`${provData?.name} Key validated successfully!`, 'success')}
                      className="text-accent-primary font-bold hover:underline cursor-pointer"
                    >
                      Verify Key
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MEMBERS */}
      {activeTab === 'members' && (
        <div className="glass-card rounded-xl border border-border-subtle overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-display font-bold uppercase tracking-wider text-text-primary">
                Workspace Directory
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Invite team members and manage their system roles and authority settings.
              </p>
            </div>

            <button
              onClick={() => setInviteModalOpen(true)}
              className="py-2 px-4 rounded-lg bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-xs font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4 stroke-[3px]" />
              Invite Verifier
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-border-subtle text-text-secondary uppercase tracking-wider font-display font-bold">
                  <th className="py-3 px-4">Verifier Profile</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-text-primary">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {m.avatar ? (
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-8 h-8 rounded-full border border-border-subtle object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-accent-primary font-bold">
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-text-primary">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{m.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-display font-bold ${
                        m.role === 'Admin' ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' : 'bg-surface border border-border-subtle text-text-secondary'
                      }`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{m.joined}</td>
                    <td className="py-3 px-4 text-right">
                      {m.email !== user?.email && (
                        <button
                          onClick={() => handleRemoveMember(m.id, m.name)}
                          className="p-1 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invite Member Modal */}
          {inviteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setInviteModalOpen(false)} />
              
              <div className="glass-card rounded-xl p-6 border border-border max-w-sm w-full relative z-10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-primary to-accent-secondary" />

                <h3 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider mb-5 border-b border-border pb-3">
                  Dispatch Invite
                </h3>

                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted mb-1.5 block">Verifier Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full bg-bg-primary border border-border-subtle focus:border-accent-primary focus:outline-none rounded-lg pl-9 pr-3 py-2 text-xs text-text-primary font-medium"
                        placeholder="verifier@company.com"
                        required
                      />
                      <Mail className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted mb-1.5 block">Access Authority Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full bg-bg-primary border border-border-subtle focus:border-accent-primary focus:outline-none rounded-lg p-2 text-xs text-text-primary font-medium cursor-pointer"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Verifier">Verifier</option>
                      <option value="Auditor">Auditor</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>

                  <div className="border-t border-border pt-4 mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setInviteModalOpen(false)}
                      className="flex-1 py-2 px-3 rounded bg-surface hover:bg-surface-hover border border-border text-xs font-semibold text-text-primary transition-all cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-3 rounded bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-xs font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow transition-all cursor-pointer text-center"
                    >
                      Send Invite
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit-logs' && (
        <div className="glass-card rounded-xl border border-border-subtle overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-display font-bold uppercase tracking-wider text-text-primary">
                Security Ledger Logs
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Chronological security trail of all prompt scans, key rotations, and members modifications.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold border border-border-subtle bg-surface/50 rounded-lg py-1.5 px-3">
              <Filter className="w-3.5 h-3.5 text-accent-primary" />
              <span className="text-text-secondary">Security Ledger Ledger</span>
            </div>
          </div>

          <div className="space-y-4">
            {mockAuditLogs.map((log) => (
              <div 
                key={log.id}
                className="p-3.5 rounded-lg bg-surface/40 hover:bg-surface border border-border-subtle transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-accent-primary uppercase tracking-wider text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-text-muted font-display text-[10px]">
                      IP: {log.ip}
                    </span>
                  </div>
                  <p className="font-semibold text-text-primary">
                    Target: <strong className="text-text-secondary font-sans">{log.target}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-text-primary font-semibold block">{log.user}</span>
                  <span className="text-[9px] text-text-muted font-display block mt-0.5">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Sandbox Bench for testing Toast Notifications */}
      <div className="mt-8 border-t border-border-subtle pt-8">
        <ToastTypes />
      </div>
    </div>
  );
};
