# PrivacyCart — Designing a Privacy-Preserving E-Commerce Web Application

**Academic Project:** Third-Year (TE) Bachelor of Engineering in Computer Engineering  
**Institution:** Savitribai Phule Pune University (SPPU), Maharashtra, India  
**Legal Framework:** Digital Personal Data Protection (DPDP) Act, 2023 (India)  
**Prototype Grade:** Academic Evaluation & Capstone Project Submission

---

## 🛡️ Project Overview

**PrivacyCart** is an academic e-commerce web application designed under the principles of **Privacy-by-Design**, **Data Minimisation**, and statutory compliance with India's **Digital Personal Data Protection (DPDP) Act, 2023**.

Traditional commercial e-commerce platforms routinely deploy dark patterns, bundling mandatory behavioral profiling, permanent address retention, and undisclosed marketing trackers into their terms of service. PrivacyCart demonstrates how modern web applications can deliver a rich shopping experience while strictly upholding the statutory rights of the **Data Principal** and enforcing technical obligations on the **Data Fiduciary**.

---

## ✨ Key Features & Technical Capabilities

### 1. Storefront & Product Catalog
- **Responsive Shopping UI:** Product browsing, category filtering, search, and sorting.
- **Itemised Personal Data Disclosures (Section 5):** Every catalog item displays a specific pre-purchase data requirement statement (e.g., whether the device requires only delivery coordinates, operates offline, or involves zero telemetry).
- **Certified Privacy Hardware Catalog:** FIDO2 hardware security tokens, RFID-blocking wallets, physical webcam shutters, encrypted USB drives, and legal engineering handbooks.

### 2. Privacy-Preserving Shopping Cart & Mock Checkout
- **Interactive Slide-over Cart:** Real-time quantity adjustments, price calculations, statutory GST breakdown, and clear cart actions.
- **Purpose Limitation Notice (Section 4(1)(a)):** Clear explanation during checkout that recipient details are collected strictly for contractual fulfillment.
- **Privacy-by-Default Address Retention (Section 8):** The *"Save address for future checkouts"* checkbox defaults to **unchecked** (ephemeral delivery address mode).
- **Mock Payment Simulation (Zero Real Financial Data):** Academic mock payment options (Mock UPI QR/VPA, Cash on Delivery, and Mock NetBanking) with safety warnings. **No real payment credentials are ever requested or stored.**

### 3. Identity & Unbundled Consent Control (Section 6)
- **Unbundled Marketing Consent (Section 6(2)):** Essential contractual processing is decoupled from optional marketing communications. Users can browse, register, and checkout with zero marketing opt-in.
- **Consent Management Center:** Real-time toggles for Essential Processing (locked), Marketing & Promotions, Performance Telemetry, and Logistics Partner Sharing.
- **Immutable Consent Audit Trail (Section 6(4) & 8(5)):** Every consent grant or revocation automatically appends a tamper-evident audit record with timestamp, version (`v1.0-2023`), and masked IP address (`127.0.***.***`).

### 4. Data Principal Statutory Rights Forms (Sections 11, 12, 13, 14)
- **Right to Access Information (Section 11):** Includes a one-click **"Export My Data (Sec 11)"** button that compiles and downloads a structured JSON Data Principal Dossier.
- **Right to Correction (Section 12(1)):** Interactive form to request rectification of inaccurate contact or profile information.
- **Right to Erasure / Forgotten (Section 12(2)):** Formal request to purge non-statutory records and anonymize profile data.
- **Right of Grievance Redressal (Section 13):** Direct statutory complaint channel to the Data Protection Officer with 30-day statutory SLA tracking.
- **Right to Nominate (Section 14):** Form to designate a representative in case of incapacity.

### 5. Restricted Administrator & DPO Oversight Portal
- **Role-Based Access Control:** Restricted exclusively to authorized administrators (`role === 'admin'`).
- **Grievance & Privacy Requests Desk:** Adjudicate incoming requests, review statutory grounds, update status (`UNDER_REVIEW`, `ACTIONED`, `REJECTED`), and document official DPO findings.
- **Automated Erasure Anonymization:** Actioning an erasure request automatically executes profile anonymization and revokes optional marketing records.
- **Catalog Registry Management:** Add, edit, and delete store items with itemised DPDP notices.
- **Statutory Compliance Scorecard:** Tracks grievance turnaround, consent unbundling rates, and data minimisation ratings.

---

## 👥 Built-in Viva Voce Personas (1-Click Switcher)

For instant college demonstration and viva examination, PrivacyCart includes pre-configured personas in the top navigation bar:

| Persona | Role / Designation | Email | Password | Academic Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Alice Kulkarni** | Data Principal (Student User A) | `alice@student.sppu.ac.in` | `demo_password_123` | Demonstrates primary user checkout, consent toggles, and request submission. |
| **Bob Deshmukh** | Data Principal (Student User B) | `bob@student.sppu.ac.in` | `demo_password_123` | Demonstrates multi-user privacy isolation (Bob cannot see Alice's data). |
| **Prof. Sharma** | Data Protection Officer (Admin) | `dpo.sharma@sppu.ac.in` | `admin_password_456` | Demonstrates DPO request adjudication, SLA tracking, and catalog controls. |

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4
- **Icons & UI:** Lucide React
- **Database Engine:** PostgreSQL 15+ with Row Level Security (RLS) via Supabase
- **Local Fallback:** Programmatic In-Browser `LocalDemoStore` with simulated RLS
- **Test Automation:** Vitest v4 (16 automated tests)

---

## 🚀 Quick Start (Exact Local Run Commands)

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Installation
Open your terminal in the project directory:

```bash
# Clone or navigate to the project directory
cd privacycart

# Install all required dependencies
npm install
```

### 3. Run Automated Tests
Execute the Vitest test suite to verify privacy isolation, consent persistence, and RBAC:

```bash
npm run test
```
*Expected Result: 16 passed (16).*

### 4. Start Development Server
Launch the local Vite server:

```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 5. Production Build Verification
To verify production bundling:

```bash
npm run build
```

---

## 🗄️ Database Architecture & Supabase Connection

PrivacyCart operates in **two distinct modes**:

1. **Academic Local Demonstration Mode (Default):**
   - Automatically activates if Supabase credentials are not supplied in `.env`.
   - Uses in-memory and `localStorage` persistence with simulated Row Level Security.
   - Clearly labeled via a top persistent academic banner.
2. **Supabase Cloud Mode (Optional):**
   - Connects to a live Supabase PostgreSQL database with enforced Row Level Security.
   - To connect:
     1. Create a project at [Supabase](https://supabase.com).
     2. Open the Supabase SQL Editor and execute the complete script in **[`schema.sql`](file:///c:/Users/Himanshi%20Rahangdale/Desktop/privacycart/schema.sql)**.
     3. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
     4. Click *"Test Supabase Link"* in the top banner to verify connectivity.

> **CRITICAL SECURITY NOTE:** Never expose the `SUPABASE_SERVICE_ROLE_KEY` or master database passwords in client-side code. The browser client interacts exclusively using the public `anon` key, relying on PostgreSQL Row Level Security for isolation.

---

## 📚 Project Documentation Directory

Detailed academic documentation is provided in the `docs/` folder:

- **[System Architecture (`docs/ARCHITECTURE.md`)](file:///c:/Users/Himanshi%20Rahangdale/Desktop/privacycart/docs/ARCHITECTURE.md):** Complete component architecture, privacy-by-design layers, and security model.
- **[Data Flow Descriptions (`docs/DATA_FLOW.md`)](file:///c:/Users/Himanshi%20Rahangdale/Desktop/privacycart/docs/DATA_FLOW.md):** Detailed sequence diagrams for registration, checkout, consent revocation, and DPO adjudication.
- **[DPDP Act 2023 Mapping (`docs/DPDP_MAPPING.md`)](file:///c:/Users/Himanshi%20Rahangdale/Desktop/privacycart/docs/DPDP_MAPPING.md):** Comprehensive matrix mapping Sections 4 through 14 of the Indian Act to code, schema fields, and test cases.
- **[Academic Test Cases (`docs/TEST_CASES.md`)](file:///c:/Users/Himanshi%20Rahangdale/Desktop/privacycart/docs/TEST_CASES.md):** Complete test case matrix with execution steps, expected outcomes, and automated verification.
- **[College Demo Guide & Viva Voce Q&A (`docs/COLLEGE_DEMO_GUIDE.md`)](file:///c:/Users/Himanshi%20Rahangdale/Desktop/privacycart/docs/COLLEGE_DEMO_GUIDE.md):** 5-minute presentation script and anticipated external examiner viva questions with model answers.
- **[Database Schema DDL (`schema.sql`)](file:///c:/Users/Himanshi%20Rahangdale/Desktop/privacycart/schema.sql):** Complete PostgreSQL DDL with RLS policies, trigger functions, and seed catalog.

---

## ⚖️ Academic Disclaimer & Compliance Statement

This software is an educational prototype developed for academic submission and evaluation under the Savitribai Phule Pune University (SPPU) Third-Year Computer Engineering curriculum. It models technical privacy safeguards under the Digital Personal Data Protection Act, 2023. No claim of legal compliance certification or production financial security is made. Real financial credentials or sensitive biometric data must not be entered.
