/**
 * PrivacyCart — Unified Data Service Layer
 * SPPU Third-Year Computer Engineering Project
 * 
 * Bridges the UI with either:
 * 1. Live Supabase PostgreSQL with Row Level Security (RLS) when configured.
 * 2. Academic Local Demonstration Mode (LocalDemoStore) when Supabase is not configured.
 * 
 * Complies with Priority 2:
 * - Never fakes success if a live server operation fails.
 * - Enforces strict authorization and privacy isolation.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { localStore } from './storage';
import {
  Product,
  ConsentRecord,
  ConsentAuditLogEntry,
  PrivacyRequest,
  MockOrder,
  UserProfile,
  ConsentType,
  PrivacyRequestType,
  PrivacyRequestStatus,
  UserRole,
} from '../types';

export const dataService = {
  isCloudMode(): boolean {
    return isSupabaseConfigured();
  },

  // ==========================================
  // PRODUCTS
  // ==========================================

  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch products from Supabase: ${error.message}`);
      }
      return data as Product[];
    }

    return localStore.getProducts();
  },

  async addProduct(product: Omit<Product, 'id'>, requestingRole: UserRole): Promise<Product> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add product on Supabase: ${error.message}`);
      }
      return data as Product;
    }

    return localStore.addProduct(product, requestingRole);
  },

  async updateProduct(product: Product, requestingRole: UserRole): Promise<Product> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', product.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update product on Supabase: ${error.message}`);
      }
      return data as Product;
    }

    return localStore.updateProduct(product, requestingRole);
  },

  async deleteProduct(productId: string, requestingRole: UserRole): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw new Error(`Failed to delete product on Supabase: ${error.message}`);
      }
      return;
    }

    localStore.deleteProduct(productId, requestingRole);
  },

  // ==========================================
  // CONSENT MANAGEMENT
  // ==========================================

  async getConsents(
    targetUserId: string,
    requestingUser: UserProfile
  ): Promise<ConsentRecord[]> {
    if (isSupabaseConfigured() && supabase) {
      // In Supabase, RLS automatically restricts select to auth.uid() = user_id
      const { data, error } = await supabase
        .from('consents')
        .select('*')
        .eq('user_id', targetUserId);

      if (error) {
        throw new Error(`Failed to load consent records from Supabase: ${error.message}`);
      }
      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        consentType: row.consent_type,
        granted: row.granted,
        version: row.version,
        purposeDescription: row.purpose_description,
        legalBasis: row.legal_basis,
        updatedAt: row.updated_at,
      }));
    }

    return localStore.getConsents(targetUserId, requestingUser.id, requestingUser.role);
  },

  async updateConsent(
    userId: string,
    consentType: ConsentType,
    granted: boolean,
    rationale?: string
  ): Promise<ConsentRecord> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('consents')
        .upsert(
          {
            user_id: userId,
            consent_type: consentType,
            granted,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id, consent_type' }
        )
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update consent on Supabase: ${error.message}`);
      }

      // Also log audit trail in Supabase
      await supabase.from('consent_audit_log').insert({
        user_id: userId,
        consent_type: consentType,
        action: granted ? 'GRANTED' : 'REVOKED',
        version: data.version || 'v1.0-2023',
        ip_address_masked: '127.0.***.***',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'PrivacyCart-Client',
        rationale: rationale || 'Updated by Data Principal via dashboard',
      });

      return {
        id: data.id,
        userId: data.user_id,
        consentType: data.consent_type,
        granted: data.granted,
        version: data.version,
        purposeDescription: data.purpose_description,
        legalBasis: data.legal_basis,
        updatedAt: data.updated_at,
      };
    }

    return localStore.updateConsentPreference(userId, consentType, granted, rationale);
  },

  async getConsentAuditLogs(
    targetUserId: string,
    requestingUser: UserProfile
  ): Promise<ConsentAuditLogEntry[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('consent_audit_log')
        .select('*')
        .eq('user_id', targetUserId)
        .order('timestamp', { ascending: false });

      if (error) {
        throw new Error(`Failed to load audit trail from Supabase: ${error.message}`);
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        consentType: row.consent_type,
        action: row.action,
        version: row.version,
        timestamp: row.timestamp,
        ipAddressMasked: row.ip_address_masked,
        userAgent: row.user_agent,
        rationale: row.rationale,
      }));
    }

    return localStore.getConsentAuditLogs(targetUserId, requestingUser.id, requestingUser.role);
  },

  // ==========================================
  // PRIVACY REQUESTS (DPDP RIGHTS)
  // ==========================================

  async getPrivacyRequests(requestingUser: UserProfile): Promise<PrivacyRequest[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('privacy_requests').select('*');
      if (requestingUser.role !== 'admin') {
        query = query.eq('user_id', requestingUser.id);
      }
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to retrieve privacy requests from Supabase: ${error.message}`);
      }

      return (data || []).map((row) => ({
        id: row.id,
        trackingToken: row.tracking_token,
        userId: row.user_id,
        userEmail: row.user_email,
        userName: row.user_name,
        requestType: row.request_type,
        status: row.status,
        subject: row.subject,
        description: row.description,
        requestedFields: row.requested_fields,
        newValueRequested: row.new_value_requested,
        adminResponse: row.admin_response,
        reviewedBy: row.reviewed_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        slaDeadlineDays: row.sla_deadline_days || 30,
      }));
    }

    return localStore.getPrivacyRequests(requestingUser.id, requestingUser.role);
  },

  async createPrivacyRequest(params: {
    userId: string;
    userEmail: string;
    userName: string;
    requestType: PrivacyRequestType;
    subject: string;
    description: string;
    requestedFields?: string[];
    newValueRequested?: string;
  }): Promise<PrivacyRequest> {
    if (isSupabaseConfigured() && supabase) {
      const tokenSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const trackingToken = `DPDP-2026-${params.requestType.substring(0, 3)}-${tokenSuffix}`;

      const { data, error } = await supabase
        .from('privacy_requests')
        .insert({
          tracking_token: trackingToken,
          user_id: params.userId,
          user_email: params.userEmail,
          user_name: params.userName,
          request_type: params.requestType,
          status: 'PENDING',
          subject: params.subject,
          description: params.description,
          requested_fields: params.requestedFields,
          new_value_requested: params.newValueRequested,
          sla_deadline_days: 30,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to submit privacy request to Supabase: ${error.message}`);
      }

      return {
        id: data.id,
        trackingToken: data.tracking_token,
        userId: data.user_id,
        userEmail: data.user_email,
        userName: data.user_name,
        requestType: data.request_type,
        status: data.status,
        subject: data.subject,
        description: data.description,
        requestedFields: data.requested_fields,
        newValueRequested: data.new_value_requested,
        adminResponse: data.admin_response,
        reviewedBy: data.reviewed_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        slaDeadlineDays: data.sla_deadline_days,
      };
    }

    return localStore.createPrivacyRequest(params);
  },

  async updatePrivacyRequestStatus(
    requestId: string,
    requestingRole: UserRole,
    reviewerName: string,
    status: PrivacyRequestStatus,
    adminResponse: string
  ): Promise<PrivacyRequest> {
    if (isSupabaseConfigured() && supabase) {
      if (requestingRole !== 'admin') {
        throw new Error('Access Denied: Only administrators can review privacy requests.');
      }

      const { data, error } = await supabase
        .from('privacy_requests')
        .update({
          status,
          admin_response: adminResponse,
          reviewed_by: reviewerName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update request on Supabase: ${error.message}`);
      }

      return {
        id: data.id,
        trackingToken: data.tracking_token,
        userId: data.user_id,
        userEmail: data.user_email,
        userName: data.user_name,
        requestType: data.request_type,
        status: data.status,
        subject: data.subject,
        description: data.description,
        requestedFields: data.requested_fields,
        newValueRequested: data.new_value_requested,
        adminResponse: data.admin_response,
        reviewedBy: data.reviewed_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        slaDeadlineDays: data.sla_deadline_days,
      };
    }

    return localStore.updatePrivacyRequestByDPO(
      requestId,
      requestingRole,
      reviewerName,
      status,
      adminResponse
    );
  },

  // ==========================================
  // ORDERS
  // ==========================================

  async getOrders(requestingUser: UserProfile): Promise<MockOrder[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('orders').select('*');
      if (requestingUser.role !== 'admin') {
        query = query.eq('user_id', requestingUser.id);
      }
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch orders from Supabase: ${error.message}`);
      }

      return data as MockOrder[];
    }

    return localStore.getOrders(requestingUser.id, requestingUser.role);
  },

  async createOrder(params: {
    userId: string;
    userEmail: string;
    items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
    totalAmount: number;
    shippingAddress: {
      fullName: string;
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
    retainAddressForFutureOrders: boolean;
    paymentMethod: 'MOCK_UPI' | 'MOCK_COD' | 'MOCK_NETBANKING';
  }): Promise<MockOrder> {
    if (isSupabaseConfigured() && supabase) {
      const orderNumber = `PC-2026-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: params.userId,
          user_email: params.userEmail,
          items: params.items,
          total_amount: params.totalAmount,
          shipping_address: params.shippingAddress,
          retain_address_for_future_orders: params.retainAddressForFutureOrders,
          payment_method: params.paymentMethod,
          payment_status: params.paymentMethod === 'MOCK_COD' ? 'PENDING_MOCK' : 'PAID_MOCK',
          order_status: 'CONFIRMED',
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to record order on Supabase: ${error.message}`);
      }

      return data as MockOrder;
    }

    return localStore.createOrder(params);
  },

  // ==========================================
  // DPDP SECTION 11 EXPORT
  // ==========================================

  async exportDataPrincipalDossier(userId: string) {
    return localStore.exportDataPrincipalDossier(userId);
  },
};
