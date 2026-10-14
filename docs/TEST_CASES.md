# PrivacyCart Academic Test Cases & Verification Report

**Project:** PrivacyCart — Designing a Privacy-Preserving E-Commerce Web Application  
**Institution:** Savitribai Phule Pune University (SPPU)  
**Academic Year:** Third-Year (TE) Computer Engineering  
**Test Runner:** Vitest v4.1.11 (Native Vite Engine)  
**Total Automated Tests:** 16 Passed, 0 Failed (100% Pass Rate)

---

## 1. Test Execution Summary

```
 RUN  v4.1.11 C:/Users/Himanshi Rahangdale/Desktop/privacycart

 ✓ src/tests/privacy.test.ts (16 tests) 14ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Duration  377ms
```

---

## 2. Detailed Academic Test Specifications

### Category A: User Isolation & Privacy Barriers (RLS Simulation)

| Test ID | Objective | Preconditions | Execution Steps | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-ISO-01** | Verify User A cannot access User B's privacy requests | Alice and Bob accounts pre-seeded with distinct requests | 1. Authenticate as Alice (`usr-alice-101`)<br>2. Call `getPrivacyRequests(alice.id, 'user')`<br>3. Inspect all returned request records | Returned requests strictly match Alice's ID. Zero records from Bob are exposed. | **PASSED** (Automated) |
| **TC-ISO-02** | Verify User B cannot access User A's past orders | Alice has confirmed orders in system | 1. Authenticate as Bob (`usr-bob-202`)<br>2. Call `getOrders(bob.id, 'user')`<br>3. Inspect order list | Only Bob's orders returned. Alice's orders are completely inaccessible. | **PASSED** (Automated) |
| **TC-ISO-03** | Verify Direct Cross-User Consent Inspection Prevention | Alice and Bob exist | 1. Alice attempts to execute `getConsents(bob.id, alice.id, 'user')` | System throws strict `Privacy Violation` error and denies query. | **PASSED** (Automated) |
| **TC-ISO-04** | Verify Direct Cross-User Audit Trail Inspection Prevention | Bob has audit entries | 1. Alice attempts to execute `getConsentAuditLogs(bob.id, alice.id, 'user')` | System throws strict `Privacy Violation` error and denies access. | **PASSED** (Automated) |
| **TC-ISO-05** | Verify Administrator (DPO) Cross-User Regulatory Access | Admin account exists | 1. Authenticate as Admin (`adm-sharma-999`)<br>2. Call `getPrivacyRequests(admin.id, 'admin')` | Administrator successfully views requests across all users for adjudication. | **PASSED** (Automated) |

---

### Category B: Consent Persistence & Audit Trail (DPDP Sec 6(4))

| Test ID | Objective | Preconditions | Execution Steps | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-CST-01** | Verify Unbundled Marketing Consent Toggle Persistence | Alice has marketing consent = false | 1. Toggle marketing consent to `true`<br>2. Call `getConsents(alice.id)` to verify persistence | Consent status updates to `granted = true` and persists in storage. | **PASSED** (Automated) |
| **TC-CST-02** | Verify Tamper-Evident Consent Audit Trail Generation | Alice account active | 1. Toggle analytics telemetry consent<br>2. Query `consent_audit_log` | New immutable log entry appended containing timestamp, action `GRANTED`, and masked IP. | **PASSED** (Automated) |
| **TC-CST-03** | Prevent Arbitrary Revocation of Mandatory Contractual Consent | Active user session | 1. Attempt to set `essential_processing` to `false` | System rejects request with explanation that essential terms are required for fulfillment. | **PASSED** (Automated) |

---

### Category C: Statutory Rights Request Lifecycle (DPDP Sec 11-14)

| Test ID | Objective | Preconditions | Execution Steps | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-REQ-01** | Verify Privacy Request Creation & Tracking Token Issuance | Logged-in user | 1. Submit Section 11 Access Request<br>2. Inspect generated record | Request assigned unique tracking token (`DPDP-2026-ACC-XXXX`) and 30-day statutory SLA window. | **PASSED** (Automated) |
| **TC-REQ-02** | Prevent Regular Users from Adjudicating Requests | Request exists | 1. User attempts to call `updatePrivacyRequestByDPO` with role `user` | System throws `Unauthorized` error; self-adjudication blocked. | **PASSED** (Automated) |
| **TC-REQ-03** | Verify DPO Adjudication & Official Findings Recording | Pending request exists | 1. Admin reviews request<br>2. Updates status to `ACTIONED`<br>3. Enters findings | Request marked `ACTIONED`, reviewer name set to Prof. Sharma, and findings saved. | **PASSED** (Automated) |
| **TC-REQ-04** | Verify Automatic Anonymization upon Section 12(2) Erasure Action | Active user profile | 1. File Section 12(2) Erasure Request<br>2. DPO approves and sets `ACTIONED` | User name anonymized, phone masked, and all optional consents revoked. | **PASSED** (Automated) |

---

### Category D: Data Portability & Role-Based Access Control

| Test ID | Objective | Preconditions | Execution Steps | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-EXP-01** | Verify Section 11 Data Portability Dossier Export | User with orders & consents | 1. Call `exportDataPrincipalDossier(alice.id)` | Returns valid JSON dossier containing profile, active consents, audit logs, and orders. | **PASSED** (Automated) |
| **TC-CAT-01** | Prevent Non-Admin Catalog Modification | Regular user session | 1. Non-admin calls `addProduct` | System rejects with `Access Denied` error. | **PASSED** (Automated) |
| **TC-CAT-02** | Allow Admin to Add Product with DPDP Disclosure | Admin session active | 1. Admin adds hardware token with itemised notice | Product created in catalog with itemised data requirement notice. | **PASSED** (Automated) |
| **TC-CHK-01** | Verify Data Minimisation & Ephemeral Address Selection | Items in cart | 1. Checkout with `retainAddressForFutureOrders = false`<br>2. Select Mock UPI | Order recorded with ephemeral flag; zero credit card numbers collected. | **PASSED** (Automated) |

---

## 3. Tests That Could Not Be Performed Automatically

As mandated by project integrity requirements:
1. **Live Supabase PostgreSQL RLS Live Cloud Connection:**
   - *Status:* Skipped automatically in test environment due to lack of configured cloud credentials in local `.env`.
   - *Mitigation:* Verified against `LocalDemoStore` programmatic access barrier, and full production SQL DDL with RLS policies is provided in `schema.sql`.
2. **Real Payment Gateway Settlement:**
   - *Status:* Deliberately excluded by design to prevent real financial liability. Mock UPI and Mock COD are implemented cleanly.
