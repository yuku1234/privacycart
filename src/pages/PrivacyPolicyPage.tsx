import React from 'react';
import { ShieldCheck, Scale, BookOpen, Mail, MapPin, CheckCircle } from 'lucide-react';
import { PRIVACY_NOTICE_TABLE, DPO_OFFICIAL_DETAILS } from '../lib/demoData';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-xs text-slate-700">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
          <Scale className="w-3.5 h-3.5" />
          <span>Statutory Compliance Document</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Privacy Policy & DPDP Act 2023 Statutory Notice
        </h1>

        <p className="text-slate-500 leading-relaxed text-xs">
          Published by <strong className="text-slate-800">{DPO_OFFICIAL_DETAILS.fiduciaryName}</strong> in accordance with Section 5 of the Digital Personal Data Protection Act, 2023. Version 1.0 (Effective October 2026).
        </p>
      </div>

      {/* Itemised Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          1. Schedule of Personal Data Items & Purposes (Section 5)
        </h2>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Specific Fields</th>
                <th className="p-3.5">Purpose of Processing</th>
                <th className="p-3.5">Legal Basis</th>
                <th className="p-3.5">Retention Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PRIVACY_NOTICE_TABLE.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="p-3.5 font-bold text-slate-900 align-top">{row.dataCategory}</td>
                  <td className="p-3.5 text-slate-600 align-top">
                    {row.specificDataItems.join(', ')}
                  </td>
                  <td className="p-3.5 text-slate-600 align-top leading-relaxed">{row.purpose}</td>
                  <td className="p-3.5 font-mono text-[11px] text-indigo-700 align-top">{row.dpdpSection}</td>
                  <td className="p-3.5 text-slate-600 align-top">{row.retentionPeriod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rights */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          2. Data Principal Rights & Withdrawal Procedures
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900">Right to Withdraw Consent (Sec 6(4))</h3>
            <p className="text-slate-600 text-[11px]">
              You have the right to withdraw marketing or analytics consent at any time via your Privacy Dashboard. The withdrawal does not affect processing done prior to revocation.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-bold text-slate-900">Right to Erasure (Sec 12(2))</h3>
            <p className="text-slate-600 text-[11px]">
              You may submit an erasure request for marketing and account data. Statutory financial tax records (under GST & Companies Act) are retained strictly as required by law.
            </p>
          </div>
        </div>
      </div>

      {/* DPO Details */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
          3. Appointed Grievance Redressal Officer
        </h2>
        <p className="text-xs text-slate-300">
          If you have any questions, concerns, or unresolved grievances regarding data processing, please contact our designated officer:
        </p>
        <div className="text-xs space-y-1 text-slate-300 pt-1">
          <p className="font-bold text-white text-sm">{DPO_OFFICIAL_DETAILS.grievanceOfficerName}</p>
          <p>{DPO_OFFICIAL_DETAILS.designation}</p>
          <p>{DPO_OFFICIAL_DETAILS.affiliatedInstitution}, {DPO_OFFICIAL_DETAILS.campusLocation}</p>
          <p className="text-indigo-400 font-mono">{DPO_OFFICIAL_DETAILS.officialEmail}</p>
          <p className="text-amber-400 font-semibold pt-1">
            Statutory Grievance Redressal SLA: {DPO_OFFICIAL_DETAILS.grievanceSLA}
          </p>
        </div>
      </div>

    </div>
  );
};
