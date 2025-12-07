# WhatsSummarize - WhatsApp Conversation Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A comprehensive platform for analyzing and summarizing WhatsApp conversations using AI-powered tools. Upload chat exports, gain insights, and get intelligent summaries of your messaging history.

---

## 🚀 Project Overview

**WhatsSummarize** allows users to unlock insights from their WhatsApp conversation history. By uploading standard `.txt` export files, users can visualize communication patterns, activity levels, and generate AI-driven qualitative summaries.

### Core Value Proposition
*   **Privacy-First:** Secure data handling with encryption.
*   **AI-Powered:** Deep insights using OpenAI/Anthropic (Topics, Sentiment, Summaries).
*   **User-Centric:** Simple upload flow and dashboard visualizations.

---

## 🛠 Technology Stack

### Monorepo Structure (pnpm + Turbo)
*   `apps/web`: Next.js 15 (App Router) Frontend.
*   `apps/api`: Express.js + TypeORM Backend.
*   `packages/ui`: Shared UI library (Shadcn/UI based).

### Frontend (`apps/web`)
*   **Framework:** Next.js 15.4
*   **Styling:** Tailwind CSS + Shadcn/UI (Note: Migrating away from Ant Design).
*   **Auth:** Supabase Auth (SSR).
*   **State:** React Context + Supabase.

### Backend (`apps/api`)
*   **Runtime:** Node.js 18+
*   **Database:** SQLite (Dev) / PostgreSQL (Prod/Supabase).
*   **ORM:** TypeORM.
*   **Auth:** Custom JWT (Note: Transitioning to Supabase Auth).

For a detailed analysis, see [Technology Stack Assessment](docs/PHASE_1_TECH_STACK.md).

---

## 🎨 Design System

**Target Identity:** `shadcn/ui` + Tailwind CSS.

*   **Primary Color:** WhatsApp Green (`#25D366`)
*   **Secondary Color:** Teal (`#128C7E`)
*   **Font:** Inter
*   **Visual Style:** Glassmorphism, Rounded Corners (8px), Dark Mode Support.

> **Note:** The project is currently in a hybrid state, transitioning from Ant Design to a pure Tailwind/Shadcn system.

---

## 🚦 Getting Started

### Prerequisites
*   Node.js 18+
*   pnpm 8+ (`npm i -g pnpm`)
*   Docker (Optional, for DB)

### Installation

1.  **Clone:**
    ```bash
    git clone https://github.com/JustAGhosT/whatssummarize.git
    cd whatssummarize
    ```

2.  **Install:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    ```bash
    cp apps/web/.env.example apps/web/.env.local
    cp apps/api/.env.example apps/api/.env
    ```

4.  **Run Development:**
    ```bash
    pnpm dev
    ```

---

## 📚 Documentation

*   [Implementation Plan](docs/IMPLEMENTATION_PLAN.md): Roadmap for upcoming refactors and features.
*   [Technical Debt Registry](docs/TECHNICAL_DEBT.md): Known issues and tracking.
*   [Code Review Analysis](docs/CODE_REVIEW_ANALYSIS.md): Deep dive into the codebase state.
*   [Architecture](docs/architecture.md)

---

## 🧪 Testing

*   **Unit/Integration:** `pnpm test` (Jest)
*   **E2E/Visual:** `pnpm test:ui` (Playwright - *Coming Soon*)

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md).

1.  Fork the repo.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
