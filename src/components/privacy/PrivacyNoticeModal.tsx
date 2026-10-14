import React from 'react';
import { ShieldCheck, Mail, MapPin, Scale, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PRIVACY_NOTICE_TABLE, DPO_OFFICIAL_DETAILS } from '../../lib/demoData';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Statutory Privacy Notice"
      subtitle="Digital Personal Data Protection (DPDP) Act, 2023 — Section 5 Compliance"
      maxWidth="4xl"
    >
      <div className="space-y-6 text-xs text-slate-700">
        
        {/* Intro Banner */}
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Notice of Data Processing to Data Principals</span>
          </div>
          <p className="leading-relaxed text-indigo-950">
            In accordance with <strong>Section 5 of the Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, this notice outlines the specific categories of personal data processed by <strong>{DPO_OFFICIAL_DETAILS.fiduciaryName}</strong>, the exact purposes of processing, the statutory legal grounds, and the retention timelines enforced.
          </p>
        </div>

        {/* Itemised Notice Table */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            1. Itemised Personal Data Processing Registry
          </h4>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-[11px] font-bold border-b border-slate-200">
                  <th className="p-3">Data Category</th>
                  <th className="p-3">Specific Items</th>
                  <th className="p-3">Processing Purpose</th>
                  <th className="p-3">DPDP Section</th>
                  <th className="p-3">Retention Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PRIVACY_NOTICE_TABLE.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-slate-900 align-top">
                      {row.dataCategory}
                    </td>
                    <td className="p-3 text-slate-600 align-top">
                      <ul className="list-disc list-inside space-y-0.5">
                        {row.specificDataItems.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-slate-600 leading-relaxed align-top">
                      {row.purpose}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-indigo-700 align-top">
                      {row.dpdpSection}
                    </td>
                    <td className="p-3 text-slate-600 align-top">
                      {row.retentionPeriod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Principal Rights Summary */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            2. Statutory Rights Exercisable under the DPDP Act
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Right to Access (Section 11)</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Obtain a summary of personal data being processed and identities of all other Data Fiduciaries/Processors with whom data has been shared.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Right to Correction & Erasure (Section 12)</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Correct inaccurate or misleading data (Sec 12(1)) and request complete erasure of personal data no longer necessary for specified purposes (Sec 12(2)).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Right of Grievance Redressal (Section 13)</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                File a formal complaint to the designated Grievance Officer, with mandatory response SLA of 30 days prior to escalating to the Data Protection Board of India.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Right to Nominate (Section 14)</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Nominate any other individual who shall, in the event of death or incapacity of the Data Principal, exercise these statutory rights.
              </p>
            </div>
          </div>
        </div>

        {/* Data Protection Officer Details Box */}
        <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>3. Appointed Data Protection Officer & Contact Details</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              SLA: {DPO_OFFICIAL_DETAILS.grievanceSLA}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-400 text-[11px]">Officer In-Charge:</p>
              <p className="font-bold text-white">{DPO_OFFICIAL_DETAILS.grievanceOfficerName}</p>
              <p className="text-slate-300 text-[11px]">{DPO_OFFICIAL_DETAILS.designation}</p>
            </div>

            <div>
              <p className="text-slate-400 text-[11px]">Institutional Address:</p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {DPO_OFFICIAL_DETAILS.affiliatedInstitution}, {DPO_OFFICIAL_DETAILS.campusLocation}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-[11px]">Direct Grievance Contact:</p>
              <p className="text-indigo-300 font-mono text-[11px]">{DPO_OFFICIAL_DETAILS.officialEmail}</p>
            </div>

            <div>
              <p className="text-slate-400 text-[11px]">Telephone Extension:</p>
              <p className="text-slate-300 font-mono text-[11px]">{DPO_OFFICIAL_DETAILS.contactNumber}</p>
            </div>
          </div>
        </div>

        <div className="text-right pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
