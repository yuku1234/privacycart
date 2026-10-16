import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone, CheckSquare, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { DataProtectionTermsModal } from './DataProtectionTermsModal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [essentialConsent, setEssentialConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false); // Unbundled default false
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { success, error } = useNotification();

  if (!isOpen) return null;

  const executeSignIn = async () => {
    setLoading(true);
    try {
      await login(email, password);
      success('Welcome Back', 'Logged in securely. Your personal information is protected under DPDP Act 2023.');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Sign In Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      // Proactively ask for Data Protection Terms & Conditions!
      setShowTermsModal(true);
      return;
    }
    await executeSignIn();
  };

  const handleAcceptTermsAndProceed = async () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    await executeSignIn();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!essentialConsent) {
      error('Consent Required', 'Essential processing consent is required to create a shopping account under DPDP Section 6(1).');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName,
        email,
        passwordPlain: password,
        phone,
        marketingConsent,
      });
      success('Account Created', 'Data Principal registered with personalized DPDP consent preferences.');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (role: 'alice' | 'admin') => {
    if (role === 'alice') {
      setEmail('alice@student.sppu.ac.in');
      setPassword('demo_password_123');
    } else {
      setEmail('dpo.sharma@sppu.ac.in');
      setPassword('admin_password_456');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === 'signin' ? 'Sign In to PrivacyCart' : 'Register Data Principal Account'}
      subtitle="DPDP Act 2023 Aligned Identity & Consent System"
      maxWidth="md"
    >
      <div className="space-y-4">
        
        {/* Tab switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer text-center ${
              tab === 'signin'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer text-center ${
              tab === 'register'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        {tab === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alice@student.sppu.ac.in"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                />
              </div>
            </div>

            {/* Quick credentials filler for examiners */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Viva Pre-fill:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('alice')}
                  className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer flex-1 text-center"
                >
                  Fill Student Alice
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('admin')}
                  className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer flex-1 text-center"
                >
                  Fill DPO Admin
                </button>
              </div>
            </div>

            {/* DATA PROTECTION TERMS & CONDITIONS (DPDP ACT 2023) */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Data Protection Terms (DPDP Act 2023)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                >
                  Review Protections
                </button>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Your personal info is protected under strict purpose limitation, zero third-party data selling, encrypted storage, and unconditional erasure rights.
              </p>
              <label className="flex items-start gap-2 cursor-pointer text-emerald-950 font-medium pt-0.5">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500"
                />
                <span className="text-[11px] leading-snug">
                  I accept the <strong>Data Protection Terms & Conditions</strong> and acknowledge that my personal information is protected under India&apos;s DPDP Act, 2023.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : termsAccepted ? 'Sign In Securely' : 'Review Terms & Sign In'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Full Name (Data Principal) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Radhika Apte"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="radhika@example.in"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Mobile (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full text-xs pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* MANDATORY DPDP SECTION 6(1) NOTICE */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950">Statutory Consent Notice (Sec 6(1))</span>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-[10px] font-semibold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                >
                  Review Protections
                </button>
              </div>
              <label className="flex items-start gap-2 cursor-pointer text-indigo-950 font-medium">
                <input
                  type="checkbox"
                  required
                  checked={essentialConsent}
                  onChange={(e) => setEssentialConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-indigo-300"
                />
                <span className="text-[11px] leading-snug">
                  I consent to the processing of essential identity and order records required for shopping fulfillment under <strong>DPDP Act Section 6(1)</strong> with full data protection safeguards.
                </span>
              </label>
            </div>

            {/* SEPARATE OPTIONAL MARKETING CONSENT (DPDP SECTION 6(2) UNBUNDLING REQUIREMENT) */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
              <label className="flex items-start gap-2 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                <div>
                  <span className="font-semibold block text-slate-900">
                    Optional: Marketing & promotional communications (Sec 6(2))
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Unbundled and non-mandatory. You can easily revoke this anytime in your Privacy Dashboard.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Data Principal Profile...' : 'Complete Registration'}
            </button>
          </form>
        )}

      </div>

      <DataProtectionTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleAcceptTermsAndProceed}
        userEmail={email}
        loading={loading}
      />
    </Modal>
  );
};
