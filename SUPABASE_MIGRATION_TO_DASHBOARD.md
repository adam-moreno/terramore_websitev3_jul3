# Supabase Migration: Website → Existing Dashboard Project

## Goal

- Use the **existing** Supabase project (dashboard) for both dashboard and website.
- Keep **website data separate** from dashboard data for clear lead/customer tracking and customer journey.
- Stay **efficient and secure**: one project, one bill, shared auth if needed later; separation via schema and RLS.

---

## 1. Current Website Usage (This Repo)

| Purpose | Table | API route | Data |
|--------|-------|-----------|------|
| Free course signups (banner + course pages) | `free_courses_signups` | `POST /api/course-signup`, `POST /api/free-courses-signup` | Leads from website |
| Partner applications | `partner_applications` | `POST /api/partner-application` | Partner leads |

**Env:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Recommended Approach: Add Website Schema (No Replace, No Merge of Tables)

- **Do not** replace or merge dashboard tables with website tables.
- **Add** a dedicated PostgreSQL **schema** for all website-sourced data (e.g. `website`).
- **Keep** dashboard tables in `public` (or your existing dashboard schema).
- **Result:**  
  - Same Supabase project and env for both app and dashboard.  
  - Clear separation: `website.*` = leads/customers from site; dashboard schema = internal/dashboard data.  
  - Easy to join later for “customer journey” (e.g. website lead → dashboard customer) without mixing concerns.

---

## 3. Schema Design: Keep Website vs Dashboard Separate

### Option A (recommended): Dedicated schema `website`

- All website tables live in schema `website`.
- Dashboard continues to use `public` (or `dashboard`) as today.
- Separation: **by schema**, not by table name.

```
website.free_courses_signups   ← website leads (courses)
website.partner_applications   ← website leads (partner)
public.* (or dashboard.*)      ← your existing dashboard tables
```

### Option B: Table prefix in `public`

- Tables: `website_free_courses_signups`, `website_partner_applications`.
- Everything stays in `public`; separation by **naming**.
- Slightly simpler than a new schema but less clean for many tables.

**Recommendation:** Use **Option A** (`website` schema) so you can later add more website tables (e.g. `website.consultation_requests`) and keep RLS/policies scoped to `website`.

---

## 4. Changes Required

### 4.1 Database (run in **dashboard** Supabase SQL Editor)

Run the following in the **existing** Supabase project (dashboard). This only **adds** objects; it does not change existing dashboard tables.

```sql
-- ============================================================
-- 1. Create website schema (keeps data separate from dashboard)
-- ============================================================
CREATE SCHEMA IF NOT EXISTS website;

-- ============================================================
-- 2. Website table: free course signups (leads)
-- ============================================================
CREATE TABLE website.free_courses_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  email_consent BOOLEAN NOT NULL DEFAULT false,
  signup_source VARCHAR(100) DEFAULT 'free_courses_banner',
  course_type VARCHAR(100),
  signup_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

CREATE INDEX idx_website_free_courses_signups_email ON website.free_courses_signups(email);
CREATE INDEX idx_website_free_courses_signups_status ON website.free_courses_signups(status);
CREATE INDEX idx_website_free_courses_signups_signup_date ON website.free_courses_signups(signup_date);
CREATE INDEX idx_website_free_courses_signups_signup_source ON website.free_courses_signups(signup_source);
CREATE INDEX idx_website_free_courses_signups_course_type ON website.free_courses_signups(course_type);

ALTER TABLE website.free_courses_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "website_fcs_allow_insert" ON website.free_courses_signups
  FOR INSERT WITH CHECK (true);

-- Only service role or authenticated dashboard users should read (adjust role name to match your dashboard auth)
CREATE POLICY "website_fcs_allow_select_authenticated" ON website.free_courses_signups
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================
-- 3. Website table: partner applications (leads)
-- ============================================================
CREATE TABLE website.partner_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  business_type VARCHAR(255) NOT NULL,
  revenue VARCHAR(255) NOT NULL,
  team_size VARCHAR(255) NOT NULL,
  goal VARCHAR(255) NOT NULL,
  timeline VARCHAR(255) NOT NULL,
  budget VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  application_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending_review',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

CREATE INDEX idx_website_partner_applications_email ON website.partner_applications(email);
CREATE INDEX idx_website_partner_applications_status ON website.partner_applications(status);
CREATE INDEX idx_website_partner_applications_application_date ON website.partner_applications(application_date);
CREATE INDEX idx_website_partner_applications_location ON website.partner_applications(location);
CREATE INDEX idx_website_partner_applications_business_type ON website.partner_applications(business_type);

ALTER TABLE website.partner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "website_pa_allow_insert" ON website.partner_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "website_pa_allow_select_authenticated" ON website.partner_applications
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================
-- 4. updated_at triggers (reuse or create)
-- ============================================================
CREATE OR REPLACE FUNCTION website.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER website_fcs_updated_at
  BEFORE UPDATE ON website.free_courses_signups
  FOR EACH ROW EXECUTE FUNCTION website.update_updated_at();

CREATE TRIGGER website_pa_updated_at
  BEFORE UPDATE ON website.partner_applications
  FOR EACH ROW EXECUTE FUNCTION website.update_updated_at();
```

If your dashboard uses a **custom role** (e.g. `dashboard_user`) for reading leads, replace `auth.role() = 'authenticated'` in the SELECT policies with that role, or add an extra policy for it.

---

### 4.2 Environment variables (website app)

Point the **website** app (this repo) to the **dashboard** Supabase project:

- Use the **dashboard** project URL and keys.
- Do **not** commit these; keep in `.env.local` and in the host’s env (e.g. Vercel).

```env
# Dashboard Supabase project (same as dashboard app)
NEXT_PUBLIC_SUPABASE_URL=https://<dashboard-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dashboard-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<dashboard-service-role-key>
```

After migration, you can use **one** Supabase project for both website and dashboard; only the env values change for the website.

---

### 4.3 Code changes in this repo (website)

The website currently uses `from('free_courses_signups')` and `from('partner_applications')`. With the `website` schema, Supabase client needs to target that schema.

**Option 1 – Use Postgres schema in table name (recommended):**  
In the JS client you **cannot** pass a schema name into `.from()`. So you have two practical options:

- **A) Expose tables via a Postgres view in `public`**  
  - Create `public.free_courses_signups` as a view that `SELECT * FROM website.free_courses_signups`.  
  - Create `public.partner_applications` as a view that `SELECT * FROM website.partner_applications`.  
  - Enable RLS on the views and grant appropriate policies (or use security definer views and restrict access).  
  - Website code stays as-is: `.from('free_courses_signups')`, `.from('partner_applications')`.

- **B) Use Supabase “schema” option**  
  - If your Supabase client supports specifying a schema (e.g. in client options), set schema to `website` and keep table names `free_courses_signups` and `partner_applications`.  
  - Then no view is needed; table names in code stay the same.

Supabase JS client v2 uses the **default schema `public`**. So to keep code minimal and avoid changing every `.from()` call, the **cleanest** is:

- **Create the tables in `public` with a prefix** (Option B from section 3), e.g. `website_free_courses_signups` and `website_partner_applications`, **or**
- **Create views in `public`** that point to `website.*` and keep current table names in code.

Recommended for “keep data separate” and “minimal code change”: **create the physical tables in schema `website`** (as in the SQL above), then **add public views** that mirror the names the website expects:

```sql
-- Optional: public views so website code doesn't need to change
CREATE VIEW public.free_courses_signups AS SELECT * FROM website.free_courses_signups;
CREATE VIEW public.partner_applications AS SELECT * FROM website.partner_applications;

-- RLS on views: allow insert for anon (website) and select for authenticated (dashboard)
ALTER VIEW public.free_courses_signups SET (security_invoker = on);
ALTER VIEW public.partner_applications SET (security_invoker = on);
```

Views with `security_invoker = on` use the RLS of the underlying table. So the INSERT/SELECT policies on `website.free_courses_signups` and `website.partner_applications` apply. But: **Supabase PostgREST exposes tables, not views, by default** for inserts. So inserting into a view might not work the same as a table. **Safer approach:** keep tables in `public` with a prefix so the API stays table-based:

- **Simplest for this repo:** create tables in **public** with names **`website_free_courses_signups`** and **`website_partner_applications`** in the dashboard project (same columns as above), and update the three API routes to use these table names. No schema change in Postgres; only table names in code change. Data is still “website” by name and you can later add a `data_source = 'website'` column if you want.

Given that, here are two concrete paths:

---

## 5. Two Concrete Migration Paths

### Path 1: Same project, separate schema `website` (best separation)

1. Run the **full SQL** in section 4.1 in the **dashboard** Supabase project (creates `website` schema and tables).
2. **Expose the `website` schema** in the dashboard Supabase project: **Settings → API → Schema** (or Project Settings → API). Add `website` to the exposed schemas so the API can read/write it.
3. Do **not** create public views; Supabase doesn’t support INSERT through views the same way.
4. In the **website** repo, create a Supabase client that uses the schema option. Supabase JS allows:

   ```ts
   createClient(url, key, { db: { schema: 'website' } })
   ```

   So in the website API routes, use a client with `schema: 'website'`. Then keep table names: `free_courses_signups`, `partner_applications` (no prefix). Code change: **one shared client with `db.schema: 'website'`** and no table renames.

5. Set website env to the **dashboard** Supabase URL and keys.

**Code change (website):**  
- Add a server-side Supabase client that uses `schema: 'website'` and use it in the three API routes. Table names stay `free_courses_signups` and `partner_applications`.

### Path 2: Same project, tables in `public` with prefix (no schema)

1. In the **dashboard** Supabase project, create in **public**:
   - `website_free_courses_signups`
   - `website_partner_applications`
   (same columns and RLS as above, but in `public`).
2. In the website repo, change:
   - `.from('free_courses_signups')` → `.from('website_free_courses_signups')`
   - `.from('partner_applications')` → `.from('website_partner_applications')`
3. Set website env to the dashboard Supabase URL and keys.

**Code change:** only the two table names in the three API routes.

---

## 6. Summary of Changes by Path

| Item | Path 1 (schema `website`) | Path 2 (prefix in `public`) |
|------|----------------------------|-----------------------------|
| SQL | Create schema `website` + tables + RLS + triggers | Create tables in `public` with prefix + RLS + triggers |
| Env | Point to dashboard project | Point to dashboard project |
| Code | One Supabase client with `db.schema: 'website'`; table names unchanged | Two table renames in API routes |

---

## 7. Security Checklist

- **Website:** Only ever **inserts** (no SELECT on PII from the front end). Use **service_role** only in server-side API routes (as you do now).
- **Dashboard:** Reads website leads via **authenticated** (or your dashboard role); ensure RLS allows SELECT only for that role.
- **Service role key:** Only in server-side env (website API routes and dashboard backend). Never in browser.
- **Anon key:** Safe for browser; RLS prevents reading website tables for anon users if policies are as above.

---

## 8. Customer Journey / Keeping Data Separate

- **Website data:** All in `website.*` (Path 1) or in `website_*` tables (Path 2). Use `signup_source`, `course_type`, `application_date`, etc., for journey.
- **Dashboard data:** Stays in your existing tables (e.g. customers, orders, etc.).
- **Mapping later:** When a lead becomes a customer, you can:
  - Add a `customer_id` or `dashboard_user_id` column to `website.free_courses_signups` / `website.partner_applications`, or
  - Keep a separate “conversions” or “journey” table that references both website lead id and dashboard customer id.

That way you keep “website vs dashboard” data separate while still being able to map customer journey.

---

## 9. If You Already Have Data in the Old Website Supabase

1. **Export** from the old project (Table Editor → Export CSV, or use Supabase CLI / SQL dump).
2. **Import** into the new tables in the dashboard project (e.g. `website.free_courses_signups` and `website.partner_applications`, or `website_*` in `public`) using SQL `INSERT ... SELECT` or Supabase dashboard import.
3. Then switch the website env to the dashboard project and deploy.

---

## 10. Next Steps

1. Choose **Path 1** (schema `website`) or **Path 2** (prefix in `public`).
2. Run the corresponding SQL in the **dashboard** Supabase project.
3. Update **website** env to dashboard Supabase URL and keys.
4. Apply the **code** change (schema option or table renames) in this repo.
5. (Optional) Migrate existing rows from the old Supabase project.
6. Test signup and partner forms; then test dashboard read access to the new tables.
7. Retire the old Supabase project or keep it read-only for history.

If you tell me which path you prefer (Path 1 or Path 2), I can turn this into concrete code edits (exact client creation and any renames) and a single SQL file you can run in the dashboard project.
