import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code2, Eye, EyeOff, Mail, Lock, Zap,
  ArrowRight, CheckCircle2, AlertCircle,
} from 'lucide-react';

// GitHub SVG icon (not in this lucide version)
function Github({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
import { Input, Button, LoadingSpinner } from '../components/UI';

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setApiError('');
    try {
      // In a real app: await api.post('/api/auth/login', form)
      await new Promise((r) => setTimeout(r, 1500));
      // Simulate success — redirect to problems
      navigate('/problems');
    } catch (err) {
      setApiError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Verdict account"
      altText="Don't have an account?"
      altLink="/register"
      altLinkText="Sign up"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {apiError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {apiError}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          autoComplete="email"
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <Link to="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              className={`w-full px-4 py-2.5 pr-11 rounded-xl bg-white/5 border ${
                errors.password ? 'border-rose-500/50' : 'border-white/10 focus:border-blue-500/50'
              } text-white placeholder-slate-500 outline-none transition-all duration-200 text-sm`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-rose-400">{errors.password}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-white/10 bg-white/5 accent-blue-500"
          />
          <label htmlFor="remember" className="text-sm text-slate-400">Remember me</label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="relative flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-slate-500">or continue with</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <Github className="w-4 h-4" />
          Continue with GitHub
        </button>
      </form>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username) e.username = 'Username is required';
    else if (form.username.length < 3) e.username = 'Username must be at least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Only letters, numbers, and underscores';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const PASSWORD_STRENGTH = [
    { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'Number', test: (p) => /\d/.test(p) },
    { label: 'Special character', test: (p) => /[!@#$%^&*]/.test(p) },
    { label: '8+ characters', test: (p) => p.length >= 8 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      // In a real app: await api.post('/api/auth/register', form)
      await new Promise((r) => setTimeout(r, 1800));
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrors({ api: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Account Created!" subtitle="Welcome to Verdict" altText="Redirecting to login..." altLink="/login" altLinkText="">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-slate-300 text-sm text-center">
            Your account has been created successfully! Redirecting you to login...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start solving problems for free"
      altText="Already have an account?"
      altLink="/login"
      altLinkText="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errors.api && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.api}
          </div>
        )}

        <Input
          label="Username"
          type="text"
          placeholder="codemaster99"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          error={errors.username}
          autoComplete="username"
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          autoComplete="email"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
              className={`w-full px-4 py-2.5 pr-11 rounded-xl bg-white/5 border ${
                errors.password ? 'border-rose-500/50' : 'border-white/10 focus:border-blue-500/50'
              } text-white placeholder-slate-500 outline-none transition-all text-sm`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-rose-400">{errors.password}</p>}

          {/* Password strength indicators */}
          {form.password && (
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              {PASSWORD_STRENGTH.map(({ label, test }) => {
                const ok = test(form.password);
                return (
                  <div key={label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${ok ? 'text-emerald-400' : 'text-slate-600'}`} />
                    {label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <p className="text-xs text-slate-500">
          By creating an account, you agree to our{' '}
          <Link to="#" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>
          {' '}and{' '}
          <Link to="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>.
        </p>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Creating Account...' : 'Create Free Account'}
        </Button>

        <div className="relative flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-slate-500">or sign up with</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <Github className="w-4 h-4" />
          Continue with GitHub
        </button>
      </form>
    </AuthLayout>
  );
}

// ─── Shared Auth Layout ───────────────────────────────────────

function AuthLayout({ title, subtitle, altText, altLink, altLinkText, children }) {
  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 py-24">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-white">Verdict</span>
          </Link>
          <h1 className="text-2xl font-black text-white">{title}</h1>
          <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/5 bg-[#111827] p-6 sm:p-8 shadow-2xl">
          {children}
        </div>

        {/* Alt Link */}
        {altText && (
          <p className="text-center text-sm text-slate-400 mt-5">
            {altText}{' '}
            {altLinkText && (
              <Link to={altLink} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                {altLinkText} <ArrowRight className="inline w-3.5 h-3.5" />
              </Link>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
