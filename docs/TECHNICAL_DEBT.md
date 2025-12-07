# Technical Debt Registry

| ID | Area | Description | Priority | Effort | Notes |
|----|------|-------------|----------|--------|-------|
| TD-001 | **Auth** | **Dual Auth Systems:** Supabase (Client) vs Custom JWT (API). Needs unification. | **Critical** | High | Blocked by API Refactor. |
| TD-002 | **UI** | **Dependency Weight:** `antd` is a heavy dependency used alongside Tailwind. | **High** | High | Affects LCP/Bundle Size. |
| TD-003 | **Security** | **Hardcoded Secrets:** Potential secrets in code/comments (check `constants.ts`). | **Critical** | Low | Immediate audit required. |
| TD-004 | **Backend** | **Missing Storage:** AWS S3 TODO in `storage.service.ts` - needs implementation (or Supabase Storage). | **High** | Medium | Feature gap. |
| TD-005 | **Backend** | **Mock Data:** Scoring logic in Dashboard is mocked. | **Medium** | Medium | User Trust issue. |
| TD-006 | **Database** | **SQLite vs Postgres:** Dev uses SQLite, Prod needs Postgres. | **High** | Medium | Ops/Deployment complexity. |
| TD-007 | **Code** | **Type Safety:** Shared types (Chat, Message) are duplicated or `any`. | **Medium** | Low | Maintainability. |
| TD-008 | **Test** | **E2E Coverage:** No E2E tests currently running in CI. | **Medium** | Medium | Regression risk. |
| TD-009 | **Styles** | **CSS duplication:** `global-styles.css` vs `enhanced-styles.css`. | **Low** | Low | Cleanup needed. |
| TD-010 | **Test** | **Broken Unit Tests:** `apps/api` and `apps/frontend` (Legacy) tests fail due to config/path issues. | **High** | Medium | Needs immediate fix before meaningful CI. |
