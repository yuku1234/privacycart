import React from 'react';
import { History, ShieldCheck, Clock } from 'lucide-react';
import { ConsentAuditLogEntry } from '../../types';
import { Badge } from '../common/Badge';

interface ConsentAuditLogTableProps {
  logs: ConsentAuditLogEntry[];
}

export const ConsentAuditLogTable: React.FC<ConsentAuditLogTableProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Immutable Consent Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              DPDP Act 2023 Sec 6(4) & Sec 8(5) — Tamper-evident ledger of consent grants & revocations.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {logs.length} entries recorded
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400">
          No consent state changes recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                <th className="p-3">Timestamp (UTC/IST)</th>
                <th className="p-3">Consent Category</th>
                <th className="p-3">Action Recorded</th>
                <th className="p-3">Audit Details & Rationale</th>
                <th className="p-3">Masked Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                    </div>
                  </td>

                  <td className="p-3 font-medium text-slate-800 capitalize">
                    {log.consentType.replace('_', ' ')}
                  </td>

                  <td className="p-3">
                    <Badge
                      variant={log.action === 'GRANTED' ? 'success' : 'danger'}
                      size="sm"
                    >
                      {log.action}
                    </Badge>
                  </td>

                  <td className="p-3 text-slate-600 max-w-xs">
                    <p className="text-xs truncate">{log.rationale || 'User preference update'}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Policy: {log.version}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.ipAddressMasked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
