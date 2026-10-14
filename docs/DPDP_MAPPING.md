# DPDP Act 2023 Compliance & Technical Mapping Matrix

**Project:** PrivacyCart — Designing a Privacy-Preserving E-Commerce Web Application  
**Institution:** Savitribai Phule Pune University (SPPU)  
**Academic Degree:** Third-Year Bachelor of Engineering (Computer Engineering)  
**Legislation:** The Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023, Ministry of Law and Justice, Government of India)

---

## Complete Statutory Requirements Mapping Matrix

| DPDP Section | Legal Requirement under Indian Law | PrivacyCart Architectural Implementation | Technical Artifact / File | Database Table & Field | Automated Test Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sec 4(1)(a)** | Grounds for processing: Lawful purpose for contract performance. | Essential personal data (name, dispatch address) processed solely to fulfill delivery contracts. | `src/components/cart/MockCheckoutModal.tsx` | `orders.shipping_address`, `consents.purpose_description` | `privacy.test.ts` (Test 16: Address collection) |
| **Sec 5** | Notice: Itemised notice before seeking consent detailing data items & purposes. | Pre-checkout itemised disclosure on every product card/modal + comprehensive Statutory Notice page. | `src/components/products/ProductDetailsModal.tsx`, `src/pages/PrivacyPolicyPage.tsx` | `products.data_required_description`, `PRIVACY_NOTICE_TABLE` | UI Verified & Build Validated |
| **Sec 6(1)** | Consent must be free, specific, informed, unconditional, and unambiguous. | Explicit checkbox at registration; no pre-ticked mandatory consents. | `src/components/auth/AuthModal.tsx` | `consents.granted`, `profiles.id` | `privacy.test.ts` (Test 8: Mandatory terms) |
| **Sec 6(2)** | Purpose Unbundling: Refusal of auxiliary consent must not deny primary service. | Marketing consent is completely separate from registration/order fulfillment. Users can buy with 0 marketing. | `src/components/auth/AuthModal.tsx`, `src/components/privacy/ConsentPreferencesCard.tsx` | `consents.consent_type = 'marketing_promotions'` | `privacy.test.ts` (Test 6: Independent marketing toggle) |
| **Sec 6(4)** | Right to withdraw consent with ease comparable to granting it. | Self-service Privacy Dashboard allows 1-click toggle to revoke marketing/analytics at any time. | `src/components/privacy/ConsentPreferencesCard.tsx` | `consents.granted = false`, `consents.updated_at` | `privacy.test.ts` (Test 6: Consent revocation) |
| **Sec 8(2)** | Data Processor Engagement: Formal agreements for logistics processing. | Third-party logistics sharing toggle explicitly bound to delivery carrier agreements (India Post / BlueDart). | `src/components/privacy/ConsentPreferencesCard.tsx` | `consents.consent_type = 'logistics_sharing'` | `privacy.test.ts` (Test 1: Isolation) |
| **Sec 8(5)** | Security Safeguards: Technical measures to prevent personal data breach. | PostgreSQL Row Level Security (RLS) restricts access by `auth.uid() = user_id`. Ephemeral address toggle. | `schema.sql`, `src/lib/storage.ts` | RLS Policies on all sensitive tables | `privacy.test.ts` (Tests 1-4: Cross-user barrier) |
| **Sec 8(7)** | Data Retention & Erasure: Purge personal data once purpose is accomplished. | Ephemeral address mode purges delivery details 30 days post-transit unless explicitly saved by user. | `src/components/cart/MockCheckoutModal.tsx` | `orders.retain_address_for_future_orders` | `privacy.test.ts` (Test 16: Ephemeral flag) |
| **Sec 11** | Right to Access: Obtain summary of processed data and identities of processors. | "Export My Data" button generates full Data Principal Dossier (JSON) covering profile, consents, audit logs. | `src/components/privacy/DataExportButton.tsx` | `exportDataPrincipalDossier(userId)` | `privacy.test.ts` (Test 13: Dossier export) |
| **Sec 12(1)** | Right to Correction: Rectify inaccurate or misleading personal data. | Dedicated Correction Request Form with target field selector (phone, name) and DPO updating logic. | `src/components/privacy/PrivacyRequestModal.tsx` | `privacy_requests.request_type = 'CORRECTION'` | `privacy.test.ts` (Test 9: Request creation) |
| **Sec 12(2)** | Right to Erasure / Forgotten: Erase personal data no longer required. | Erasure Form triggers automated profile anonymization and optional consent purge upon DPO approval. | `src/components/admin/RequestReviewModal.tsx`, `src/lib/storage.ts` | `anonymizeUserData(userId)` | `privacy.test.ts` (Test 12: Anonymization executed) |
| **Sec 13** | Right of Grievance Redressal: Grievance Officer with statutory SLA. | Official Grievance Redressal Portal under Prof. Sharma (DPO) with 30-day statutory SLA tracking. | `src/components/admin/AdminDashboard.tsx`, `src/lib/demoData.ts` | `privacy_requests.sla_deadline_days = 30`, `DPO_OFFICIAL_DETAILS` | `privacy.test.ts` (Test 11: DPO Adjudication) |
| **Sec 14** | Right to Nominate: Nominate an individual to exercise rights upon incapacity. | Nomination Form allowing Data Principal to specify authorized proxy name and contact details. | `src/components/privacy/PrivacyRequestModal.tsx` | `privacy_requests.request_type = 'NOMINATION'` | `privacy.test.ts` (Test 9: Form creation) |

---

## Key Distinctions: DPDP Act 2023 vs EU GDPR

During college viva voce examinations, examiners often ask about differences between India's DPDP Act 2023 and the European Union's General Data Protection Regulation (GDPR). The table below prepares the student:

| Architectural Aspect | India's DPDP Act, 2023 | EU GDPR | PrivacyCart Prototype Implementation |
| :--- | :--- | :--- | :--- |
| **Terminology** | **Data Principal** & **Data Fiduciary** | **Data Subject** & **Data Controller** | Uses statutory Indian terms (*Data Principal*, *Data Fiduciary*) |
| **Grounds for Processing** | Consent (Sec 6) + Certain Legitimate Uses (Sec 7) | 6 Legal Grounds (Consent, Contract, Legal Obligation, Vital Interests, Public Task, Legitimate Interests) | Emphasizes Section 6 Consent & Section 4(1)(a) Contractual necessity |
| **Notice Requirements** | Itemised notice in English or any 8th Schedule language | Broad Article 13/14 transparency | Itemised notice before consent on product and checkout |
| **Right to Nominate** | **Explicitly mandated** under Section 14 | Not explicitly standalone under GDPR | Dedicated Section 14 Nomination feature included |
| **Statutory Adjudication Window** | Standard 30 days | Standard 1 calendar month | Built-in 30-day SLA countdown and status tracking |
