import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  FileCheck,
  UserCheck,
  AlertCircle,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface DataProtectionTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  userEmail?: string;
  loading?: boolean;
}

export const DataProtectionTermsModal: React.FC<DataProtectionTermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  userEmail,
  loading = false,
}) => {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Data Protection Terms & Conditions"
      subtitle="Digital Personal Data Protection (DPDP) Act, 2023 — Safeguards & User Rights"
      maxWidth="lg"
    >
      <div className="space-y-4">
        
        {/* Top Guarantee Banner */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-2xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-emerald-950 text-sm">
              Your Personal Information is Protected
            </h4>
            <p className="text-emerald-800 mt-0.5 leading-relaxed">
              Before accessing your account{userEmail ? ` (${userEmail})` : ''}, PrivacyCart asks you to review our statutory data protection commitments under India&apos;s Digital Personal Data Protection Act, 2023.
            </p>
          </div>
        </div>

        {/* The 5 Key Data Protection Commitments */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 text-xs">
          
          {/* 1. Purpose Limitation */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">1. Strict Purpose Limitation (DPDP Sec 4 & 5)</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-700 rounded-full">Statutory</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Your personal identifiers (full name, email, delivery address, phone) are processed <strong>strictly for order processing, logistics delivery, and mandatory invoice generation</strong>. Your data is never repurposed for unauthorized secondary activities.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Zero Data Selling */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <EyeOff className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">2. Zero Data Selling & No Third-Party Brokerage</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-700 rounded-full">Prohibited</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  PrivacyCart guarantees that <strong>your personal information is never sold, leased, or rented</strong> to third-party ad networks, telemetry trackers, or commercial data aggregators. Your shopping habits remain strictly confidential.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Cryptographic Storage & RLS */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">3. Encrypted Storage & Row Level Security (RLS) (Sec 8)</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-700 rounded-full">Technical Safeguard</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Personal records are isolated with strict PostgreSQL Row Level Security (RLS) policies. One customer or unauthorized student cannot inspect another customer&apos;s personal records or orders.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Statutory Rights to Erasure & Correction */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">4. Data Principal Statutory Rights (DPDP Sec 11–14)</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-700 rounded-full">Your Sovereignty</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  You have the legal right at any moment to:
                </p>
                <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pl-1">
                  <li><strong>Access:</strong> Download your comprehensive JSON data dossier (Sec 11).</li>
                  <li><strong>Correction:</strong> Update inaccurate identity or contact details (Sec 12).</li>
                  <li><strong>Erasure:</strong> Demand permanent deletion of your profile & orders (Sec 12).</li>
                  <li><strong>Consent Revocation:</strong> Opt out of optional marketing anytime without losing shopping access (Sec 6(2)).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 5. DPO Oversight */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">5. Grievance Redressal & DPO Supervision (Sec 13)</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-100 text-purple-700 rounded-full">Accountability</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Our designated Data Protection Officer (Prof. Sharma, DPO) oversees institutional compliance and is legally bound to resolve privacy grievances within 7 business days.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Required Agreement Checkbox */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-slate-900 text-xs font-medium">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="leading-snug">
              I have read, understood, and accept the <strong>Data Protection Terms & Conditions</strong>. I acknowledge my rights as a Data Principal and confirm that PrivacyCart will protect my personal information in compliance with the <strong>DPDP Act, 2023</strong>.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel / Decline
          </button>
          <button
            type="button"
            disabled={!agreed || loading}
            onClick={onAccept}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Securing Session...' : 'Accept Terms & Enter Secure Session'}</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
