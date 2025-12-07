# Implementation Plan

## Executive Summary
This plan addresses the critical architectural divergences (Auth, UI) and functional gaps (Storage, DB) found during the deep audit. The primary goal is to stabilize the platform for a production release.

**Key Architecture Principle:** We will adopt an "Interface-First" approach (Adapter Pattern) for all external services (Storage, AI, Auth). While the immediate target may involve Supabase or OpenAI, we must implement abstract interfaces to allow seamless migration to **Azure** services (Azure Blob Storage, Azure OpenAI) in the future.

---

## Phase 1: Stabilization & Architecture (Critical)

**Goal:** Unify Authentication and ensure the Backend is stateless and secure.

### 1.1 Unify Authentication Strategy
*   **Problem:** Frontend uses Supabase Auth; Backend uses incompatible Custom JWT.
*   **Solution:** Migrate `apps/api` to verify Supabase JWTs, but hide it behind an `AuthProvider` interface.
*   **Tasks:**
    *   [ ] Define `IAuthService` interface (verifyToken, getUser).
    *   [ ] Implement `SupabaseAuthProvider` implementing `IAuthService`.
    *   [ ] Create Supabase Middleware in Express using the provider.
    *   [ ] Remove `jsonwebtoken`, `bcryptjs`, and local auth routes (`/login`, `/register`) from `apps/api`.

### 1.2 Database Migration (SQLite -> PostgreSQL)
*   **Problem:** SQLite is used locally; Supabase (Postgres) is required for Prod/Auth consistency.
*   **Solution:** Switch TypeORM config to use Postgres.
*   **Tasks:**
    *   [ ] Provision Supabase Database.
    *   [ ] Update `apps/api/src/config/datasource.ts` to use `postgres` driver.
    *   [ ] Run initial migrations to sync schema.

---

## Phase 2: UI Standardization (High)

**Goal:** Remove Ant Design (`antd`) to reduce bundle size and enforce visual consistency with `shadcn/ui`.

### 2.1 Component Migration
*   **Strategy:** Replace `GroupManager` and `Layout` components piece-by-piece.
*   **Tasks:**
    *   [ ] Replace `antd/Layout` with Tailwind flexbox layout (Sidebar + Header).
    *   [ ] Replace `antd/Menu` with `shadcn` NavigationMenu / Sidebar links.
    *   [ ] Replace `antd/Table` in `GroupManager` with `shadcn` Table.
    *   [ ] Replace `antd/Modal` with `shadcn` Dialog.
    *   [ ] Replace `antd/Form` with `react-hook-form` + `zod` + `shadcn` Input.

### 2.2 Cleanup
*   **Tasks:**
    *   [ ] Remove `antd`, `@ant-design/icons` from `package.json`.
    *   [ ] Remove `apps/web/src/styles/globals.css` (legacy overrides).
    *   [ ] Unify `global-styles.css` into `tailwind.config.ts`.

---

## Phase 3: Core Feature Completion (Medium)

**Goal:** Implement missing backend functionality marked by TODOs using robust abstractions.

### 3.1 Chat Data Persistence
*   **Problem:** Chat exports are parsed but not saved.
*   **Tasks:**
    *   [ ] Implement `Chat` and `Message` entities in TypeORM.
    *   [ ] Save parsed data to Postgres in `chat-export.routes.ts`.

### 3.2 File Storage (Azure Ready)
*   **Problem:** Files are not persisted.
*   **Strategy:** Implement an `IStorageService` interface.
*   **Tasks:**
    *   [ ] Define `IStorageService` (upload, download, delete, generateSignedUrl).
    *   [ ] Implement `SupabaseStorageService` (Initial implementation).
    *   [ ] (Future) Implement `AzureBlobStorageService` for easy swap.
    *   [ ] Refactor `apps/api` to use `IStorageService` dependency injection.

### 3.3 AI Summarization (Azure Ready)
*   **Problem:** Service might be tightly coupled to OpenAI SDK.
*   **Strategy:** Implement an `IAIService` interface.
*   **Tasks:**
    *   [ ] Define `IAIService` (summarizeText, extractTopics).
    *   [ ] Implement `OpenAIService` (Current).
    *   [ ] (Future) Implement `AzureOpenAIService`.

---

## Phase 4: Polish & Operations (Low)

**Goal:** Documentation, Testing, and CI/CD.

### 4.1 Documentation
*   **Tasks:**
    *   [ ] Create API Documentation (Swagger/OpenAPI).
    *   [ ] Create "Contributing Guide" for UI components.

### 4.2 Testing
*   **Tasks:**
    *   [ ] Implement the Playwright Snapshot Tests (`visual-baseline.spec.ts`).
    *   [ ] Set up Github Actions workflow.
