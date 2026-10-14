import React, { useState } from 'react';
import {
  Scale,
  Send,
  HelpCircle,
  FileCheck,
  AlertTriangle,
  FileEdit,
  Trash2,
  UserCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { dataService } from '../../lib/dataService';
import { PrivacyRequestType } from '../../types';

interface PrivacyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: () => void;
}

export const PrivacyRequestModal: React.FC<PrivacyRequestModalProps> = ({
  isOpen,
  onClose,
  onRequestSubmitted,
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [requestType, setRequestType] = useState<PrivacyRequestType>('ACCESS_DATA');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [correctionField, setCorrectionField] = useState<'phone' | 'fullName'>('phone');
  const [newValueRequested, setNewValueRequested] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) {
      error('Missing Information', 'Please provide a subject and detailed description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName,
        requestType,
        subject,
        description,
        requestedFields: requestType === 'CORRECTION' ? [correctionField] : undefined,
        newValueRequested: requestType === 'CORRECTION' ? newValueRequested : undefined,
      };

      const req = await dataService.createPrivacyRequest(payload);
      success(
        'Statutory Request Logged',
        `Tracking Token: ${req.trackingToken}. Assigned to Data Protection Officer with 30-day resolution SLA.`
      );
      onRequestSubmitted();
      onClose();

      // Reset fields
      setSubject('');
      setDescription('');
      setNewValueRequested('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Submission Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeSelect = (type: PrivacyRequestType) => {
    setRequestType(type);
    if (type === 'ACCESS_DATA') {
      setSubject('Request for Summary of Personal Data Processed (Section 11)');
      setDescription('Pursuant to Section 11 of the DPDP Act 2023, I request an itemised summary of all personal data held, processing activities, and identities of third-party logistics processors.');
    } else if (type === 'CORRECTION') {
      setSubject('Request for Correction of Personal Data (Section 12(1))');
      setDescription('Requesting update of incorrect or outdated contact information.');
    } else if (type === 'ERASURE') {
      setSubject('Request for Erasure / Right to be Forgotten (Section 12(2))');
      setDescription('Pursuant to Section 12(2) DPDP Act 2023, I request complete erasure of all non-statutory personal data, promotional profiles, and marketing identifiers.');
    } else if (type === 'GRIEVANCE') {
      setSubject('Formal Grievance Complaint to Data Protection Officer (Section 13)');
      setDescription('Filing a formal grievance regarding data processing practices.');
    } else if (type === 'NOMINATION') {
      setSubject('Nomination of Representative (Section 14)');
      setDescription('Registering a nominated individual to exercise Data Principal rights in case of death or incapacity.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="File Statutory Privacy Request"
      subtitle="Digital Personal Data Protection (DPDP) Act, 2023 — Sections 11, 12, 13, 14"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        
        {/* DPDP Right Selector Pills */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Statutory Right to Exercise:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            
            <button
              type="button"
              onClick={() => handleTypeSelect('ACCESS_DATA')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                requestType === 'ACCESS_DATA'
                  ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-indigo-600">
                <FileCheck className="w-4 h-4" />
                <span className="font-bold">Sec 11: Access Data</span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Summary of all processed records & sharing partners.
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeSelect('CORRECTION')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                requestType === 'CORRECTION'
                  ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-indigo-600">
                <FileEdit className="w-4 h-4" />
                <span className="font-bold">Sec 12(1): Correction</span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Rectify outdated or inaccurate details.
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeSelect('ERASURE')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                requestType === 'ERASURE'
                  ? 'border-rose-600 bg-rose-50/60 text-rose-950 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-rose-600">
                <Trash2 className="w-4 h-4" />
                <span className="font-bold">Sec 12(2): Erasure</span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Purge optional personal & marketing data.
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeSelect('GRIEVANCE')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                requestType === 'GRIEVANCE'
                  ? 'border-amber-600 bg-amber-50/60 text-amber-950 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-bold">Sec 13: Grievance</span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Formal complaint to Grievance Officer.
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeSelect('NOMINATION')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between sm:col-span-2 ${
                requestType === 'NOMINATION'
                  ? 'border-purple-600 bg-purple-50/60 text-purple-950 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-purple-600">
                <UserCheck className="w-4 h-4" />
                <span className="font-bold">Sec 14: Right to Nominate Representative</span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Designate a proxy to manage privacy rights in case of incapacity.
              </span>
            </button>

          </div>
        </div>

        {/* Dynamic Correction Fields */}
        {requestType === 'CORRECTION' && (
          <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-3">
            <span className="font-bold text-indigo-950 block">Correction Target Details:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Field to Update
                </label>
                <select
                  value={correctionField}
                  onChange={(e) => setCorrectionField(e.target.value as 'phone' | 'fullName')}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="phone">Primary Phone Number</option>
                  <option value="fullName">Full Name</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  New Verified Value *
                </label>
                <input
                  type="text"
                  required
                  value={newValueRequested}
                  onChange={(e) => setNewValueRequested(e.target.value)}
                  placeholder={correctionField === 'phone' ? '+91 98...' : 'Full Legal Name'}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Subject */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Request Subject / Title *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
            placeholder="Brief summary of request..."
          />
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Detailed Statement / Rationale *
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
            placeholder="Explain the specific personal data or grievance details..."
          />
        </div>

        {/* Statutory SLA Callout */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>
              DPDP Act Statutory Timeline: <strong>30 Calendar Days</strong> resolution SLA.
            </span>
          </div>
          <span className="font-mono text-indigo-600">Free of Cost</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Registering with DPO...' : 'Submit Statutory Request'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};
