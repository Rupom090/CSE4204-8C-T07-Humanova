import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addNotification } = useUiStore();

  const [email, setEmail] = useState('aiden.vance@humanova.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email);
      addNotification('Signed in successfully as Aiden Vance.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addNotification('Authentication failed. Please verify credentials.', 'error');
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

        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-secondary to-accent-primary flex items-center justify-center shadow-lg shadow-accent-glow mb-4">
            <ShieldCheck className="w-6 h-6 text-bg-primary stroke-[2.5px]" />
          </div>
          <h2 className="text-2xl font-display font-bold tracking-wider text-text-primary bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent uppercase">
            HUMANOVA
          </h2>
          <p className="text-xs text-text-secondary mt-1 tracking-wider uppercase font-display font-medium">
            AI Trust Intelligence Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-display font-bold tracking-wider text-text-secondary uppercase mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-primary/60 hover:bg-bg-primary/80 border border-border-subtle hover:border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-glow focus:outline-none transition-all rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary"
                placeholder="name@organization.com"
                required
              />
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-display font-bold tracking-wider text-text-secondary uppercase mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-primary/60 hover:bg-bg-primary/80 border border-border-subtle hover:border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-glow focus:outline-none transition-all rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary"
                placeholder="••••••••"
                required
              />
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="text-right">
            <a href="#forgot" className="text-xs text-accent-primary hover:underline font-semibold transition-all">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-sm font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Social login divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-subtle" />
          </div>
          <span className="relative bg-surface px-3 text-xs text-text-muted font-display uppercase tracking-wider font-semibold">
            Or continue with
          </span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-2.5 px-4 rounded-lg bg-bg-primary/45 hover:bg-bg-primary border border-border-subtle hover:border-border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Globe className="w-4 h-4 text-text-primary" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-8 text-center text-xs text-text-secondary">
          Don't have an organization account?{' '}
          <Link to="/register" className="text-accent-primary font-bold hover:underline transition-all">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
