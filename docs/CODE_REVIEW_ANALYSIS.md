# Code Review & Analysis

## Phase 1c – Core Analysis & Identification

### 1. Bugs & Critical Issues

| ID | Description | Location | Impact |
|----|-------------|----------|--------|
| BUG-001 | **Auth Mismatch:** Frontend uses Supabase Auth, but Backend uses custom JWT/bcrypt. Tokens likely incompatible. | `apps/web/lib/supabase`, `apps/api/src/routes/auth` | **High:** API calls from frontend may fail or be insecure. |
| BUG-002 | **Missing Storage Implementation:** Backend storage service has a TODO for AWS S3; currently no real file storage? | `apps/api/src/services/storage/storage.service.ts` | **High:** File uploads will fail or be ephemeral. |
| BUG-003 | **Hardcoded Secrets:** "Production Hardening" TODOs suggest potential security gaps (needs manual verification of `.env` usage). | `apps/api/src/config/constants.ts` | **Critical:** Security risk. |
| BUG-004 | **Mock Scoring Logic:** Dashboard stats use placeholder logic. | `apps/web/.../dashboard.tsx` | **Medium:** User sees fake data. |
| BUG-005 | **Dual UI Libraries:** Heavy bundle size due to loading both AntD and Tailwind/Radix. | `apps/web/package.json` | **Medium:** Performance (LCP/TTI). |
| BUG-006 | **Missing Database Persistence:** Chat export route has a TODO "Store chatData in the database". | `apps/api/src/routes/chat-export.routes.ts` | **High:** Data loss after processing. |
| BUG-007 | **Inconsistent Styling:** `GroupManager` uses AntD components while `Dashboard` uses Custom/Shadcn. | `apps/web/src/components` | **Low:** Visual inconsistency. |

### 2. UI/UX Improvements

| ID | Description | Recommendation |
|----|-------------|----------------|
| UX-001 | **Login/Signup Flow:** Visuals differ from main dashboard (AntD vs Custom). | Unify to `shadcn/ui` Card/Form patterns. |
| UX-002 | **Dashboard Stats:** Currently static/mocked. | Add loading skeletons (already in `ui/`) while fetching real data. |
| UX-003 | **File Upload:** Drag-and-drop zone needs clear success/error states. | Use `sonner` or `toast` for upload feedback (currently `message.success` from AntD?). |
| UX-004 | **Theme Toggle:** Ensure instant switch without FOUC. | Verify `next-themes` provider setup in `layout.tsx`. |
| UX-005 | **Mobile Nav:** Check responsiveness of Sidebars (AntD Sider vs Custom Sidebar). | Replace AntD Sider with Shadcn `Sheet` for mobile. |
| UX-006 | **Accessibility:** AntD components might fight with Radix primitives for focus management. | Audit tab order on mixed pages. |
| UX-007 | **Navigation:** "Legacy" links might exist. | Clean up `Header/Navigation` components. |

### 3. Performance & Structural Improvements

*   **P-001 (Bundle Size):** Remove `antd` dependency entirely. It is tree-shakeable but heavyweight compared to Tailwind.
*   **P-002 (API):** Switch `apps/api` to use Supabase Auth Middleware to verify tokens instead of custom JWT logic.
*   **P-003 (Monorepo):** Move shared types (User, Chat, Summary) to `packages/shared` (currently seems scattered).
*   **P-004 (Database):** Migrate from SQLite to PostgreSQL (Supabase) for production readiness as per `README`.
*   **P-005 (Images):** Ensure all `<img>` tags are replaced with `next/image`.
*   **P-006 (Server Actions):** Refactor `apps/web` API calls to Server Actions where possible to reduce client-side JS.
*   **P-007 (Docker):** Create optimized `Dockerfile` for `apps/web` and `apps/api` using `turbo prune`.

### 4. Refactoring Opportunities

*   **R-001:** Rewrite `apps/web/src/components/GroupManager` using `shadcn/ui` Table and Dialog.
*   **R-002:** Centralize API client creation (Axios/Fetch) with proper interceptors for Auth.
*   **R-003:** Consolidate CSS: Move `global-styles.css` variables into `tailwind.config.ts`.
*   **R-004:** Standardize Error Handling: Replace `console.error` with a proper logger (or `Sentry`) in `apps/web`.
*   **R-005:** Extract "AI Summary" logic in Backend to a standalone service/adapter pattern (allow swapping OpenAI/Anthropic).
*   **R-006:** Rename `apps/web/src/components/features` to `apps/web/src/features` (Feature-Sliced Designish).
*   **R-007:** Clean up `apps/web/src/app` - there seem to be duplicate css files (`global-styles.css` vs `enhanced-styles.css`).

### 5. Missing Documentation

*   **D-001:** `API.md` or Swagger/OpenAPI spec for `apps/api`.
*   **D-002:** Architecture Diagram showing the flow between Next.js, Express, and Supabase.
*   **D-003:** "How to Contribute" specifically for adding new UI components.
*   **D-004:** Deployment Guide (Azure specific instructions are missing details).
*   **D-005:** Env Var reference (current `.env.example` might be outdated).
*   **D-006:** Authentication Flow documentation (explaining the Supabase vs Custom JWT split).
*   **D-007:** Testing Guide (how to run E2E vs Unit).

### 6. Incomplete Features (TODO Audit)

| File | Marker | Description | Effort |
|------|--------|-------------|--------|
| `client.ts` | TODO | Production Hardening (Supabase) | Low |
| `dashboard.tsx` | TODO | Implement actual scoring logic | Medium |
| `summary.service.ts` | TODO | AI Service Hardening | Medium |
| `storage.service.ts` | TODO | Implement AWS S3 upload | High |
| `chat-export.routes.ts` | TODO | Store chatData in database | High |

---

## Phase 1d – Suggested Additional Tasks

1.  **Unified Auth Strategy (Critical):** Deprecate the custom JWT in `apps/api`. Use Supabase Auth for everything. The Node.js backend should just verify the Supabase JWT.
2.  **Database Migration (High):** Move from SQLite to Supabase (PostgreSQL). This aligns with the Auth strategy and solves persistence issues.
3.  **UI Library Migration (High):** Systematically replace all AntD components. This is a prerequisite for a consistent look and feel.
4.  **E2E Testing Baseline (Medium):** Implement the snapshot tests defined below to prevent regressions during the migration.
5.  **CI/CD Pipeline (Medium):** Set up GitHub Actions to run Lint, Test, and Build on PRs.

---

## Snapshot Test Specification (#RUN_UI_SNAPSHOT_AUDIT)

**Tool:** Playwright
**Location:** `tests/e2e/visual-baseline.spec.ts`

### Flows to Capture

1.  **Public Landing Page:**
    *   Route: `/`
    *   States: Default view, Mobile View.
2.  **Authentication (Login):**
    *   Route: `/login` (or modal trigger)
    *   States: Empty form, Error state.
3.  **Dashboard (Main App):**
    *   Route: `/dashboard` (requires mocked auth)
    *   States: Loading, Populated with Mock Data.
4.  **Chat Upload Flow:**
    *   Route: `/dashboard/upload` (or similar)
    *   States: Dropzone active, Uploading progress.
