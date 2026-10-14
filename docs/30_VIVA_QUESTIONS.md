# 30 Comprehensive Viva Voce Questions & Model Answers
## SPPU Third-Year Computer Engineering Project Evaluation
**Project:** PrivacyCart — Designing a Privacy-Preserving E-Commerce Web Application  
**Statutory Framework:** Digital Personal Data Protection (DPDP) Act, 2023 (India)

---

### Group 1: DPDP Act 2023 Fundamentals & Legal Definitions (Q1 – Q6)

#### Q1: What is the Digital Personal Data Protection (DPDP) Act, 2023?
> **Answer:** The DPDP Act, 2023 (Act No. 22 of 2023) is India's principal statutory legislation governing the processing of digital personal data. It protects the personal data rights of individuals (termed **Data Principals**) while establishing lawful processing grounds, security obligations, and financial penalties (up to ₹250 crore) for organizations (termed **Data Fiduciaries**).

#### Q2: Who is a "Data Principal" and what is a "Data Fiduciary"?
> **Answer:** 
> - **Data Principal (Section 2(j)):** The individual to whom the personal data relates (in our application, the e-commerce shopper/customer).
> - **Data Fiduciary (Section 2(i)):** Any person or entity that determines the purpose and means of processing personal data (in our application, the PrivacyCart e-commerce platform).

#### Q3: What is a "Data Processor" and how does PrivacyCart handle them?
> **Answer:** Under Section 2(k), a Data Processor is any entity that processes personal data on behalf of a Data Fiduciary. In PrivacyCart, third-party courier services (e.g., India Post or BlueDart) act as Data Processors. Under Section 8(2), data is shared only under formal processor agreements, with an explicit user toggle in the Privacy Dashboard.

#### Q4: What constitutes "Personal Data" under the DPDP Act?
> **Answer:** Under Section 2(t), personal data is any data about an individual who is identifiable by or in relation to such data. This includes names, email addresses, delivery addresses, phone numbers, and device IP addresses.

#### Q5: How does India's DPDP Act 2023 differ from EU GDPR regarding legal bases?
> **Answer:** Unlike the EU GDPR which defines 6 separate lawful bases (including broad "legitimate interests"), the DPDP Act recognizes processing primarily based on:
> 1. **Consent (Section 6):** Unbundled, specific, and informed.
> 2. **Certain Legitimate Uses (Section 7):** Including fulfilling contractual obligations (Section 4(1)(a)), medical emergencies, state subsidies, and statutory tax compliance.

#### Q6: What are the statutory penalties under the DPDP Act for data breaches?
> **Answer:** Under Schedule 1 of the Act, penalties are determined by the Data Protection Board of India (DPBI) based on severity:
> - Failure to take reasonable security safeguards (Section 8(5)): Up to **₹250 crore**.
> - Failure to notify the Board and Data Principal of a breach: Up to **₹200 crore**.
> - Non-fulfillment of obligations regarding children: Up to **₹200 crore**.

---

### Group 2: Notice & Consent Architecture (Q7 – Q12)

#### Q7: What are the statutory requirements for a Privacy Notice under Section 5?
> **Answer:** Section 5 mandates that every request for consent must be accompanied or preceded by an **itemised notice** specifying:
> 1. The personal data to be collected.
> 2. The exact purpose for processing.
> 3. How the Data Principal may exercise rights under Sections 11–14.
> 4. Contact details of the Data Protection Officer / Grievance Redressal Officer.
> In PrivacyCart, this is rendered via `PrivacyNoticeModal.tsx` and on individual product detail modals.

#### Q8: What does "Unbundled Consent" mean under DPDP Section 6(2)?
> **Answer:** Consent is unbundled when agreement to optional ancillary purposes (such as promotional marketing or tracking telemetry) is separated from essential contractual terms. Under Section 6(2), denying marketing consent **must not** prevent a user from registering or purchasing items.

#### Q9: How is consent withdrawal implemented under Section 6(4)?
> **Answer:** Section 6(4) guarantees the right to withdraw consent with the **same ease** with which it was given. In PrivacyCart's Dashboard (`ConsentPreferencesCard.tsx`), a user can toggle marketing or analytics off with a single click without navigating convoluted cancellation flows.

#### Q10: Why does PrivacyCart maintain an immutable Consent Audit Log?
> **Answer:** Under Section 6(1) and Section 8(5), the burden of proof is on the Data Fiduciary to establish that valid consent was granted. The `consent_audit_log` records:
> - User ID & Consent Type
> - Action (`GRANTED` or `REVOKED`)
> - Policy Version (`v1.0-2023`)
> - Masked IP (`127.0.***.***`) & User-Agent
> - Tamper-evident timestamp

#### Q11: Why is "Essential Contractual Processing" locked from casual toggle?
> **Answer:** Under Section 4(1)(a), basic identity and delivery details are mandatory to execute the purchase contract. A customer cannot ask to receive physical goods while simultaneously forbidding the courier from receiving the delivery address. To completely terminate essential processing, the user must file an **Erasure Request under Section 12(2)**.

#### Q12: Why are IP addresses masked in audit logs?
> **Answer:** IP addresses can be classified as personal data. Masking octets (e.g., `103.21.***.***` or `127.0.***.***`) balances forensic auditability with privacy preservation, ensuring logs themselves do not become privacy risks.

---

### Group 3: Data Principal Rights: Sections 11 – 14 (Q13 – Q18)

#### Q13: How does PrivacyCart satisfy the Section 11 Right to Access?
> **Answer:** Section 11 entitles individuals to a summary of personal data being processed and the identities of third parties with whom data has been shared. PrivacyCart implements a dedicated **"Export My Data (Sec 11)"** button (`DataExportButton.tsx`) that downloads the Data Principal's complete dossier as a structured JSON file.

#### Q14: How does the Section 12(1) Right to Correction work?
> **Answer:** When contact details change (such as a SIM replacement), the Data Principal submits a Correction Request specifying the field and new verified value. Once reviewed and actioned by the DPO in `AdminDashboard.tsx`, the user's profile is updated automatically.

#### Q15: How does PrivacyCart handle Section 12(2) Erasure ("Right to be Forgotten")?
> **Answer:** When an Erasure request is approved by the DPO:
> 1. The user's name and contact number in `profiles` are permanently anonymized.
> 2. All optional marketing and analytics consents are wiped.
> 3. Completed tax invoices are retained in read-only form to comply with statutory accounting requirements under the Indian GST and Companies Act.

#### Q16: What is the statutory Grievance Redressal SLA under Section 13?
> **Answer:** The DPDP Act mandates that Data Fiduciaries establish a designated Grievance Redressal Officer and resolve grievances within **30 calendar days**. Every grievance ticket in PrivacyCart carries an automated SLA deadline indicator.

#### Q17: What happens if a grievance is unresolved within 30 days?
> **Answer:** Under Section 13(3), if the Data Principal is unsatisfied with the Data Fiduciary's resolution or does not receive a response within 30 days, they have the statutory right to escalate the complaint to the **Data Protection Board of India (DPBI)**.

#### Q18: What is the "Right to Nominate" under Section 14?
> **Answer:** Unique to the Indian DPDP Act (unlike GDPR), Section 14 gives Data Principals the explicit right to nominate an individual who will exercise their data protection rights in the event of death or legal incapacity.

---

### Group 4: Technical Safeguards & PostgreSQL RLS (Q19 – Q24)

#### Q19: What is Row Level Security (RLS) in PostgreSQL?
> **Answer:** RLS is a security mechanism built directly into the PostgreSQL database engine. Unlike application-level filters (`WHERE user_id = $1`), RLS evaluates security policies inside the database kernel on every query. If an attacker bypasses the frontend, the database still refuses to return rows belonging to another user.

#### Q20: Explain the RLS policy for the `consents` table in PrivacyCart.
> **Answer:** 
> ```sql
> CREATE POLICY "Users view own consents" 
> ON public.consents FOR SELECT 
> USING (auth.uid() = user_id OR public.is_admin());
> ```
> This ensures that regular users can only read rows where `user_id` matches their authenticated JWT UID. Only users with role `admin` can query across tenants.

#### Q21: Why are there NO UPDATE or DELETE policies on `consent_audit_log`?
> **Answer:** To enforce an **append-only immutable ledger**. Even an authenticated user or application endpoint cannot rewrite or delete historical audit entries, preventing repudiation during compliance investigations.

#### Q22: Why should `SUPABASE_SERVICE_ROLE_KEY` never be in the frontend?
> **Answer:** The `service_role` key bypasses all Row Level Security policies and grants unrestricted administrative access to the entire database. Exposing it in client-side code would allow any user to dump or delete all customer records. The frontend must only use the public `anon` key.

#### Q23: How does PrivacyCart ensure multi-user isolation in Demonstration Mode?
> **Answer:** `LocalDemoStore` mirrors database RLS by enforcing strict authorization checks: `getPrivacyRequests(requestingUserId, requestingRole)` verifies that non-admins can only retrieve records matching their own user ID. This is verified by automated test cases in `src/tests/privacy.test.ts`.

#### Q24: How does PrivacyCart handle failed server operations honestly?
> **Answer:** In `dataService.ts`, if Supabase returns an error or is unreachable, the system catches the real error message and presents an alert toast. It **never fakes success** if a network or database write fails.

---

### Group 5: Data Minimisation & E-Commerce Flow (Q25 – Q30)

#### Q25: How does PrivacyCart apply the Data Minimisation principle (Section 8)?
> **Answer:**
> 1. Users can browse the entire catalog and read privacy notices without creating an account.
> 2. The checkout address retention toggle defaults to **unchecked** (ephemeral delivery address).
> 3. Zero real financial data is collected or stored.
> 4. Catalog devices require zero cloud telemetry.

#### Q26: Explain the "Ephemeral Delivery Address" feature.
> **Answer:** In traditional e-commerce, addresses are saved indefinitely by default for convenience. In PrivacyCart, unless the customer explicitly checks *"Save this address for future checkouts"*, the address is stored as ephemeral transit data and flagged for purging 30 days post delivery window.

#### Q27: Why doesn't PrivacyCart collect real credit cards or CVVs?
> **Answer:** Under the Data Minimisation principle and RBI Tokenisation guidelines, storing raw card data introduces severe PCI-DSS compliance and breach liability. PrivacyCart models payment through an educational Mock UPI/COD simulation, collecting zero card numbers.

#### Q28: How does the Administrator role differ from standard users?
> **Answer:** Regular users are restricted by RLS to their own profile, orders, and requests. Administrators (acting as the Data Protection Officer) have cross-tenant read privileges to adjudicate grievances, update SLA statuses, and manage the catalog.

#### Q29: What automated tests verify your system's privacy claims?
> **Answer:** PrivacyCart includes 16 automated Vitest tests covering:
> - Cross-user isolation (Alice cannot view Bob's requests/orders).
> - Unauthorized access denial when attempting to read another's audit logs.
> - Consent modification persistence.
> - Dynamic audit log generation.
> - Prevention of mandatory consent revocation.
> - DPO request adjudication lifecycle and data anonymization.

#### Q30: What is the main engineering takeaway from this project?
> **Answer:** PrivacyCart demonstrates that DPDP Act compliance is not merely a legal disclaimer, but an **architectural paradigm**. By enforcing purpose limitation, unbundled consent, database-level isolation (RLS), and verifiable audit logging, web engineers can build e-commerce systems that respect user privacy by default without compromising commercial utility.
