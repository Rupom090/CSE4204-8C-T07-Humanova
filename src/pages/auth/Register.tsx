import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User as UserIcon, Building, ArrowRight } from 'lucide-react';
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login, updateOrganization } = useAuthStore();
  const { addNotification } = useUiStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'individual' | 'organization'>('organization');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addNotification('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email);
      if (accountType === 'organization' && orgName) {
        updateOrganization(orgName);
      }
      addNotification('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addNotification('Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAF8F5] flex items-center justify-center px-4 py-12">
      {/* Background Ethereal Shadow Backdrop */}
      <div className="absolute inset-0 z-0 opacity-80">
        <EtherealShadow 
          showTitle={false} 
          animation={{ scale: 80, speed: 40 }} 
          noise={{ opacity: 0.5, scale: 1.1 }} 
          color="rgba(234, 28, 36, 0.16)" 
        />
      </div>

      {/* Glass card container overlay */}
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-border-subtle relative z-10 overflow-hidden shadow-2xl">
        {/* Top highlight glow */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-primary to-accent-secondary" />

        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-secondary to-accent-primary flex items-center justify-center shadow-lg shadow-accent-glow mb-4">
            <ShieldCheck className="w-6 h-6 text-bg-primary stroke-[2.5px]" />
          </div>
          <h2 className="text-2xl font-display font-bold tracking-wider text-text-primary bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent uppercase">
            HUMANOVA
          </h2>
          <p className="text-xs text-text-secondary mt-1 tracking-wider uppercase font-display font-medium">
            Create Trust Account
          </p>
        </div>

        {/* Account type toggle */}
        <div className="flex bg-bg-primary/60 border border-border-subtle p-1 rounded-lg mb-6 gap-1 relative z-20">
          <button
            type="button"
            onClick={() => setAccountType('individual')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider font-display transition-all cursor-pointer ${
              accountType === 'individual' ? 'bg-surface text-accent-primary border border-border' : 'text-text-secondary'
            }`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setAccountType('organization')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider font-display transition-all cursor-pointer ${
              accountType === 'organization' ? 'bg-surface text-accent-primary border border-border' : 'text-text-secondary'
            }`}
          >
            Organization
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
          <div>
            <label className="text-xs font-display font-bold tracking-wider text-text-secondary uppercase mb-1.5 block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-primary/60 hover:bg-bg-primary/80 border border-border-subtle hover:border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-glow focus:outline-none transition-all rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary font-medium"
                placeholder="Aiden Vance"
                required
              />
              <UserIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
            </div>
          </div>

          {accountType === 'organization' && (
            <div>
              <label className="text-xs font-display font-bold tracking-wider text-text-secondary uppercase mb-1.5 block">
                Organization Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-bg-primary/60 hover:bg-bg-primary/80 border border-border-subtle hover:border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-glow focus:outline-none transition-all rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary font-medium"
                  placeholder="Humanova Inc."
                  required
                />
                  <Building className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-display font-bold tracking-wider text-text-secondary uppercase mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-primary/60 hover:bg-bg-primary/80 border border-border-subtle hover:border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-glow focus:outline-none transition-all rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary font-medium"
                  placeholder="name@company.com"
                  required
                />
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-display font-bold tracking-wider text-text-secondary uppercase mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-primary/60 hover:bg-bg-primary/80 border border-border-subtle hover:border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-glow focus:outline-none transition-all rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-display font-bold tracking-wider text-text-secondary uppercase mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-bg-primary/60 hover:bg-bg-primary/80 border border-border-subtle hover:border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-glow focus:outline-none transition-all rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-sm font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 disabled:opacity-50 mt-4"
            >
              {loading ? 'Registering...' : 'Register'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-text-secondary relative z-20">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-primary font-bold hover:underline transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </div>
  );
};
