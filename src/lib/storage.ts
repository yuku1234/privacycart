/**
 * PrivacyCart — Local Demonstration Storage Repository
 * SPPU Third-Year Computer Engineering Project
 * 
 * Provides an in-browser storage store with strict programmatic Row-Level Access Controls
 * to simulate PostgreSQL RLS when Supabase is running in local demonstration mode.
 * 
 * DISCLAIMER:
 * This local mode operates in browser memory & localStorage for academic evaluation.
 * It is clearly labeled as an educational prototype with no claim of production security.
 */

import {
  UserProfile,
  ConsentRecord,
  ConsentAuditLogEntry,
  PrivacyRequest,
  Product,
  MockOrder,
  ConsentType,
  PrivacyRequestType,
  PrivacyRequestStatus,
  UserRole
} from '../types';

import {
  INITIAL_PRODUCTS,
  DEMO_USERS,
  INITIAL_CONSENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PRIVACY_REQUESTS,
  INITIAL_ORDERS
} from './demoData';

const STORAGE_KEYS = {
  USERS: 'privacycart_demo_users',
  PRODUCTS: 'privacycart_demo_products',
  CONSENTS: 'privacycart_demo_consents',
  AUDIT_LOGS: 'privacycart_demo_audit_logs',
  REQUESTS: 'privacycart_demo_privacy_requests',
  ORDERS: 'privacycart_demo_orders',
  CURRENT_USER: 'privacycart_demo_current_user',
};

class LocalDemoStore {
  private users: Record<string, UserProfile & { passwordHash: string }>;
  private products: Product[];
  private consents: ConsentRecord[];
  private auditLogs: ConsentAuditLogEntry[];
  private requests: PrivacyRequest[];
  private orders: MockOrder[];

  constructor() {
    this.users = this.loadFromStorage(STORAGE_KEYS.USERS, DEMO_USERS);
    this.products = this.loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    this.consents = this.loadFromStorage(STORAGE_KEYS.CONSENTS, INITIAL_CONSENTS);
    this.auditLogs = this.loadFromStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.requests = this.loadFromStorage(STORAGE_KEYS.REQUESTS, INITIAL_PRIVACY_REQUESTS);
    this.orders = this.loadFromStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item) {
          return JSON.parse(item) as T;
        }
      }
    } catch {
      // Fallback silently to defaultValue if localStorage access is blocked
    }
    return defaultValue;
  }

  private saveToStorage<T>(key: string, value: T): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.warn('Storage quota exceeded or storage unavailable:', e);
    }
  }

  public resetToDefaults(): void {
    this.users = { ...DEMO_USERS };
    this.products = [...INITIAL_PRODUCTS];
    this.consents = [...INITIAL_CONSENTS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.requests = [...INITIAL_PRIVACY_REQUESTS];
    this.orders = [...INITIAL_ORDERS];

    if (typeof window !== 'undefined' && window.localStorage) {
      Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
    }
  }

  // ==========================================
  // AUTHENTICATION & USERS
  // ==========================================

  public authenticate(email: string, passwordPlain: string): UserProfile {
    const userEntry = Object.values(this.users).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!userEntry) {
      throw new Error('Invalid email or password.');
    }

    if (userEntry.passwordHash !== passwordPlain) {
      throw new Error('Invalid email or password.');
    }

    // Return safe profile without passwordHash
    const { passwordHash: _, ...safeProfile } = userEntry;
    return safeProfile;
  }

  public register(params: {
    fullName: string;
    email: string;
    passwordPlain: string;
    phone?: string;
    marketingConsent: boolean;
  }): UserProfile {
    const existing = Object.values(this.users).find(
      (u) => u.email.toLowerCase() === params.email.toLowerCase()
    );

    if (existing) {
      throw new Error('A Data Principal account with this email address already exists.');
    }

    const newId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newUser: UserProfile & { passwordHash: string } = {
      id: newId,
      email: params.email,
      fullName: params.fullName,
      phone: params.phone,
      role: 'user',
      createdAt: now,
      passwordHash: params.passwordPlain,
    };

    this.users[newId] = newUser;
    this.saveToStorage(STORAGE_KEYS.USERS, this.users);

    // Initialize Default Consents under DPDP Act 2023 Notice & Consent Provisions
    const essentialConsent: ConsentRecord = {
      id: `cst-${Date.now()}-01`,
      userId: newId,
      consentType: 'essential_processing',
      granted: true,
      version: 'v1.0-2023',
      purposeDescription: 'Processing core identity and shipping details strictly for fulfillment under DPDP Section 4(1)(a).',
      legalBasis: 'DPDP Act 2023 Sec 6(1)',
      updatedAt: now,
    };

    const marketingConsent: ConsentRecord = {
      id: `cst-${Date.now()}-02`,
      userId: newId,
      consentType: 'marketing_promotions',
      granted: params.marketingConsent,
      version: 'v1.0-2023',
      purposeDescription: 'Optional promotional discounts, newsletters, and tailored updates.',
      legalBasis: 'DPDP Act 2023 Sec 6(2) Granular Consent',
      updatedAt: now,
    };

    const analyticsConsent: ConsentRecord = {
      id: `cst-${Date.now()}-03`,
      userId: newId,
      consentType: 'analytics_telemetry',
      granted: false, // Default privacy-friendly setting
      version: 'v1.0-2023',
      purposeDescription: 'Anonymous statistical analysis to improve interface stability.',
      legalBasis: 'DPDP Act 2023 Sec 6(2)',
      updatedAt: now,
    };

    const logisticsConsent: ConsentRecord = {
      id: `cst-${Date.now()}-04`,
      userId: newId,
      consentType: 'logistics_sharing',
      granted: true,
      version: 'v1.0-2023',
      purposeDescription: 'Sharing destination address with licensed courier for physical transit.',
      legalBasis: 'DPDP Act 2023 Sec 8(2) Data Processor Agreement',
      updatedAt: now,
    };

    this.consents.push(essentialConsent, marketingConsent, analyticsConsent, logisticsConsent);
    this.saveToStorage(STORAGE_KEYS.CONSENTS, this.consents);

    // Write initial audit log entries
    const essentialAudit: ConsentAuditLogEntry = {
      id: `aud-${Date.now()}-1`,
      userId: newId,
      consentType: 'essential_processing',
      action: 'GRANTED',
      version: 'v1.0-2023',
      timestamp: now,
      ipAddressMasked: '127.0.***.***',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'PrivacyCart-Client',
      rationale: 'Mandatory contractual consent granted at signup.',
    };

    const marketingAudit: ConsentAuditLogEntry = {
      id: `aud-${Date.now()}-2`,
      userId: newId,
      consentType: 'marketing_promotions',
      action: params.marketingConsent ? 'GRANTED' : 'REVOKED',
      version: 'v1.0-2023',
      timestamp: now,
      ipAddressMasked: '127.0.***.***',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'PrivacyCart-Client',
      rationale: params.marketingConsent
        ? 'User opted into marketing communications at signup.'
        : 'Privacy-by-default: user opted out of marketing communications at signup.',
    };

    this.auditLogs.push(essentialAudit, marketingAudit);
    this.saveToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);

    const { passwordHash: _, ...safeProfile } = newUser;
    return safeProfile;
  }

  public getUserById(id: string): UserProfile | null {
    const u = this.users[id] || Object.values(this.users).find((x) => x.id === id);
    if (!u) return null;
    const { passwordHash: _, ...safe } = u;
    return safe;
  }

  // ==========================================
  // PRODUCTS
  // ==========================================

  public getProducts(): Product[] {
    return [...this.products];
  }

  public getProductById(id: string): Product | null {
    return this.products.find((p) => p.id === id) || null;
  }

  public addProduct(product: Omit<Product, 'id'>, requestingRole: UserRole): Product {
    if (requestingRole !== 'admin') {
      throw new Error('Access Denied: Only administrators can add products.');
    }

    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };

    this.products.unshift(newProduct);
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);
    return newProduct;
  }

  public updateProduct(product: Product, requestingRole: UserRole): Product {
    if (requestingRole !== 'admin') {
      throw new Error('Access Denied: Only administrators can update product catalog.');
    }

    const idx = this.products.findIndex((p) => p.id === product.id);
    if (idx === -1) {
      throw new Error('Product not found.');
    }

    this.products[idx] = { ...product };
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);
    return this.products[idx];
  }

  public deleteProduct(productId: string, requestingRole: UserRole): void {
    if (requestingRole !== 'admin') {
      throw new Error('Access Denied: Only administrators can remove products.');
    }

    this.products = this.products.filter((p) => p.id !== productId);
    this.saveToStorage(STORAGE_KEYS.PRODUCTS, this.products);
  }

  // ==========================================
  // CONSENT MANAGEMENT & AUDIT LOGS
  // ==========================================

  /**
   * Retrieves consents for a specific user.
   * Strictly verifies that requesting user matches the requested userId or is an admin.
   */
  public getConsents(targetUserId: string, requestingUserId: string, requestingRole: UserRole): ConsentRecord[] {
    if (requestingRole !== 'admin' && requestingUserId !== targetUserId) {
      throw new Error('Privacy Violation: Cannot access another Data Principal’s consent state.');
    }

    return this.consents.filter((c) => c.userId === targetUserId);
  }

  /**
   * Updates a user's consent preference.
   * Automatically records an immutable entry into the Consent Audit Log under DPDP Sec 6(4).
   */
  public updateConsentPreference(
    userId: string,
    consentType: ConsentType,
    granted: boolean,
    rationale?: string
  ): ConsentRecord {
    const existing = this.consents.find(
      (c) => c.userId === userId && c.consentType === consentType
    );

    const now = new Date().toISOString();

    if (consentType === 'essential_processing' && !granted) {
      throw new Error(
        'Essential processing consent is required for basic e-commerce operation. If you wish to terminate processing, please file an Erasure Request under Section 12(2).'
      );
    }

    let updatedRecord: ConsentRecord;

    if (existing) {
      existing.granted = granted;
      existing.updatedAt = now;
      updatedRecord = { ...existing };
    } else {
      updatedRecord = {
        id: `cst-${Date.now()}`,
        userId,
        consentType,
        granted,
        version: 'v1.0-2023',
        purposeDescription: `User updated consent for ${consentType}`,
        legalBasis: 'DPDP Act 2023 Sec 6',
        updatedAt: now,
      };
      this.consents.push(updatedRecord);
    }

    this.saveToStorage(STORAGE_KEYS.CONSENTS, this.consents);

    // Append to Consent Audit Log
    const auditEntry: ConsentAuditLogEntry = {
      id: `aud-${Date.now()}`,
      userId,
      consentType,
      action: granted ? 'GRANTED' : 'REVOKED',
      version: updatedRecord.version,
      timestamp: now,
      ipAddressMasked: '127.0.***.***',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'PrivacyCart-Client',
      rationale: rationale || `Preference updated by Data Principal via Privacy Dashboard.`,
    };

    this.auditLogs.unshift(auditEntry);
    this.saveToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);

    return updatedRecord;
  }

  public getConsentAuditLogs(
    targetUserId: string,
    requestingUserId: string,
    requestingRole: UserRole
  ): ConsentAuditLogEntry[] {
    if (requestingRole !== 'admin' && requestingUserId !== targetUserId) {
      throw new Error('Privacy Violation: Cannot access another Data Principal’s consent audit logs.');
    }

    return this.auditLogs.filter((l) => l.userId === targetUserId);
  }

  // ==========================================
  // PRIVACY REQUESTS & GRIEVANCES (DPDP SECTIONS 11-14)
  // ==========================================

  /**
   * Enforces strict Isolation:
   * Non-admins ONLY see their own requests.
   * Admins (DPO) can view all requests across users.
   */
  public getPrivacyRequests(
    requestingUserId: string,
    requestingRole: UserRole
  ): PrivacyRequest[] {
    if (requestingRole === 'admin') {
      return [...this.requests];
    }
    return this.requests.filter((r) => r.userId === requestingUserId);
  }

  public createPrivacyRequest(params: {
    userId: string;
    userEmail: string;
    userName: string;
    requestType: PrivacyRequestType;
    subject: string;
    description: string;
    requestedFields?: string[];
    newValueRequested?: string;
  }): PrivacyRequest {
    const now = new Date().toISOString();
    const tokenSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const trackingToken = `DPDP-2026-${params.requestType.substring(0, 3)}-${tokenSuffix}`;

    const newRequest: PrivacyRequest = {
      id: `req-${Date.now()}`,
      trackingToken,
      userId: params.userId,
      userEmail: params.userEmail,
      userName: params.userName,
      requestType: params.requestType,
      status: 'PENDING',
      subject: params.subject,
      description: params.description,
      requestedFields: params.requestedFields,
      newValueRequested: params.newValueRequested,
      createdAt: now,
      updatedAt: now,
      slaDeadlineDays: 30, // Mandated 30-day statutory response window
    };

    this.requests.unshift(newRequest);
    this.saveToStorage(STORAGE_KEYS.REQUESTS, this.requests);
    return newRequest;
  }

  public updatePrivacyRequestByDPO(
    requestId: string,
    requestingRole: UserRole,
    reviewerName: string,
    status: PrivacyRequestStatus,
    adminResponse: string
  ): PrivacyRequest {
    if (requestingRole !== 'admin') {
      throw new Error('Unauthorized: Only designated Data Protection Officers can adjudicate privacy requests.');
    }

    const req = this.requests.find((r) => r.id === requestId);
    if (!req) {
      throw new Error('Privacy request not found.');
    }

    req.status = status;
    req.adminResponse = adminResponse;
    req.reviewedBy = reviewerName;
    req.updatedAt = new Date().toISOString();

    // If an erasure request is actioned, simulate data anonymization on user profile & optional records
    if (req.requestType === 'ERASURE' && status === 'ACTIONED') {
      this.anonymizeUserData(req.userId);
    }

    // If a correction request is actioned and newValueRequested is provided
    if (req.requestType === 'CORRECTION' && status === 'ACTIONED' && req.requestedFields && req.newValueRequested) {
      const user = this.users[req.userId] || Object.values(this.users).find((x) => x.id === req.userId);
      if (user) {
        if (req.requestedFields.includes('phone')) {
          user.phone = req.newValueRequested;
        }
        if (req.requestedFields.includes('fullName')) {
          user.fullName = req.newValueRequested;
        }
        this.saveToStorage(STORAGE_KEYS.USERS, this.users);
      }
    }

    this.saveToStorage(STORAGE_KEYS.REQUESTS, this.requests);
    return { ...req };
  }

  private anonymizeUserData(userId: string): void {
    const user = this.users[userId] || Object.values(this.users).find((x) => x.id === userId);
    if (user) {
      user.fullName = 'Data Principal (Anonymized per DPDP Sec 12(2))';
      user.phone = '+91 **********';
      this.saveToStorage(STORAGE_KEYS.USERS, this.users);
    }

    // Revoke all optional consents
    this.consents
      .filter((c) => c.userId === userId && c.consentType !== 'essential_processing')
      .forEach((c) => {
        c.granted = false;
        c.updatedAt = new Date().toISOString();
      });
    this.saveToStorage(STORAGE_KEYS.CONSENTS, this.consents);
  }

  // ==========================================
  // ORDERS & MOCK CHECKOUT
  // ==========================================

  public getOrders(requestingUserId: string, requestingRole: UserRole): MockOrder[] {
    if (requestingRole === 'admin') {
      return [...this.orders];
    }
    return this.orders.filter((o) => o.userId === requestingUserId);
  }

  public createOrder(params: {
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
  }): MockOrder {
    const now = new Date().toISOString();
    const orderNumber = `PC-2026-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: MockOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: params.userId,
      userEmail: params.userEmail,
      items: params.items,
      totalAmount: params.totalAmount,
      shippingAddress: params.shippingAddress,
      retainAddressForFutureOrders: params.retainAddressForFutureOrders,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'MOCK_COD' ? 'PENDING_MOCK' : 'PAID_MOCK',
      orderStatus: 'CONFIRMED',
      createdAt: now,
    };

    this.orders.unshift(newOrder);
    this.saveToStorage(STORAGE_KEYS.ORDERS, this.orders);
    return newOrder;
  }

  // ==========================================
  // DPDP SECTION 11 — DATA PORTABILITY / EXPORT
  // ==========================================

  public exportDataPrincipalDossier(userId: string): {
    exportedAt: string;
    legalBasis: string;
    dataPrincipal: UserProfile | null;
    activeConsents: ConsentRecord[];
    consentAuditTrail: ConsentAuditLogEntry[];
    privacyRequests: PrivacyRequest[];
    orderHistory: MockOrder[];
  } {
    const user = this.getUserById(userId);
    const consents = this.consents.filter((c) => c.userId === userId);
    const auditLogs = this.auditLogs.filter((l) => l.userId === userId);
    const requests = this.requests.filter((r) => r.userId === userId);
    const orders = this.orders.filter((o) => o.userId === userId);

    return {
      exportedAt: new Date().toISOString(),
      legalBasis: 'Section 11 Digital Personal Data Protection Act, 2023 (Right to Access Information About Personal Data)',
      dataPrincipal: user,
      activeConsents: consents,
      consentAuditTrail: auditLogs,
      privacyRequests: requests,
      orderHistory: orders,
    };
  }
}

export const localStore = new LocalDemoStore();
