# PrivacyCart — College Demonstration & Viva Voce Guide

**Project:** PrivacyCart — Designing a Privacy-Preserving E-Commerce Web Application  
**Target Audience:** Savitribai Phule Pune University (SPPU) Third-Year Computer Engineering Project Evaluation  
**Presentation Time:** ~5 to 7 Minutes

---

## 1. Quick Launch Commands

To start the project during your college presentation, open PowerShell or Terminal in the project root directory and run:

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the automated DPDP test suite (proves 16/16 tests pass to examiner)
npm run test

# 3. Start the local development server
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 2. Step-by-Step 5-Minute Demonstration Script

### Minute 1: The Problem & Academic Thesis
* **What to say:**
  > *"Respected Examiners, modern e-commerce websites routinely engage in dark patterns, bundling broad marketing and tracking permissions into terms of service without user awareness. Our project, **PrivacyCart**, addresses this under India’s **Digital Personal Data Protection (DPDP) Act, 2023** by implementing Privacy-by-Design, unbundled consent, purpose limitation, and Row Level Security."*
* **What to show on screen:**
  - Show the top **SPPU Academic Demonstration Mode Banner**.
  - Show the hero section highlighting DPDP Act 2023 compliance badges (*Zero Cross-site Trackers*, *PostgreSQL RLS*, *Unbundled Consent*, *Section 11 Portability*).

---

### Minute 2: Itemised Product Notice & Privacy-Preserving Checkout
* **What to say:**
  > *"Under DPDP Section 5, Data Fiduciaries must give clear, itemised notice of data collected and specific processing purposes before seeking consent. Notice how each item in our catalog features a dedicated privacy badge and disclosure."*
* **What to show on screen:**
  1. Click **View Details** on *SecureKey FIDO2 Hardware Token*.
  2. Point to the **DPDP Section 5 Itemised Personal Data Notice** box explaining that only delivery address is collected with zero telemetry.
  3. Add the item to cart.
  4. Open Cart & click **Proceed to Mock Checkout**.
  5. Point out the **Statutory Delivery Notice (Sec 4(1)(a))**.
  6. Point out the **Address Retention Toggle:** It is **UNCHECKED by default** (Privacy-by-Default / Data Minimisation under Section 8).
  7. Show the **Mock UPI Payment Simulation** with the academic safety warning (zero real card details collected).
  8. Click **Complete Mock Checkout** and show the confirmed Order ID.

---

### Minute 3: Granular Consent & Immutable Audit Trail (DPDP Sec 6)
* **What to say:**
  > *"Under Section 6(2), consent must be unbundled: a user cannot be forced to accept marketing to buy products. Under Section 6(4), withdrawing consent must be as easy as giving it, and Data Fiduciaries must maintain audit proof."*
* **What to show on screen:**
  1. Click **Privacy Dashboard** in the top navigation bar.
  2. Show Alice’s profile details.
  3. In the **Consent Management Center**, show that Essential Contractual Processing is locked, but **Marketing & Promotions** and **Analytics** are independent toggles.
  4. Toggle **Marketing & Promotions** to Active/Revoked. Show the immediate toast alert.
  5. Scroll down to the **Immutable Consent Audit Trail** table: Point out the newly created entry showing the exact timestamp, action (GRANTED/REVOKED), policy version `v1.0-2023`, and masked IP address.

---

### Minute 4: Exercising Statutory Rights & Data Portability (Sec 11-14)
* **What to say:**
  > *"Sections 11 through 14 empower Data Principals with rights to access, correct, erase data, file grievances, and nominate proxies."*
* **What to show on screen:**
  1. Click **Export My Data (Sec 11)** in the dashboard header: Show the instant download of `privacycart_dpdp_dossier_*.json` containing Alice’s complete records.
  2. Click **Exercise DPDP Right**:
     - Show the selector: *Sec 11 Access*, *Sec 12(1) Correction*, *Sec 12(2) Erasure*, *Sec 13 Grievance*, *Sec 14 Nomination*.
     - File a sample grievance (e.g. "Query on courier dispatch data sharing").
     - Submit: Show the generated tracking token (e.g. `DPDP-2026-GRI-XXXX`) and the 30-day statutory SLA notice.

---

### Minute 5: Proving Multi-User Isolation & DPO Adjudication Desk
* **What to say:**
  > *"To prove that user data is isolated at the database layer (Row Level Security), let's switch personas."*
* **What to show on screen:**
  1. Click the top **Persona Switcher** and select **Bob Deshmukh**.
  2. Open Privacy Dashboard as Bob: Show that **Bob cannot see Alice’s requests or orders**! (Multi-user barrier verified).
  3. Switch persona to **Prof. Sharma (Admin & DPO)**.
  4. Click **Admin & DPO Desk**:
     - Show the **Compliance Overview Metrics** (Total requests, pending SLA, 100% consent unbundling rate).
     - Switch to **Privacy Requests Desk**: As DPO, Prof. Sharma can view requests across all users.
     - Click **Adjudicate** on Alice’s request, change status to **Actioned / Completed**, add official DPO findings, and save!

---

## 3. High-Probability Viva Voce Questions & Answers

### Q1: What is the main objective of India's DPDP Act, 2023?
> **Answer:** The Digital Personal Data Protection Act, 2023 provides a statutory framework for processing digital personal data in India. It balances an individual's right to protect their personal data (as a *Data Principal*) with the lawful processing needs of organisations (as *Data Fiduciaries*), emphasizing purpose limitation, notice, consent, data minimisation, and penalties of up to ₹250 crore for significant non-compliance.

### Q2: What is "Unbundled Consent" under DPDP Section 6(2)?
> **Answer:** Unbundled consent means that agreement to ancillary purposes (such as promotional marketing or telemetry analytics) cannot be made a prerequisite for accessing the primary service (such as purchasing a product). In PrivacyCart, a user can decline all marketing consents and still complete purchases seamlessly.

### Q3: How does Row Level Security (RLS) work in PostgreSQL?
> **Answer:** Row Level Security (RLS) is a database engine security mechanism. Unlike traditional application-level filters (`WHERE user_id = ?`), RLS policies are enforced by the database kernel on every query. If a user queries `SELECT * FROM orders`, PostgreSQL automatically restricts the rows returned to `auth.uid() = user_id`, making accidental cross-tenant data leaks impossible even if the application code has bugs.

### Q4: Why is there an immutable Consent Audit Log?
> **Answer:** Under DPDP Section 6(1) and Section 8(5), the burden of proof is on the Data Fiduciary to demonstrate that valid consent was granted for processing. Our immutable audit trail records every grant, modification, and revocation with timestamp, masked IP, user agent, and consent version, providing tamper-evident forensic evidence for compliance audits.

### Q5: What is Data Minimisation and how does PrivacyCart implement it?
> **Answer:** Data minimisation means collecting only the personal data strictly necessary to fulfill the specified purpose. PrivacyCart implements this by:
> 1. Requiring no account registration just to browse products.
> 2. Ephemeral shipping address retention (defaulting to unchecked so addresses are not permanently retained unless requested).
> 3. Zero collection of real financial credit card information.
