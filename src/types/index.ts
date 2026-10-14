/**
 * PrivacyCart — Type Definitions
 * SPPU Third-Year Computer Engineering Project
 * Aligned with India Digital Personal Data Protection (DPDP) Act, 2023
 */

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export type ConsentType = 'essential_processing' | 'marketing_promotions' | 'analytics_telemetry' | 'logistics_sharing';

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: ConsentType;
  granted: boolean;
  version: string; // e.g. "v1.2-2023"
  purposeDescription: string;
  legalBasis: string; // e.g. "Section 6(1) DPDP Act 2023" or "Section 4(1)(a)"
  updatedAt: string;
}

export interface ConsentAuditLogEntry {
  id: string;
  userId: string;
  consentType: ConsentType;
  action: 'GRANTED' | 'REVOKED';
  version: string;
  timestamp: string;
  ipAddressMasked: string;
  userAgent: string;
  rationale?: string;
}

export type PrivacyRequestType = 
  | 'ACCESS_DATA'        // DPDP Section 11 - Right to access information
  | 'CORRECTION'          // DPDP Section 12(1) - Right to correction and updating
  | 'ERASURE'             // DPDP Section 12(2) - Right to erasure / Right to be forgotten
  | 'GRIEVANCE'           // DPDP Section 13 - Right of grievance redressal
  | 'NOMINATION';         // DPDP Section 14 - Right to nominate

export type PrivacyRequestStatus = 'PENDING' | 'UNDER_REVIEW' | 'ACTIONED' | 'REJECTED';

export interface PrivacyRequest {
  id: string;
  trackingToken: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestType: PrivacyRequestType;
  status: PrivacyRequestStatus;
  subject: string;
  description: string;
  requestedFields?: string[]; // e.g. ["phone", "shipping_address"] for correction
  newValueRequested?: string;
  adminResponse?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadlineDays: number; // Standard 30 days under DPDP rules
}

export interface Product {
  id: string;
  name: string;
  category: 'Privacy Hardware' | 'Security Devices' | 'Books & Guides' | 'Everyday Tech' | 'Software Licenses';
  price: number; // in INR (₹)
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  imageUrl: string;
  privacyBadge: 'Minimal Data' | 'Zero Telemetry' | 'Encrypted' | 'Open Source';
  dataRequiredDescription: string; // DPDP Itemised Disclosure for this product
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  retainAddressForFutureOrders: boolean; // DPDP Data Minimisation toggle
  paymentMethod: 'MOCK_UPI' | 'MOCK_COD' | 'MOCK_NETBANKING';
  paymentStatus: 'PAID_MOCK' | 'PENDING_MOCK';
  orderStatus: 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  createdAt: string;
}

export interface PrivacyNoticeSection {
  id: string;
  dataCategory: string;
  specificDataItems: string[];
  purpose: string;
  dpdpSection: string;
  retentionPeriod: string;
  recipientOrProcessor: string;
}
