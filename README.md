# Social Media Conversation Summarizer

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJustAGhosT%2Fwhatssummarize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A comprehensive platform for analyzing and summarizing conversations across multiple messaging platforms, starting with WhatsApp.

## 🚀 Overview

This project aims to provide a centralized dashboard for users to upload, analyze, and receive AI-powered summaries of their chat histories from various messaging platforms. It is built with a modern, scalable, and secure technology stack, designed for a high-quality user experience.

## ✨ Features

- **📱 WhatsApp Integration:** Upload and analyze WhatsApp chat exports.
- **📊 Dashboard & Analytics:** Visualize key statistics about your conversations.
- **🎨 Modern UI:** A clean, consistent, and responsive user interface.
- **🔐 Secure Authentication:** User accounts are protected with Supabase Auth.
- **🚧 Roadmap:** Future plans include multi-platform support (Telegram, Discord), real-time analysis, and more.

## 🛠️ Technology Stack & Architecture

This project is a monorepo managed with `pnpm` and `Turbo`.

- **Frontend:**
  - **Framework:** [Next.js](https://nextjs.org/) (App Router)
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
  - **UI Components:** A custom, in-house component library built with [Tailwind CSS](https://tailwindcss.com/) and Radix UI primitives, following the `shadcn/ui` methodology.
  - **Styling:** Tailwind CSS for utility-first styling.
  - **Icons:** [Lucide React](https://lucide.dev/)
- **Backend:**
  - **Platform:** [Supabase](https://supabase.com/)
  - **Database:** PostgreSQL with Row Level Security (RLS)
  - **Authentication:** Supabase Auth
  - **Storage:** Supabase Storage for file uploads.
- **Testing:**
  - **Unit/Integration:** [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
  - **E2E:** [Playwright](https://playwright.dev/)

The architecture is designed to be server-centric, leveraging Next.js's server-side rendering capabilities for performance and security. Authentication is handled by server-side middleware to protect user routes.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8.x
- Git
- A [Supabase](https://supabase.com/) account

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/JustAGhosT/whatssummarize.git
   cd whatssummarize
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up Supabase**

   - Go to [Supabase](https://supabase.com) and create a new project.
   - Navigate to the **Settings > API** section of your project.
   - Find your **Project URL** and **anon (public) key**.
   - Create a `.env.local` file in the `apps/web` directory by copying the example:
     ```bash
     cp apps/web/.env.example apps/web/.env.local
     ```
   - Add your Supabase credentials to the `apps/web/.env.local` file:
     ```
     NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
     ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   The application will be available at [http://localhost:3000](http://localhost:3000).

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
