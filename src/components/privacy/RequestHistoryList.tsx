import React from 'react';
import { Clock, ShieldCheck, CheckCircle2, AlertTriangle, FileText, UserCheck } from 'lucide-react';
import { PrivacyRequest, PrivacyRequestStatus, PrivacyRequestType } from '../../types';
import { Badge } from '../common/Badge';

interface RequestHistoryListProps {
  requests: PrivacyRequest[];
  onOpenNewRequest: () => void;
}

export const RequestHistoryList: React.FC<RequestHistoryListProps> = ({
  requests,
  onOpenNewRequest,
}) => {
  const getStatusBadge = (status: PrivacyRequestStatus) => {
    switch (status) {
      case 'ACTIONED':
        return <Badge variant="success" size="sm">Actioned / Completed</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="warning" size="sm">Under DPO Review</Badge>;
      case 'PENDING':
        return <Badge variant="info" size="sm">Pending Adjudication</Badge>;
      case 'REJECTED':
        return <Badge variant="danger" size="sm">Declined / Exception</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: PrivacyRequestType) => {
    switch (type) {
      case 'ACCESS_DATA':
        return 'Sec 11: Access Data';
      case 'CORRECTION':
        return 'Sec 12(1): Correction';
      case 'ERASURE':
        return 'Sec 12(2): Erasure';
      case 'GRIEVANCE':
        return 'Sec 13: Grievance';
      case 'NOMINATION':
        return 'Sec 14: Nomination';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Your Statutory Privacy Requests & Grievance History
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track adjudication progress, DPO decisions, and compliance SLA deadlines.
          </p>
        </div>

        <button
          onClick={onOpenNewRequest}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <span>File New Request</span>
        </button>
      </div>

      {/* List */}
      {requests.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 space-y-2">
          <p>No statutory requests or grievances on record for this Data Principal.</p>
          <button
            onClick={onOpenNewRequest}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            File an Access, Correction, or Erasure Request &rarr;
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {requests.map((req) => (
            <div key={req.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {req.trackingToken}
                  </span>
                  <Badge variant="primary" size="sm">{getTypeLabel(req.requestType)}</Badge>
                  {getStatusBadge(req.status)}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Submitted: {new Date(req.createdAt).toLocaleDateString('en-IN')}</span>
                  <span>• SLA: 30 Days</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">{req.subject}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{req.description}</p>
                {req.newValueRequested && (
                  <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700">
                    <strong>Requested Value:</strong> {req.newValueRequested}
                  </div>
                )}
              </div>

              {/* DPO Findings / Response if available */}
              {req.adminResponse ? (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-emerald-900 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Data Protection Officer Findings:</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-normal">
                      Adjudicated by {req.reviewedBy || 'Prof. Sharma (DPO)'}
                    </span>
                  </div>
                  <p className="text-emerald-950 leading-relaxed text-[11px]">
                    {req.adminResponse}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50/60 p-2 rounded-lg border border-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Under statutory processing by Grievance Redressal Desk. Resolution due within 30 days.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
