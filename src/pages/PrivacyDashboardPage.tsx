import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  KeyRound,
  FileText,
  ShoppingBag,
  History,
  Lock,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { dataService } from '../lib/dataService';
import { ConsentRecord, ConsentAuditLogEntry, PrivacyRequest, MockOrder, OrderItem } from '../types';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConsentPreferencesCard } from '../components/privacy/ConsentPreferencesCard';
import { ConsentAuditLogTable } from '../components/privacy/ConsentAuditLogTable';
import { RequestHistoryList } from '../components/privacy/RequestHistoryList';
import { PrivacyRequestModal } from '../components/privacy/PrivacyRequestModal';
import { DataExportButton } from '../components/privacy/DataExportButton';

export const PrivacyDashboardPage: React.FC = () => {
  const { user, refreshUserProfile } = useAuth();
  const { error } = useNotification();

  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<ConsentAuditLogEntry[]>([]);
  const [requests, setRequests] = useState<PrivacyRequest[]>([]);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [userConsents, userLogs, userRequests, userOrders] = await Promise.all([
        dataService.getConsents(user.id, user),
        dataService.getConsentAuditLogs(user.id, user),
        dataService.getPrivacyRequests(user),
        dataService.getOrders(user),
      ]);

      setConsents(userConsents);
      setAuditLogs(userLogs);
      setRequests(userRequests);
      setOrders(userOrders);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Failed to load privacy dashboard', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Sign In Required</h3>
        <p className="text-xs text-slate-500">
          Please sign in or select a demo persona from the navigation bar to access your personal privacy dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner / User Identity Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-indigo-100">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {user.fullName}
                </h1>
                <Badge variant={user.role === 'admin' ? 'warning' : 'primary'} size="sm">
                  {user.role === 'admin' ? 'Data Protection Officer' : 'Data Principal'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                DPDP Principal ID: <span className="font-mono text-indigo-600">{user.id}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <DataExportButton />

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Exercise DPDP Right</span>
            </button>

            <button
              onClick={() => {
                fetchDashboardData();
                refreshUserProfile();
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Refresh dashboard records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-600">
            <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block">Registered Email:</span>
              <strong className="text-slate-800">{user.email}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600">
            <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block">Primary Contact Phone:</span>
              <strong className="text-slate-800">{user.phone || 'Not provided (Minimized)'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block">Account Established:</span>
              <strong className="text-slate-800">
                {new Date(user.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Retrieving isolated privacy ledger..." />
      ) : (
        <div className="space-y-8">
          
          {/* Section 1: Granular Consent Management */}
          <section>
            <ConsentPreferencesCard
              consents={consents}
              onConsentUpdated={fetchDashboardData}
            />
          </section>

          {/* Section 2: Statutory Privacy Requests & Grievance History */}
          <section>
            <RequestHistoryList
              requests={requests}
              onOpenNewRequest={() => setIsRequestModalOpen(true)}
            />
          </section>

          {/* Section 3: Immutable Consent Audit Log */}
          <section>
            <ConsentAuditLogTable logs={auditLogs} />
          </section>

          {/* Section 4: My Orders & Retained Shipping Details */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Order History & Data Retention Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparent accounting of all purchases and associated postal delivery details.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {orders.length} orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No orders on record for this Data Principal yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 space-y-3 hover:bg-slate-50/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {ord.orderNumber}
                        </span>
                        <Badge variant="success" size="sm">{ord.orderStatus}</Badge>
                        <Badge variant="primary" size="sm">{ord.paymentMethod}</Badge>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Purchased Items:</span>
                        <ul className="space-y-1">
                          {ord.items.map((it: OrderItem, idx: number) => (
                            <li key={idx} className="text-slate-700 flex justify-between">
                              <span>{it.quantity}x {it.productName}</span>
                              <span className="font-semibold">₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="font-bold text-slate-900 pt-1 border-t border-slate-100 mt-1 flex justify-between">
                          <span>Total Paid:</span>
                          <span className="text-indigo-600">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                        <span className="text-[11px] text-slate-500 font-bold block">
                          Shipping Address Used:
                        </span>
                        <p className="text-slate-800">
                          {ord.shippingAddress.fullName}, {ord.shippingAddress.street}, {ord.shippingAddress.city} - {ord.shippingAddress.pincode}
                        </p>
                        <div className="pt-1">
                          <span className="text-[10px] inline-block font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                            Retention: {ord.retainAddressForFutureOrders ? 'Retained per user consent' : 'Ephemeral (Purging 30 days post delivery)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}

      {/* Statutory Privacy Request Modal */}
      <PrivacyRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequestSubmitted={fetchDashboardData}
      />

    </div>
  );
};
