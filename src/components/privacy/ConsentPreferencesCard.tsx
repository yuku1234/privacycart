import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  BarChart3,
  Truck,
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ConsentRecord, ConsentType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { dataService } from '../../lib/dataService';
import { Badge } from '../common/Badge';

interface ConsentPreferencesCardProps {
  consents: ConsentRecord[];
  onConsentUpdated: () => void;
}

export const ConsentPreferencesCard: React.FC<ConsentPreferencesCardProps> = ({
  consents,
  onConsentUpdated,
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [updatingType, setUpdatingType] = useState<ConsentType | null>(null);

  if (!user) return null;

  const handleToggle = async (consentType: ConsentType, currentGranted: boolean) => {
    if (consentType === 'essential_processing') {
      error(
        'Action Restricted',
        'Essential processing consent is required for basic e-commerce fulfillment under Section 4(1)(a). To delete your account data, please file an Erasure Request under Section 12(2).'
      );
      return;
    }

    setUpdatingType(consentType);
    const newGranted = !currentGranted;

    try {
      await dataService.updateConsent(
        user.id,
        consentType,
        newGranted,
        `User toggled preference to ${newGranted ? 'GRANTED' : 'REVOKED'} from Privacy Dashboard.`
      );

      success(
        'Consent Preference Updated',
        `${consentType.replace('_', ' ').toUpperCase()} set to ${newGranted ? 'GRANTED' : 'REVOKED'}. Recorded in audit log.`
      );
      onConsentUpdated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Failed to update consent', msg);
    } finally {
      setUpdatingType(null);
    }
  };

  const getConsentState = (type: ConsentType): boolean => {
    const found = consents.find((c) => c.consentType === type);
    return found ? found.granted : false;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Granular Consent Management Center
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            DPDP Act 2023 Section 6(4) — Right to give, manage, and withdraw consent with equal ease.
          </p>
        </div>

        <Badge variant="primary" size="sm">
          Active Consent Policy: v1.0-2023
        </Badge>
      </div>

      {/* Consent Items */}
      <div className="divide-y divide-slate-100 p-5 space-y-4">
        
        {/* 1. Essential Processing */}
        <div className="flex items-start justify-between gap-4 pt-1">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Essential Contractual Processing
                </h4>
                <Badge variant="success" size="sm">Mandatory</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Processing core profile, tax invoice, and order records necessary to fulfill physical purchases under Section 4(1)(a) of the DPDP Act 2023.
              </p>
              <span className="text-[11px] font-mono text-slate-400 block pt-0.5">
                Statutory Basis: DPDP Act 2023 Sec 6(1) & Sec 4(1)(a)
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Active / Locked
            </span>
          </div>
        </div>

        {/* 2. Marketing & Promotional Communications (Unbundled Consent) */}
        <div className="flex items-start justify-between gap-4 pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Marketing & Promotional Communications
                </h4>
                <Badge variant="info" size="sm">Unbundled Optional</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receiving newsletters, security bulletins, and promotional discounts via email or SMS. Fully optional and independent of store checkout privileges.
              </p>
              <span className="text-[11px] font-mono text-slate-400 block pt-0.5">
                Statutory Basis: DPDP Act 2023 Sec 6(2)
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => handleToggle('marketing_promotions', getConsentState('marketing_promotions'))}
              disabled={updatingType === 'marketing_promotions'}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
                getConsentState('marketing_promotions') ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  getConsentState('marketing_promotions') ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 3. Analytics & Telemetry */}
        <div className="flex items-start justify-between gap-4 pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl shrink-0 mt-0.5">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Anonymous Performance & Telemetry
                </h4>
                <Badge variant="neutral" size="sm">Optional</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aggregated, anonymized statistics regarding page load latencies to improve system availability. Defaulted to disabled for privacy-by-design.
              </p>
              <span className="text-[11px] font-mono text-slate-400 block pt-0.5">
                Statutory Basis: DPDP Act 2023 Sec 6(2)
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => handleToggle('analytics_telemetry', getConsentState('analytics_telemetry'))}
              disabled={updatingType === 'analytics_telemetry'}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
                getConsentState('analytics_telemetry') ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  getConsentState('analytics_telemetry') ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4. Logistics Sharing */}
        <div className="flex items-start justify-between gap-4 pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-0.5">
              <Truck className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Third-Party Courier Dispatch Transmission
                </h4>
                <Badge variant="primary" size="sm">Contractual</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Transmitting shipping coordinates to licensed courier processors (India Post / BlueDart) under formal Data Processor Agreements (Sec 8(2)).
              </p>
              <span className="text-[11px] font-mono text-slate-400 block pt-0.5">
                Statutory Basis: DPDP Act 2023 Sec 8(2)
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => handleToggle('logistics_sharing', getConsentState('logistics_sharing'))}
              disabled={updatingType === 'logistics_sharing'}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
                getConsentState('logistics_sharing') ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  getConsentState('logistics_sharing') ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

      </div>

      {/* Footer Note */}
      <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
        <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0" />
        <span>
          Every preference toggle is timestamped and immutably appended to your Consent Audit Log below.
        </span>
      </div>

    </div>
  );
};
