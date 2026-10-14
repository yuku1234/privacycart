-- ==============================================================================
-- PrivacyCart — PostgreSQL Database Schema & Row Level Security (RLS)
-- Savitribai Phule Pune University (SPPU) — Third-Year Computer Engineering
-- Aligned with Digital Personal Data Protection (DPDP) Act, 2023 (India)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES TABLE (Data Principal Accounts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the executing user is an administrator / DPO
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile or admin can view all"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- ==============================================================================
-- 2. PRODUCTS TABLE (Store Catalog with Itemised DPDP Notice Disclosures)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Privacy Hardware', 'Security Devices', 'Books & Guides', 'Everyday Tech', 'Software Licenses')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    in_stock BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
    image_url TEXT NOT NULL,
    privacy_badge TEXT NOT NULL CHECK (privacy_badge IN ('Minimal Data', 'Zero Telemetry', 'Encrypted', 'Open Source')),
    data_required_description TEXT NOT NULL, -- DPDP Section 5 Itemised Notice
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public can read, only Admins can write
CREATE POLICY "Public read products catalog"
    ON public.products FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert products"
    ON public.products FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
    ON public.products FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete products"
    ON public.products FOR DELETE
    USING (public.is_admin());

-- ==============================================================================
-- 3. CONSENTS TABLE (DPDP Section 6 Granular Unbundled Preferences)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL CHECK (consent_type IN ('essential_processing', 'marketing_promotions', 'analytics_telemetry', 'logistics_sharing')),
    granted BOOLEAN NOT NULL DEFAULT false,
    version TEXT NOT NULL DEFAULT 'v1.0-2023',
    purpose_description TEXT NOT NULL,
    legal_basis TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_consent_type UNIQUE(user_id, consent_type)
);

ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

-- Consents Policies: Strict Row Level Isolation
CREATE POLICY "Users can view own consents or admin view all"
    ON public.consents FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can upsert own consents"
    ON public.consents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consents"
    ON public.consents FOR UPDATE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. CONSENT AUDIT LOG (Immutable Audit Trail under DPDP Sec 6(4) & Sec 8(5))
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consent_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('GRANTED', 'REVOKED')),
    version TEXT NOT NULL DEFAULT 'v1.0-2023',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ip_address_masked TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    rationale TEXT
);

ALTER TABLE public.consent_audit_log ENABLE ROW LEVEL SECURITY;

-- Audit Log Policies: Read own records, insert allowed, NO update or delete (Immutable!)
CREATE POLICY "Users view own audit log or admin view all"
    ON public.consent_audit_log FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can append to audit log"
    ON public.consent_audit_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Explicitly DO NOT create UPDATE or DELETE policies for consent_audit_log to preserve immutability!

-- ==============================================================================
-- 5. PRIVACY REQUESTS & GRIEVANCES TABLE (DPDP Sections 11, 12, 13, 14)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.privacy_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_token TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    request_type TEXT NOT NULL CHECK (request_type IN ('ACCESS_DATA', 'CORRECTION', 'ERASURE', 'GRIEVANCE', 'NOMINATION')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'ACTIONED', 'REJECTED')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    requested_fields TEXT[],
    new_value_requested TEXT,
    admin_response TEXT,
    reviewed_by TEXT,
    sla_deadline_days INT NOT NULL DEFAULT 30, -- Mandated 30-day statutory resolution window
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;

-- Privacy Requests Policies
CREATE POLICY "Users view own requests or admin view all"
    ON public.privacy_requests FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create own privacy request"
    ON public.privacy_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can adjudicate and update privacy requests"
    ON public.privacy_requests FOR UPDATE
    USING (public.is_admin());

-- ==============================================================================
-- 6. ORDERS TABLE (Mock Checkout with Strict Privacy-by-Default Data Minimisation)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    retain_address_for_future_orders BOOLEAN NOT NULL DEFAULT false, -- DPDP Section 8
    payment_method TEXT NOT NULL CHECK (payment_method IN ('MOCK_UPI', 'MOCK_COD', 'MOCK_NETBANKING')),
    payment_status TEXT NOT NULL DEFAULT 'PAID_MOCK',
    order_status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (order_status IN ('CONFIRMED', 'DISPATCHED', 'DELIVERED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Users view own orders or admin view all"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own order"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 7. SEED DATA (Certified Products for Store Catalog)
-- ==============================================================================
INSERT INTO public.products (id, name, category, price, description, features, in_stock, rating, image_url, privacy_badge, data_required_description)
VALUES
('prod-001', 'SecureKey FIDO2 / U2F Hardware Token', 'Security Devices', 2499.00,
 'Hardware authentication token providing phishing-resistant multi-factor authentication for web accounts. Operates locally with zero cloud telemetry.',
 ARRAY['FIDO2 & WebAuthn Compliant', 'NFC + USB-C Interface', 'Tamper-Evident Casing', 'Zero Telemetry'],
 true, 4.9, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
 'Zero Telemetry', 'Requires only postal delivery address and contact name for shipping. Device operates entirely offline without telemetry.'),

('prod-002', 'AegisShield Webcam & Mic Blocker Kit (5-Pack)', 'Privacy Hardware', 499.00,
 'Physical sliding webcam covers with ultra-thin adhesive profile, plus 3.5mm microphone sound-blockers to physically eliminate unwanted audio interception.',
 ARRAY['Physical Optical Shutter', '0.7mm Ultra-Thin', 'Fits Laptops & Mobiles', 'Microphone Jack Blocker Included'],
 true, 4.8, 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=600&q=80',
 'Minimal Data', 'Standard physical dispatch data only. No firmware, serial tracking, or internet connectivity required.'),

('prod-003', 'VaultLeather RFID-Shielded Minimalist Wallet', 'Privacy Hardware', 1299.00,
 'Aerospace-grade electromagnetic shielding lining prevents unauthorized contactless NFC skimming of bank cards and government IDs.',
 ARRAY['13.56 MHz RFID Shielding', 'Holds 8 Cards + Cash', 'Carbon Fiber & Vegan Leather', 'Tested Against Skimmers'],
 true, 4.7, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
 'Minimal Data', 'Requires shipping coordinates for physical transit. No digital identifiers or telemetry collected.'),

('prod-004', 'SPPU DPDP Act 2023 Handbook & Implementation Guide', 'Books & Guides', 750.00,
 'Academic reference book compiled by legal-tech scholars on implementing technical safeguards, Data Fiduciary obligations, and Data Principal rights in modern Indian web architectures.',
 ARRAY['Comprehensive Act Analysis', 'Checklists for Engineers', 'Penalties & Tribunal Precedents', 'Full Text of DPDP 2023'],
 true, 5.0, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
 'Minimal Data', 'Shipping address and email for tax receipt under Indian GST Act regulations.'),

('prod-005', 'CipherDrive 128GB Hardware Encrypted USB 3.2', 'Security Devices', 3899.00,
 'Alphanumeric keypad PIN-authenticated flash drive with military-grade XTS-AES 256-bit hardware encryption. Self-destructs data after 10 failed PIN attempts.',
 ARRAY['Military-Grade XTS-AES 256', 'Onboard Alphanumeric Keypad', 'OS & Host Independent', 'Brute-force Self-Wipe Protection'],
 true, 4.9, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
 'Encrypted', 'Shipping name and address required. Device uses completely offline firmware; zero device telemetry or registration required.')
ON CONFLICT (id) DO NOTHING;
