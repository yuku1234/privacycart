import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, FileText, Send } from 'lucide-react';
import { Modal } from '../common/Modal';
import { PrivacyRequest, PrivacyRequestStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { dataService } from '../../lib/dataService';
import { Badge } from '../common/Badge';

interface RequestReviewModalProps {
  request: PrivacyRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewed: () => void;
}

export const RequestReviewModal: React.FC<RequestReviewModalProps> = ({
  request,
  isOpen,
  onClose,
  onReviewed,
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [status, setStatus] = useState<PrivacyRequestStatus>(request?.status || 'UNDER_REVIEW');
  const [responseNotes, setResponseNotes] = useState(request?.adminResponse || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !request || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!responseNotes.trim()) {
      error('Notes Required', 'Please enter official adjudication findings or rationale.');
      return;
    }

    setIsSubmitting(true);
    try {
      await dataService.updatePrivacyRequestStatus(
        request.id,
        user.role,
        user.fullName,
        status,
        responseNotes
      );

      success(
        'Request Adjudicated',
        `Request ${request.trackingToken} updated to ${status}.`
      );
      onReviewed();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Adjudication Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DPO Grievance & Privacy Adjudication"
      subtitle={`Tracking Token: ${request.trackingToken} • SLA 30 Days`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Request Details Review Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-slate-400">Data Principal:</span>
              <p className="font-bold text-slate-900">{request.userName} ({request.userEmail})</p>
            </div>
            <Badge variant="primary" size="sm">{request.requestType}</Badge>
          </div>

          <div className="pt-1">
            <span className="text-[11px] text-slate-400">Subject:</span>
            <p className="font-semibold text-slate-800">{request.subject}</p>
          </div>

          <div>
            <span className="text-[11px] text-slate-400">Principal Statement:</span>
            <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed">
              {request.description}
            </p>
          </div>

          {request.newValueRequested && (
            <div className="p-2 bg-indigo-50 text-indigo-900 rounded-lg">
              <strong>Requested Field Change:</strong> {request.newValueRequested}
            </div>
          )}
        </div>

        {/* Adjudication Status Picker */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Adjudication Decision Status:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStatus('UNDER_REVIEW')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                status === 'UNDER_REVIEW'
                  ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Clock className="w-4 h-4 mx-auto mb-1 text-amber-600" />
              <span>Under Review</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('ACTIONED')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                status === 'ACTIONED'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              <span>Actioned / Executed</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('REJECTED')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                status === 'REJECTED'
                  ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <XCircle className="w-4 h-4 mx-auto mb-1 text-rose-600" />
              <span>Declined / Exempt</span>
            </button>
          </div>
        </div>

        {/* Official Findings Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
            Data Protection Officer Official Findings & Rationale *
          </label>
          <textarea
            required
            rows={4}
            value={responseNotes}
            onChange={(e) => setResponseNotes(e.target.value)}
            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
            placeholder="Document technical steps taken (e.g. verified identity, updated DB profile, or confirmed statutory tax retention exception)..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Recording Decision...' : 'Save DPO Adjudication'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};
