# PrivacyCart Data Flow Descriptions

**Project:** PrivacyCart — Designing a Privacy-Preserving E-Commerce Web Application  
**Statutory Alignment:** Digital Personal Data Protection (DPDP) Act, 2023 (India)

---

## 1. User Registration & Unbundled Consent Flow

```mermaid
sequenceDiagram
    autonumber
    actor DP as Data Principal (User)
    participant UI as Registration Modal
    participant AC as AuthContext
    participant DS as DataService
    participant DB as Database / Store

    DP->>UI: Enters Name, Email, Password
    DP->>UI: Reviews Statutory Notice (Sec 6(1))
    DP->>UI: Checks Mandatory Essential Consent
    DP->>UI: Optionally checks Unbundled Marketing Consent (Sec 6(2))
    DP->>UI: Clicks "Complete Registration"
    UI->>AC: register(credentials, marketingConsent)
    AC->>DS: Create Profile & Initialize Consents
    DS->>DB: INSERT profiles (id, email, name, role='user')
    DS->>DB: INSERT consents (essential_processing = TRUE)
    DS->>DB: INSERT consents (marketing_promotions = User Choice)
    DS->>DB: INSERT consents (analytics_telemetry = FALSE)
    DS->>DB: INSERT consent_audit_log (Initial Consent Timestamp & Masked IP)
    DB-->>DS: Success
    DS-->>AC: User Profile Session Established
    AC-->>UI: Registration Completed
    UI-->>DP: Displays Personalized Storefront
```

---

## 2. Product Purchase & Data Minimised Checkout Flow

```mermaid
sequenceDiagram
    autonumber
    actor DP as Data Principal
    participant UI as Product & Cart UI
    participant CO as Mock Checkout Modal
    participant DS as DataService
    participant DB as Database / Store

    DP->>UI: Views Product Details & Itemised DPDP Disclosure
    DP->>UI: Adds Certified Hardware Token to Cart
    DP->>UI: Opens Cart & Clicks "Proceed to Mock Checkout"
    UI->>CO: Renders Checkout Form with Statutory Purpose Notice (Sec 4(1)(a))
    DP->>CO: Enters Shipping Address
    DP->>CO: Leaves "Save address for future orders" UNCHECKED (Default)
    DP->>CO: Selects Mock Payment Method (e.g. Mock UPI)
    DP->>CO: Clicks "Complete Mock Checkout"
    CO->>DS: createOrder(orderPayload)
    DS->>DB: INSERT orders (items, amount, address, retainAddress=false, payment='MOCK_UPI')
    DB-->>DS: Generated Order Reference (PC-2026-ORD-XXXX)
    DS-->>CO: Return Confirmed Order Record
    CO->>UI: Clears Shopping Cart
    CO-->>DP: Displays Order Confirmation Screen with Ephemeral Address Notice
```

---

## 3. Consent Modification & Audit Logging Flow (DPDP Sec 6(4))

```mermaid
sequenceDiagram
    autonumber
    actor DP as Data Principal
    participant UI as Privacy Dashboard
    participant CPC as ConsentPreferencesCard
    participant DS as DataService
    participant DB as Database / Store

    DP->>UI: Opens Privacy Dashboard
    UI->>CPC: Renders Active Consents
    DP->>CPC: Toggles "Marketing & Promotions" from Active to Revoked
    CPC->>DS: updateConsent(userId, 'marketing_promotions', false)
    DS->>DB: UPDATE consents SET granted=false, updated_at=NOW() WHERE user_id=...
    DS->>DB: INSERT consent_audit_log (action='REVOKED', version='v1.0-2023', masked_ip='127.0.***.***')
    DB-->>DS: Updated Record Confirmed
    DS-->>CPC: Success Response
    CPC->>UI: Displays Toast: "Marketing Consent Revoked"
    UI->>DB: Re-fetches ConsentAuditLogTable
    UI-->>DP: Live Table Updates Showing New Audit Entry
```

---

## 4. Statutory Rights Request & DPO Adjudication Flow (DPDP Sec 11-14)

```mermaid
sequenceDiagram
    autonumber
    actor DP as Data Principal (Alice)
    participant UI as PrivacyRequestModal
    participant DS as DataService
    participant DB as Database / Store
    actor DPO as Data Protection Officer (Prof. Sharma)
    participant ADM as Admin Dashboard

    DP->>UI: Selects Statutory Right (e.g., Sec 12(2) Erasure Request)
    DP->>UI: Enters Description & Clicks Submit
    UI->>DS: createPrivacyRequest(userId, requestType, subject, description)
    DS->>DB: INSERT privacy_requests (tracking_token='DPDP-2026-ERA-XXXX', status='PENDING', sla=30)
    DB-->>DS: Saved Request
    DS-->>UI: Tracking Token Issued
    UI-->>DP: Confirmation Toast with 30-Day SLA Notice

    Note over DB,ADM: DPO Inspection Phase
    DPO->>ADM: Logs in as Administrator & Opens Privacy Requests Desk
    ADM->>DS: getPrivacyRequests(adminUser)
    DS->>DB: SELECT * FROM privacy_requests (Admin policy allows all)
    DB-->>ADM: List of Requests
    DPO->>ADM: Opens "Adjudicate" on Token DPDP-2026-ERA-XXXX
    DPO->>ADM: Selects Status: "ACTIONED" & Enters Official Findings
    ADM->>DS: updatePrivacyRequestStatus(token, 'admin', 'Prof. Sharma', 'ACTIONED', findings)
    DS->>DB: UPDATE privacy_requests SET status='ACTIONED', admin_response=findings
    DS->>DB: Trigger Anonymization on Profile & Revoke Optional Consents (Sec 12(2))
    DB-->>DS: Updated
    DS-->>ADM: Adjudication Logged
    ADM-->>DPO: Status Updated to ACTIONED
```

---

## 5. DPDP Section 11 Data Portability Dossier Flow

```mermaid
sequenceDiagram
    autonumber
    actor DP as Data Principal
    participant UI as Privacy Dashboard
    participant DEB as DataExportButton
    participant DS as DataService
    participant DB as Database / Store

    DP->>UI: Clicks "Export My Data (Sec 11)"
    UI->>DEB: handleDownloadDossier()
    DEB->>DS: exportDataPrincipalDossier(userId)
    DS->>DB: Aggregate User Profile, Active Consents, Audit Logs, Requests, and Orders
    DB-->>DS: Consolidated JSON Package
    DS-->>DEB: Dossier Object
    DEB->>DP: Triggers Client Download: privacycart_dpdp_dossier_<id>.json
    DEB-->>UI: Toast: "Data Dossier Exported Successfully"
```
