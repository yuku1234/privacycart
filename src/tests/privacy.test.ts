/**
 * PrivacyCart — Automated Test Suite
 * SPPU Third-Year Computer Engineering Project
 * 
 * Verifies core DPDP Act 2023 technical safeguards:
 * 1. User Isolation & Row-Level Access Controls (User A cannot access User B's data)
 * 2. Consent Persistence & Tamper-Evident Audit Logging (DPDP Sec 6(4))
 * 3. Statutory Privacy Request Lifecycle & DPO Adjudication (DPDP Sec 11-14)
 * 4. Data Portability Dossier Generation (DPDP Sec 11)
 * 5. Administrative Access Control & Product Management Protection
 * 6. Data Minimisation in Checkout Flow
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { localStore } from '../lib/storage';
import { DEMO_USERS } from '../lib/demoData';

describe('PrivacyCart — DPDP Technical Verification Suite', () => {
  const alice = DEMO_USERS['user-alice'];
  const bob = DEMO_USERS['user-bob'];
  const admin = DEMO_USERS['admin-sharma'];

  beforeEach(() => {
    // Reset store to known fresh state before each test
    localStore.resetToDefaults();
  });

  describe('1. Multi-User Isolation & Privacy Barriers', () => {
    it('ensures User A (Alice) cannot view User B (Bob)\'s privacy requests', () => {
      const aliceRequests = localStore.getPrivacyRequests(alice.id, alice.role);
      
      // All returned requests must belong strictly to Alice
      expect(aliceRequests.length).toBeGreaterThan(0);
      aliceRequests.forEach((req) => {
        expect(req.userId).toBe(alice.id);
        expect(req.userId).not.toBe(bob.id);
      });
    });

    it('ensures User B (Bob) cannot view User A (Alice)\'s orders', () => {
      const bobOrders = localStore.getOrders(bob.id, bob.role);

      expect(bobOrders.length).toBeGreaterThan(0);
      bobOrders.forEach((order) => {
        expect(order.userId).toBe(bob.id);
        expect(order.userId).not.toBe(alice.id);
      });
    });

    it('throws a privacy violation error if User A attempts to inspect User B\'s consents directly', () => {
      expect(() => {
        localStore.getConsents(bob.id, alice.id, 'user');
      }).toThrow(/Privacy Violation/i);
    });

    it('throws a privacy violation error if User A attempts to inspect User B\'s consent audit logs', () => {
      expect(() => {
        localStore.getConsentAuditLogs(bob.id, alice.id, 'user');
      }).toThrow(/Privacy Violation/i);
    });

    it('permits authorized Administrator (DPO) to access requests across all Data Principals for statutory oversight', () => {
      const allRequests = localStore.getPrivacyRequests(admin.id, admin.role);
      
      const hasAliceReq = allRequests.some((r) => r.userId === alice.id);
      const hasBobReq = allRequests.some((r) => r.userId === bob.id);

      expect(hasAliceReq).toBe(true);
      expect(hasBobReq).toBe(true);
    });
  });

  describe('2. Consent Persistence & Immutable Audit Trail (DPDP Sec 6(4))', () => {
    it('persists changes when optional marketing consent is toggled', () => {
      // Alice initially has marketing_promotions = false
      const initialConsents = localStore.getConsents(alice.id, alice.id, alice.role);
      const initialMkt = initialConsents.find((c) => c.consentType === 'marketing_promotions');
      expect(initialMkt?.granted).toBe(false);

      // Alice opts into marketing
      const updated = localStore.updateConsentPreference(
        alice.id,
        'marketing_promotions',
        true,
        'User opted in during test'
      );
      expect(updated.granted).toBe(true);

      // Verify persistence upon re-fetch
      const refreshedConsents = localStore.getConsents(alice.id, alice.id, alice.role);
      const refreshedMkt = refreshedConsents.find((c) => c.consentType === 'marketing_promotions');
      expect(refreshedMkt?.granted).toBe(true);
    });

    it('automatically generates an immutable audit log entry for every consent modification', () => {
      const logsBefore = localStore.getConsentAuditLogs(alice.id, alice.id, alice.role);
      const initialLogCount = logsBefore.length;

      localStore.updateConsentPreference(
        alice.id,
        'analytics_telemetry',
        true,
        'Test analytics opt-in'
      );

      const logsAfter = localStore.getConsentAuditLogs(alice.id, alice.id, alice.role);
      expect(logsAfter.length).toBe(initialLogCount + 1);

      const latestLog = logsAfter[0];
      expect(latestLog.consentType).toBe('analytics_telemetry');
      expect(latestLog.action).toBe('GRANTED');
      expect(latestLog.ipAddressMasked).toBeDefined();
      expect(latestLog.timestamp).toBeDefined();
    });

    it('prevents arbitrary revocation of essential contractual processing consent', () => {
      expect(() => {
        localStore.updateConsentPreference(alice.id, 'essential_processing', false);
      }).toThrow(/Essential processing consent is required/i);
    });
  });

  describe('3. Statutory Privacy Request Lifecycle (DPDP Sections 11, 12, 13, 14)', () => {
    it('creates a privacy request with tracking token and statutory 30-day SLA window', () => {
      const newReq = localStore.createPrivacyRequest({
        userId: alice.id,
        userEmail: alice.email,
        userName: alice.fullName,
        requestType: 'ACCESS_DATA',
        subject: 'Test Data Access Request',
        description: 'Testing DPDP Section 11 access disclosure.',
      });

      expect(newReq.id).toBeDefined();
      expect(newReq.trackingToken).toMatch(/^DPDP-2026-ACC-/);
      expect(newReq.status).toBe('PENDING');
      expect(newReq.slaDeadlineDays).toBe(30);

      // Verify it appears in Alice's requests
      const aliceReqs = localStore.getPrivacyRequests(alice.id, alice.role);
      expect(aliceReqs.some((r) => r.id === newReq.id)).toBe(true);
    });

    it('prevents regular users from adjudicating privacy requests', () => {
      const requests = localStore.getPrivacyRequests(alice.id, alice.role);
      const targetReq = requests[0];

      expect(() => {
        localStore.updatePrivacyRequestByDPO(
          targetReq.id,
          'user',
          alice.fullName,
          'ACTIONED',
          'Attempted self-approval'
        );
      }).toThrow(/Unauthorized/i);
    });

    it('allows DPO Administrator to adjudicate requests and record official findings', () => {
      const newReq = localStore.createPrivacyRequest({
        userId: alice.id,
        userEmail: alice.email,
        userName: alice.fullName,
        requestType: 'GRIEVANCE',
        subject: 'Resolution test',
        description: 'Testing DPO adjudication process.',
      });

      const adjudicated = localStore.updatePrivacyRequestByDPO(
        newReq.id,
        'admin',
        admin.fullName,
        'ACTIONED',
        'Official finding: Investigation complete and confirmed.'
      );

      expect(adjudicated.status).toBe('ACTIONED');
      expect(adjudicated.reviewedBy).toBe(admin.fullName);
      expect(adjudicated.adminResponse).toContain('Official finding');
    });

    it('executes data anonymization when an Erasure Request (Sec 12(2)) is Actioned', () => {
      const erasureReq = localStore.createPrivacyRequest({
        userId: alice.id,
        userEmail: alice.email,
        userName: alice.fullName,
        requestType: 'ERASURE',
        subject: 'Right to be forgotten request',
        description: 'Please erase marketing profile.',
      });

      localStore.updatePrivacyRequestByDPO(
        erasureReq.id,
        'admin',
        admin.fullName,
        'ACTIONED',
        'Erasure granted: Profile anonymized and optional consents cleared.'
      );

      const userProfile = localStore.getUserById(alice.id);
      expect(userProfile?.fullName).toContain('Anonymized');
      expect(userProfile?.phone).toBe('+91 **********');
    });
  });

  describe('4. DPDP Section 11 Data Portability Dossier', () => {
    it('compiles full personal data package for Data Principal', () => {
      const dossier = localStore.exportDataPrincipalDossier(alice.id);

      expect(dossier.exportedAt).toBeDefined();
      expect(dossier.legalBasis).toContain('Section 11');
      expect(dossier.dataPrincipal?.id).toBe(alice.id);
      expect(Array.isArray(dossier.activeConsents)).toBe(true);
      expect(Array.isArray(dossier.consentAuditTrail)).toBe(true);
      expect(Array.isArray(dossier.privacyRequests)).toBe(true);
      expect(Array.isArray(dossier.orderHistory)).toBe(true);
    });
  });

  describe('5. Role-Based Access Control on Product Catalog', () => {
    it('prevents regular users from modifying the catalog', () => {
      expect(() => {
        localStore.addProduct(
          {
            name: 'Unauthorized Product',
            category: 'Privacy Hardware',
            price: 1999,
            description: 'Should fail',
            features: ['None'],
            inStock: true,
            rating: 1.0,
            imageUrl: 'https://example.com/img.jpg',
            privacyBadge: 'Minimal Data',
            dataRequiredDescription: 'Test',
          },
          'user'
        );
      }).toThrow(/Access Denied/i);
    });

    it('allows administrators to add products with DPDP disclosures', () => {
      const newProduct = localStore.addProduct(
        {
          name: 'Hardware Security Key 2026',
          category: 'Security Devices',
          price: 2999,
          description: 'Authorized test device',
          features: ['FIDO2', 'Zero Telemetry'],
          inStock: true,
          rating: 5.0,
          imageUrl: 'https://example.com/img.jpg',
          privacyBadge: 'Zero Telemetry',
          dataRequiredDescription: 'Shipping address only.',
        },
        'admin'
      );

      expect(newProduct.id).toBeDefined();
      expect(localStore.getProductById(newProduct.id)).not.toBeNull();
    });
  });

  describe('6. Data Minimisation in Order Creation', () => {
    it('creates order respecting the address retention consent flag', () => {
      const order = localStore.createOrder({
        userId: alice.id,
        userEmail: alice.email,
        items: [
          {
            productId: 'prod-001',
            productName: 'SecureKey FIDO2',
            quantity: 1,
            unitPrice: 2499,
          },
        ],
        totalAmount: 2499,
        shippingAddress: {
          fullName: 'Alice Kulkarni',
          street: 'Hostel No. 4, SPPU',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411007',
        },
        retainAddressForFutureOrders: false, // Privacy-conscious choice
        paymentMethod: 'MOCK_UPI',
      });

      expect(order.id).toBeDefined();
      expect(order.retainAddressForFutureOrders).toBe(false);
      expect(order.paymentStatus).toBe('PAID_MOCK');
    });
  });
});
