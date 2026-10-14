/**
 * PrivacyCart — Realistic Academic Demonstration Seed Data
 * SPPU Third-Year Computer Engineering Project
 * DPDP Act 2023 Aligned
 */

import { Product, UserProfile, ConsentRecord, ConsentAuditLogEntry, PrivacyRequest, PrivacyNoticeSection, MockOrder } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'SecureKey FIDO2 / U2F Hardware Token',
    category: 'Security Devices',
    price: 2499,
    description: 'Hardware authentication token providing phishing-resistant multi-factor authentication for web accounts. Operates locally with zero cloud telemetry.',
    features: ['FIDO2 & WebAuthn Compliant', 'NFC + USB-C Interface', 'Tamper-Evident Casing', 'Zero Telemetry'],
    inStock: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    privacyBadge: 'Zero Telemetry',
    dataRequiredDescription: 'Requires only postal delivery address and contact name for shipping. Device operates entirely offline without telemetry or account registration.',
  },
  {
    id: 'prod-002',
    name: 'AegisShield Webcam & Mic Blocker Kit (5-Pack)',
    category: 'Privacy Hardware',
    price: 499,
    description: 'Physical sliding webcam covers with ultra-thin adhesive profile, plus 3.5mm microphone sound-blockers to physically eliminate unwanted audio interception.',
    features: ['Physical Optical Shutter', '0.7mm Ultra-Thin', 'Fits Laptops & Mobiles', 'Microphone Jack Blocker Included'],
    inStock: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=600&q=80',
    privacyBadge: 'Minimal Data',
    dataRequiredDescription: 'Standard physical dispatch data only. No firmware, serial tracking, or internet connectivity required.',
  },
  {
    id: 'prod-003',
    name: 'VaultLeather RFID-Shielded Minimalist Wallet',
    category: 'Privacy Hardware',
    price: 1299,
    description: 'Aerospace-grade electromagnetic shielding lining prevents unauthorized contactless NFC skimming of bank cards and government IDs.',
    features: ['13.56 MHz RFID Shielding', 'Holds 8 Cards + Cash', 'Carbon Fiber & Vegan Leather', 'Tested Against Skimmers'],
    inStock: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    privacyBadge: 'Minimal Data',
    dataRequiredDescription: 'Requires shipping coordinates for physical transit. No digital identifiers or telemetry collected.',
  },
  {
    id: 'prod-004',
    name: 'SPPU DPDP Act 2023 Handbook & Implementation Guide',
    category: 'Books & Guides',
    price: 750,
    description: 'Academic reference book compiled by legal-tech scholars on implementing technical safeguards, Data Fiduciary obligations, and Data Principal rights in modern Indian web architectures.',
    features: ['Comprehensive Act Analysis', 'Checklists for Engineers', 'Penalties & Tribunal Precedents', 'Full Text of DPDP 2023'],
    inStock: true,
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    privacyBadge: 'Minimal Data',
    dataRequiredDescription: 'Shipping address and email for tax receipt under Indian GST Act regulations.',
  },
  {
    id: 'prod-005',
    name: 'CipherDrive 128GB Hardware Encrypted USB 3.2',
    category: 'Security Devices',
    price: 3899,
    description: 'Alphanumeric keypad PIN-authenticated flash drive with military-grade XTS-AES 256-bit hardware encryption. Self-destructs data after 10 failed PIN attempts.',
    features: ['Military-Grade XTS-AES 256', 'Onboard Alphanumeric Keypad', 'OS & Host Independent', 'Brute-force Self-Wipe Protection'],
    inStock: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
    privacyBadge: 'Encrypted',
    dataRequiredDescription: 'Shipping name and address required. Device uses completely offline firmware; zero device telemetry or registration required.',
  },
  {
    id: 'prod-006',
    name: 'PrivacyFilter 15.6" Anti-Spy Micro-Louver Laptop Screen',
    category: 'Privacy Hardware',
    price: 1599,
    description: 'Polarizing micro-louver technology restricts viewing angle to +/- 30 degrees, preventing shoulder surfing and visual eavesdropping in cafes, flights, and labs.',
    features: ['+/- 30 Degree View Angle', 'Anti-Glare Matte Coating', 'Blue Light Reduction (35%)', 'Reversible Glossy/Matte Finish'],
    inStock: true,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    privacyBadge: 'Minimal Data',
    dataRequiredDescription: 'Standard courier delivery details required.',
  },
  {
    id: 'prod-007',
    name: 'SignalProof Faraday Bag for Smartphones & Car Keys',
    category: 'Privacy Hardware',
    price: 899,
    description: 'Double-layer specialized RF shielding cloth blocks Cellular, 5G, GPS, Bluetooth, Wi-Fi, and RFID signals to prevent remote tracking and keyless relay theft.',
    features: ['Blocks 100MHz - 40GHz', 'Double Roll-and-Velcro Seal', 'Water-Resistant Outer Nylon', 'Dual Pocket Design'],
    inStock: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80',
    privacyBadge: 'Zero Telemetry',
    dataRequiredDescription: 'Physical delivery address only. Passive device with no digital communication capabilities.',
  },
  {
    id: 'prod-008',
    name: 'Encrypted Email & Secure Cloud Sync (1-Year Pass)',
    category: 'Software Licenses',
    price: 1999,
    description: 'Zero-knowledge end-to-end encrypted email and cloud storage subscription voucher. Delivered digitally via verified email code.',
    features: ['Zero-Knowledge Storage (500GB)', 'Custom Domain Support', 'End-to-End PGP Compatible', 'Servers Hosted in Strict Privacy Jurisdiction'],
    inStock: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    privacyBadge: 'Encrypted',
    dataRequiredDescription: 'Digital delivery requires only your registered email address. No physical address or mobile phone number required.',
  }
];

export const DEMO_USERS: Record<string, UserProfile & { passwordHash: string }> = {
  'user-alice': {
    id: 'usr-alice-101',
    email: 'alice@student.sppu.ac.in',
    fullName: 'Alice Kulkarni',
    phone: '+91 98220 12345',
    role: 'user',
    createdAt: '2026-09-15T10:00:00Z',
    passwordHash: 'demo_password_123'
  },
  'user-bob': {
    id: 'usr-bob-202',
    email: 'bob@student.sppu.ac.in',
    fullName: 'Bob Deshmukh',
    phone: '+91 98221 67890',
    role: 'user',
    createdAt: '2026-10-01T14:30:00Z',
    passwordHash: 'demo_password_123'
  },
  'admin-sharma': {
    id: 'adm-sharma-999',
    email: 'dpo.sharma@sppu.ac.in',
    fullName: 'Prof. Aniruddha Sharma (DPO)',
    phone: '+91 98229 99999',
    role: 'admin',
    createdAt: '2026-08-01T09:00:00Z',
    passwordHash: 'admin_password_456'
  }
};

export const INITIAL_CONSENTS: ConsentRecord[] = [
  // Alice's Consents
  {
    id: 'cst-alice-01',
    userId: 'usr-alice-101',
    consentType: 'essential_processing',
    granted: true,
    version: 'v1.0-2023',
    purposeDescription: 'Processing core identity, shipping address, and order records necessary to deliver purchased goods under Section 4(1)(a) contract execution.',
    legalBasis: 'DPDP Act 2023 Sec 6(1) & Sec 4(1)(a)',
    updatedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'cst-alice-02',
    userId: 'usr-alice-101',
    consentType: 'marketing_promotions',
    granted: false, // Explicitly opted out by default
    version: 'v1.0-2023',
    purposeDescription: 'Sending optional marketing newsletters, promotional discounts, and custom recommendations via email or SMS.',
    legalBasis: 'DPDP Act 2023 Sec 6(2) Optional Granular Consent',
    updatedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'cst-alice-03',
    userId: 'usr-alice-101',
    consentType: 'analytics_telemetry',
    granted: false,
    version: 'v1.0-2023',
    purposeDescription: 'Anonymous statistical analysis of shopping cart drop-offs to improve website usability.',
    legalBasis: 'DPDP Act 2023 Sec 6(2) Optional Granular Consent',
    updatedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'cst-alice-04',
    userId: 'usr-alice-101',
    consentType: 'logistics_sharing',
    granted: true,
    version: 'v1.0-2023',
    purposeDescription: 'Sharing delivery address and phone number with third-party courier partner (e.g., India Post / BlueDart) solely for package transit.',
    legalBasis: 'DPDP Act 2023 Sec 8(2) Data Processor Engagement',
    updatedAt: '2026-09-15T10:00:00Z'
  },

  // Bob's Consents
  {
    id: 'cst-bob-01',
    userId: 'usr-bob-202',
    consentType: 'essential_processing',
    granted: true,
    version: 'v1.0-2023',
    purposeDescription: 'Processing core identity and shipping address for contractual fulfillment.',
    legalBasis: 'DPDP Act 2023 Sec 6(1)',
    updatedAt: '2026-10-01T14:30:00Z'
  },
  {
    id: 'cst-bob-02',
    userId: 'usr-bob-202',
    consentType: 'marketing_promotions',
    granted: true, // Bob opted in to test differences
    version: 'v1.0-2023',
    purposeDescription: 'Sending optional marketing newsletters.',
    legalBasis: 'DPDP Act 2023 Sec 6(2)',
    updatedAt: '2026-10-02T11:15:00Z'
  },
  {
    id: 'cst-bob-03',
    userId: 'usr-bob-202',
    consentType: 'analytics_telemetry',
    granted: false,
    version: 'v1.0-2023',
    purposeDescription: 'Anonymous performance analytics.',
    legalBasis: 'DPDP Act 2023 Sec 6(2)',
    updatedAt: '2026-10-01T14:30:00Z'
  },
  {
    id: 'cst-bob-04',
    userId: 'usr-bob-202',
    consentType: 'logistics_sharing',
    granted: true,
    version: 'v1.0-2023',
    purposeDescription: 'Sharing dispatch address with courier partner.',
    legalBasis: 'DPDP Act 2023 Sec 8(2)',
    updatedAt: '2026-10-01T14:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: ConsentAuditLogEntry[] = [
  {
    id: 'aud-001',
    userId: 'usr-alice-101',
    consentType: 'essential_processing',
    action: 'GRANTED',
    version: 'v1.0-2023',
    timestamp: '2026-09-15T10:00:00Z',
    ipAddressMasked: '103.21.***.***',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    rationale: 'Initial user registration and agreement to essential terms.'
  },
  {
    id: 'aud-002',
    userId: 'usr-alice-101',
    consentType: 'marketing_promotions',
    action: 'REVOKED',
    version: 'v1.0-2023',
    timestamp: '2026-09-15T10:00:00Z',
    ipAddressMasked: '103.21.***.***',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    rationale: 'Privacy-by-default unbundled preference unselected by user at registration.'
  },
  {
    id: 'aud-003',
    userId: 'usr-bob-202',
    consentType: 'marketing_promotions',
    action: 'GRANTED',
    version: 'v1.0-2023',
    timestamp: '2026-10-02T11:15:00Z',
    ipAddressMasked: '14.139.***.***',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Firefox/130.0',
    rationale: 'User opted into promotional notifications from Privacy Dashboard.'
  }
];

export const INITIAL_PRIVACY_REQUESTS: PrivacyRequest[] = [
  {
    id: 'req-001',
    trackingToken: 'DPDP-2026-AC101-01',
    userId: 'usr-alice-101',
    userEmail: 'alice@student.sppu.ac.in',
    userName: 'Alice Kulkarni',
    requestType: 'ACCESS_DATA',
    status: 'ACTIONED',
    subject: 'Request for Summary of Personal Data Processed & Third Parties',
    description: 'Pursuant to Section 11 of the DPDP Act 2023, please provide an itemised breakdown of all personal data held and identities of logistics processors.',
    adminResponse: 'Completed. Data Principal report generated and provided via Privacy Dashboard Download Portal. Fiduciary confirms sharing limited strictly to India Post SpeedPost.',
    reviewedBy: 'Prof. Aniruddha Sharma (DPO)',
    createdAt: '2026-09-20T11:30:00Z',
    updatedAt: '2026-09-21T16:00:00Z',
    slaDeadlineDays: 30
  },
  {
    id: 'req-002',
    trackingToken: 'DPDP-2026-AC101-02',
    userId: 'usr-alice-101',
    userEmail: 'alice@student.sppu.ac.in',
    userName: 'Alice Kulkarni',
    requestType: 'CORRECTION',
    status: 'PENDING',
    subject: 'Correction of Primary Contact Phone Number',
    description: 'Under Section 12(1) DPDP Act 2023, requesting update of primary contact phone number to +91 98220 99887 due to SIM replacement.',
    requestedFields: ['phone'],
    newValueRequested: '+91 98220 99887',
    createdAt: '2026-10-12T09:15:00Z',
    updatedAt: '2026-10-12T09:15:00Z',
    slaDeadlineDays: 30
  },
  {
    id: 'req-003',
    trackingToken: 'DPDP-2026-BB202-01',
    userId: 'usr-bob-202',
    userEmail: 'bob@student.sppu.ac.in',
    userName: 'Bob Deshmukh',
    requestType: 'GRIEVANCE',
    status: 'UNDER_REVIEW',
    subject: 'Grievance regarding promotional email received after partial opt-out',
    description: 'Filed under Section 13 DPDP Act 2023. Received marketing email 2 hours after modifying preferences. Requesting verification of unsubscribe webhook latency.',
    adminResponse: 'Grievance logged under ticket #GRV-409. Investigating cache propagation delay across replica read-nodes.',
    reviewedBy: 'Prof. Aniruddha Sharma (DPO)',
    createdAt: '2026-10-11T15:20:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
    slaDeadlineDays: 30
  }
];

export const INITIAL_ORDERS: MockOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: 'PC-2026-ORD-9021',
    userId: 'usr-alice-101',
    userEmail: 'alice@student.sppu.ac.in',
    items: [
      {
        productId: 'prod-001',
        productName: 'SecureKey FIDO2 / U2F Hardware Token',
        quantity: 1,
        unitPrice: 2499
      },
      {
        productId: 'prod-002',
        productName: 'AegisShield Webcam & Mic Blocker Kit (5-Pack)',
        quantity: 1,
        unitPrice: 499
      }
    ],
    totalAmount: 2998,
    shippingAddress: {
      fullName: 'Alice Kulkarni',
      street: 'Hostel No. 4, Savitribai Phule Pune University Campus, Ganeshkhind',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411007'
    },
    retainAddressForFutureOrders: false, // Privacy-conscious choice
    paymentMethod: 'MOCK_UPI',
    paymentStatus: 'PAID_MOCK',
    orderStatus: 'DELIVERED',
    createdAt: '2026-09-18T14:20:00Z'
  },
  {
    id: 'ord-2001',
    orderNumber: 'PC-2026-ORD-9450',
    userId: 'usr-bob-202',
    userEmail: 'bob@student.sppu.ac.in',
    items: [
      {
        productId: 'prod-005',
        productName: 'CipherDrive 128GB Hardware Encrypted USB 3.2',
        quantity: 1,
        unitPrice: 3899
      }
    ],
    totalAmount: 3899,
    shippingAddress: {
      fullName: 'Bob Deshmukh',
      street: 'Flat 302, Green Acre Heights, Senapati Bapat Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411016'
    },
    retainAddressForFutureOrders: true,
    paymentMethod: 'MOCK_COD',
    paymentStatus: 'PENDING_MOCK',
    orderStatus: 'DISPATCHED',
    createdAt: '2026-10-05T16:45:00Z'
  }
];

export const PRIVACY_NOTICE_TABLE: PrivacyNoticeSection[] = [
  {
    id: 'notice-sec-1',
    dataCategory: 'Identity & Authentication Data',
    specificDataItems: ['Full Name', 'Email Address', 'Hashed Password'],
    purpose: 'To authenticate the Data Principal, maintain account security, and identify the customer on invoices.',
    dpdpSection: 'Section 4(1)(a) & Section 6(1)',
    retentionPeriod: 'Duration of active account, or until Section 12(2) Erasure Request is executed.',
    recipientOrProcessor: 'Internal secure database only; never shared with third parties.'
  },
  {
    id: 'notice-sec-2',
    dataCategory: 'Fulfillment & Logistics Data',
    specificDataItems: ['Delivery Address', 'Contact Phone Number', 'Pincode'],
    purpose: 'To package, route, transport, and physically deliver purchased goods to the recipient.',
    dpdpSection: 'Section 4(1)(a) & Section 8(2)',
    retentionPeriod: 'Retention period specified by user. If "Do not save address" is selected, retained only until 30 days post delivery window, then masked.',
    recipientOrProcessor: 'Authorized logistics partners (India Post / BlueDart) under strict Data Processor agreements.'
  },
  {
    id: 'notice-sec-3',
    dataCategory: 'Financial & Invoice Data',
    specificDataItems: ['Transaction Reference ID', 'Timestamp', 'Amount', 'Payment Mode (Mock UPI/COD)'],
    purpose: 'To issue tax invoices, process order returns, and comply with statutory financial audits under Indian GST Act.',
    dpdpSection: 'Section 7(b) Legitimate Uses & Statutory Compliance',
    retentionPeriod: 'Statutory 7 years as mandated by Indian Companies & Tax Laws (DPDP Act Sec 8(7) exception).',
    recipientOrProcessor: 'Chartered Accountants & statutory tax authorities when legally requested.'
  },
  {
    id: 'notice-sec-4',
    dataCategory: 'Optional Marketing Preferences',
    specificDataItems: ['Consent Status Flag', 'Timestamp of Opt-in/Opt-out', 'Consent Version'],
    purpose: 'To send promotional offers, newsletters, and security bulletins only when unbundled consent is explicitly granted.',
    dpdpSection: 'Section 6(2) Granular Optional Consent',
    retentionPeriod: 'Until explicitly revoked by the Data Principal via the Privacy Dashboard.',
    recipientOrProcessor: 'Internal email service. No third-party data broker access.'
  },
  {
    id: 'notice-sec-5',
    dataCategory: 'Technical Telemetry & IP Address',
    specificDataItems: ['Truncated IP Address (Masked)', 'User Agent Header'],
    purpose: 'To prevent Distributed Denial of Service (DDoS) and secure audit logs for DPDP consent integrity verification.',
    dpdpSection: 'Section 8(5) Security Safeguards',
    retentionPeriod: 'Rolling 90-day security log purge.',
    recipientOrProcessor: 'Internal security monitoring logs only.'
  }
];

export const DPO_OFFICIAL_DETAILS = {
  fiduciaryName: 'PrivacyCart E-Commerce Technologies Pvt. Ltd. (Academic Prototype)',
  affiliatedInstitution: 'Department of Computer Engineering, Savitribai Phule Pune University (SPPU)',
  campusLocation: 'Ganeshkhind, Pune, Maharashtra 411007, India',
  grievanceOfficerName: 'Prof. Aniruddha Sharma',
  designation: 'Appointed Data Protection Officer (DPO) & Grievance Redressal Officer',
  officialEmail: 'privacy.dpo@sppu-privacycart.edu.in',
  contactNumber: '+91 20 2569 0000 (Ext. DPDP-COMP)',
  grievanceSLA: '30 Calendar Days (DPDP Act 2023 Statutory Resolution Window)'
};
