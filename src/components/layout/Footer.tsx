import React from 'react';
import { ShieldCheck, Mail, MapPin, ExternalLink, Scale, BookOpen } from 'lucide-react';
import { DPO_OFFICIAL_DETAILS } from '../../lib/demoData';

interface FooterProps {
  onOpenNoticeModal: () => void;
  onNavigate: (view: 'store' | 'dashboard' | 'notice' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenNoticeModal, onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Project Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Privacy<span className="text-indigo-400">Cart</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Designing a Privacy-Preserving E-Commerce Web Application complying with the{' '}
              <strong className="text-slate-200">Digital Personal Data Protection (DPDP) Act, 2023</strong>.
            </p>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 bg-slate-800 rounded-md text-[11px] font-mono text-indigo-300 border border-slate-700">
                SPPU TE Comp Project • Academic Prototype
              </span>
            </div>
          </div>

          {/* Col 2: DPDP Statutory Rights */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Data Principal Rights</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-indigo-300 transition-colors cursor-pointer text-left"
                >
                  Sec 11: Right to Access Summary
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-indigo-300 transition-colors cursor-pointer text-left"
                >
                  Sec 12(1): Right to Correction
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-indigo-300 transition-colors cursor-pointer text-left"
                >
                  Sec 12(2): Right to Erasure / Forgotten
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-indigo-300 transition-colors cursor-pointer text-left"
                >
                  Sec 13: Grievance Redressal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-indigo-300 transition-colors cursor-pointer text-left"
                >
                  Sec 14: Right to Nominate
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Disclosures */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Statutory Compliance</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={onOpenNoticeModal}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-left font-medium text-emerald-400"
                >
                  Itemised Notice (Section 5)
                </button>
              </li>
              <li>
                <span className="text-slate-400">Unbundled Marketing Consent (Sec 6(2))</span>
              </li>
              <li>
                <span className="text-slate-400">Purpose Limitation & Data Minimisation</span>
              </li>
              <li>
                <span className="text-slate-400">Row Level Security (RLS) PostgreSQL</span>
              </li>
              <li>
                <span className="text-slate-400">Tamper-evident Consent Audit Log</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Appointed Data Protection Officer */}
          <div className="space-y-3 text-slate-400">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Data Protection Officer
            </h4>
            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-slate-200">{DPO_OFFICIAL_DETAILS.grievanceOfficerName}</p>
              <p className="text-slate-400 text-[11px]">{DPO_OFFICIAL_DETAILS.designation}</p>
              <p className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{DPO_OFFICIAL_DETAILS.officialEmail}</span>
              </p>
              <p className="flex items-start gap-1 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{DPO_OFFICIAL_DETAILS.campusLocation}</span>
              </p>
              <p className="text-[11px] text-amber-400 pt-1">
                Statutory Grievance SLA: 30 Calendar Days
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Academic Disclaimer */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © 2026 Savitribai Phule Pune University (SPPU) — Third Year Computer Engineering Capstone Prototype.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Disclaimer: Educational prototype created for demonstrating privacy-preserving web architectures.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
