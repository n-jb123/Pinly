# Pinly — Buyer & Platform Administrator Guide

This guide is designed for the platform operator and commercial buyer who acquires Pinly.

---

## 1. Platform Operator Console (`/admin`)

Access the platform administration console directly via `/admin`.
*Security Notice:* SuperAdmin sessions require two-factor authentication (2FA).

### Console Capabilities:
1. **Workspaces Management (`/admin/workspaces`):**
   - View all registered tenant agencies and solo freelancers.
   - Monitor storage consumption and plan status.
   - Manually override subscription tiers or freeze workspaces in delinquency.

2. **Users & Impersonation (`/admin/users`):**
   - Directory of all registered freelancer accounts.
   - Launch customer support impersonation sessions with persistent security banners and full audit logging.

3. **Subscription Plans & Limits (`/admin/plans`):**
   - Change monthly and annual prices for Free, Pro, and Agency tiers.
   - Modify storage quotas (GB), active project allowances, member limits, and screenshot counts without editing code.

4. **Legal Dispute Resolution Audit Log (`/admin/audit`):**
   - **Exclusive Operator View:** When comments are edited or deleted, the original pre-modification text is permanently preserved here. In client-freelancer disputes regarding changed revision briefs, the operator can provide verified proof of original submissions.

5. **Customer Support Inbox (`/admin/support`):**
   - Inbound support tickets with auto-attached environment metadata (user, workspace, plan, browser user agent).

6. **Content & Whitelabel Settings (`/admin/content` & `/admin/settings`):**
   - Change platform name, primary accent color, landing copy, and legal terms templates directly from the UI.

---

## 2. Swappable Third-Party Adapters

Pinly decouples third-party services behind clean adapters:

1. **Payment Gateways:**
   - **Stripe (Default):** Plug in secret keys via the settings panel.
   - **Lemon Squeezy / Paddle:** Select the active adapter from `/admin/settings`.
2. **Website Screenshot API:**
   - Adapter supports services like ScreenshotOne or URLbox.
3. **Transactional Email:**
   - Adapter configured for Resend with verified sender names.
