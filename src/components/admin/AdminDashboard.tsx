import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Package,
  FileText,
  Plus,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Users,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { dataService } from '../../lib/dataService';
import { Product, PrivacyRequest, PrivacyRequestStatus } from '../../types';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { RequestReviewModal } from './RequestReviewModal';
import { ProductManagementForm } from './ProductManagementForm';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, switchDemoAccount } = useAuth();
  const { success, error } = useNotification();

  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'products'>('overview');
  const [requests, setRequests] = useState<PrivacyRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedRequest, setSelectedRequest] = useState<PrivacyRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Filters
  const [requestFilter, setRequestFilter] = useState<string>('ALL');

  const fetchData = async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const [reqs, prods] = await Promise.all([
        dataService.getPrivacyRequests(user),
        dataService.getProducts(),
      ]);
      setRequests(reqs);
      setProducts(prods);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Failed to load admin data', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (!isAdmin || !user) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white rounded-2xl border border-rose-200 shadow-lg text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Restricted Area: Data Protection Officer / Administrator Access Only
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
          In accordance with the DPDP Act 2023, access to all Data Principals’ records and grievances is strictly restricted to designated Data Protection Officers.
        </p>
        <div className="pt-2">
          <button
            onClick={() => switchDemoAccount('admin')}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Switch to Admin Persona (Prof. Sharma, DPO)
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to delete ${productName} from the store catalog?`)) {
      try {
        await dataService.deleteProduct(productId, user.role);
        success('Product Deleted', `${productName} removed from catalog.`);
        fetchData();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        error('Delete Failed', msg);
      }
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (requestFilter === 'ALL') return true;
    return r.status === requestFilter;
  });

  const pendingCount = requests.filter((r) => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length;
  const actionedCount = requests.filter((r) => r.status === 'ACTIONED').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="bg-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800 text-purple-200 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DPDP Compliance Oversight Desk</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Administrator & DPO Portal
            </h1>
            <p className="text-xs text-purple-200 max-w-xl">
              Logged in as <strong className="text-white">{user.fullName}</strong>. Review Data Principal requests, enforce 30-day statutory resolution SLAs, and maintain the product registry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 bg-purple-800/80 hover:bg-purple-800 rounded-xl text-purple-200 hover:text-white transition-colors cursor-pointer"
              title="Refresh records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Compliance Metrics
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'border-purple-600 text-purple-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Privacy Requests Desk</span>
          {pendingCount > 0 && (
            <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'border-purple-600 text-purple-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Catalog Management ({products.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading administrative records..." />
      ) : (
        <>
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Total DPDP Requests</span>
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{requests.length}</div>
                  <span className="text-[11px] text-slate-400">Sections 11, 12, 13, 14</span>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-amber-600 text-xs font-semibold">
                    <span>Pending DPO SLA</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
                  <span className="text-[11px] text-slate-400">Active 30-day deadlines</span>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold">
                    <span>Actioned / Resolved</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600">{actionedCount}</div>
                  <span className="text-[11px] text-slate-400">Legally executed</span>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Active Store Products</span>
                    <Package className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{products.length}</div>
                  <span className="text-[11px] text-slate-400">All with DPDP disclosures</span>
                </div>

              </div>

              {/* DPDP Compliance Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Data Fiduciary Statutory Compliance Scorecard
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-medium">Consent Unbundling Rate:</span>
                    <p className="text-xl font-black text-indigo-700">100%</p>
                    <p className="text-[11px] text-slate-500">
                      Marketing consent is never bundled into checkout or registration prerequisites.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-medium">Grievance SLA Compliance:</span>
                    <p className="text-xl font-black text-emerald-700">100%</p>
                    <p className="text-[11px] text-slate-500">
                      All grievances resolved within the statutory 30-day calendar period.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-medium">Data Minimisation Rating:</span>
                    <p className="text-xl font-black text-purple-700">Level 5 (A+)</p>
                    <p className="text-[11px] text-slate-500">
                      Address retention defaults to unchecked; zero device telemetry collected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY REQUESTS DESK */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Data Principal Rights & Grievance Adjudication
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review incoming requests, verify legal grounds, and record official DPO findings.
                  </p>
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {['ALL', 'PENDING', 'UNDER_REVIEW', 'ACTIONED', 'REJECTED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setRequestFilter(st)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        requestFilter === st
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No requests found for filter: {requestFilter}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                        <th className="p-3">Tracking Token</th>
                        <th className="p-3">Data Principal</th>
                        <th className="p-3">Statutory Right</th>
                        <th className="p-3">Subject & Details</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-3 font-mono text-[11px] font-bold text-purple-700">
                            {req.trackingToken}
                          </td>
                          <td className="p-3 text-slate-800">
                            <div className="font-semibold">{req.userName}</div>
                            <div className="text-[11px] text-slate-400">{req.userEmail}</div>
                          </td>
                          <td className="p-3 font-medium text-slate-700">
                            <Badge variant="primary" size="sm">{req.requestType}</Badge>
                          </td>
                          <td className="p-3 text-slate-600 max-w-xs">
                            <p className="font-semibold text-slate-900 truncate">{req.subject}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{req.description}</p>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                req.status === 'ACTIONED'
                                  ? 'success'
                                  : req.status === 'REJECTED'
                                  ? 'danger'
                                  : 'warning'
                              }
                              size="sm"
                            >
                              {req.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setIsReviewModalOpen(true);
                              }}
                              className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Adjudicate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Store Product Registry
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add, edit, or adjust items and configure DPDP Section 5 data disclosures.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Privacy Certification</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-bold text-slate-900 truncate block">{p.name}</span>
                            <span className="text-[11px] text-slate-400 line-clamp-1">
                              {p.dataRequiredDescription}
                            </span>
                          </div>
                        </td>

                        <td className="p-3 text-slate-700 whitespace-nowrap">{p.category}</td>

                        <td className="p-3 font-black text-slate-900 whitespace-nowrap">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>

                        <td className="p-3">
                          <Badge variant={p.inStock ? 'success' : 'danger'} size="sm">
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </td>

                        <td className="p-3">
                          <Badge variant="info" size="sm">{p.privacyBadge}</Badge>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedProduct(p);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </>
      )}

      {/* Review Request Modal */}
      <RequestReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        request={selectedRequest}
        onReviewed={fetchData}
      />

      {/* Product Management Modal */}
      <ProductManagementForm
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={selectedProduct}
        onSaved={fetchData}
      />

    </div>
  );
};
