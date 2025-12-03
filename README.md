# WhatsSummarize - WhatsApp Conversation Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A comprehensive platform for analyzing and summarizing WhatsApp conversations using AI-powered tools. Upload chat exports, gain insights, and get intelligent summaries of your messaging history.

## Overview

WhatsSummarize provides a centralized dashboard for users to upload, analyze, and receive AI-powered summaries of their WhatsApp chat histories. Built with a modern, scalable, and privacy-focused architecture.

### Key Features

- **WhatsApp Integration** - Upload and analyze WhatsApp chat exports (.txt format)
- **AI-Powered Summaries** - Get intelligent summaries using OpenAI GPT-4 or Claude
- **Chrome Extension** - Extract chats directly from WhatsApp Web (POC)
- **Dashboard & Analytics** - Visualize conversation statistics and patterns
- **Modern UI** - Clean, responsive interface with dark mode support
- **Secure Authentication** - Protected with Supabase Auth or custom JWT
- **Privacy First** - Your data stays secure with encryption at rest

### Roadmap

- [ ] Multi-platform support (Telegram, Discord, Slack)
- [ ] Real-time chat analysis
- [ ] Sentiment analysis and topic extraction
- [ ] Export summaries to PDF/CSV
- [ ] Mobile app (iOS/Android)

---

## Technology Stack

### Monorepo Structure

This project uses a monorepo architecture managed with **pnpm** and **Turborepo**.

```
whatssummarize/
├── apps/
│   ├── web/              # Next.js 14 frontend (primary)
│   ├── api/              # Express.js backend API
│   ├── chrome-extension/ # Browser extension for WhatsApp Web
│   ├── backend/          # Alternative Fastify backend
│   └── frontend/         # Legacy Vite React frontend
├── packages/
│   ├── ui/               # Shared UI component library
│   ├── contexts/         # React contexts (auth, app state)
│   ├── utils/            # Shared utility functions
│   ├── config/           # Shared configuration
│   ├── shared/           # Shared types and constants
│   └── monitoring/       # Error monitoring package
├── tests/                # Centralized test suite
├── docs/                 # Documentation
└── tools/                # Build tools and scripts
```

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 14.x | React framework with App Router |
| [TypeScript](https://typescriptlang.org/) | 5.3+ | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4+ | Utility-first styling |
| [Radix UI](https://radix-ui.com/) | Latest | Accessible UI primitives |
| [Lucide React](https://lucide.dev/) | Latest | Icon library |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Node.js](https://nodejs.org/) | 18+ | JavaScript runtime |
| [Express](https://expressjs.com/) | 4.x | Web framework |
| [TypeORM](https://typeorm.io/) | Latest | Database ORM |
| [PostgreSQL](https://postgresql.org/) / SQLite | - | Database |
| [Socket.io](https://socket.io/) | Latest | Real-time communication |
| [Supabase](https://supabase.com/) | - | Auth & database (optional) |

### Testing & Quality

| Tool | Purpose |
|------|---------|
| [Jest](https://jestjs.io/) | Unit/integration testing |
| [React Testing Library](https://testing-library.com/) | Component testing |
| [Playwright](https://playwright.dev/) | E2E testing |
| [ESLint](https://eslint.org/) | Code linting |
| [Prettier](https://prettier.io/) | Code formatting |
| [Husky](https://typicode.github.io/husky/) | Git hooks |

---

## Design System

### Brand Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Primary | `#25D366` | `hsl(142.1 70.6% 45.3%)` | Buttons, links, accents |
| Primary Hover | `#34E89E` | - | Hover states |
| Secondary | `#128C7E` | `hsl(217.2 32.6% 17.5%)` | Secondary elements |
| Background | `#FFFFFF` | `hsl(222.2 84% 4.9%)` | Page background |
| Foreground | `#111827` | `hsl(210 40% 98%)` | Text |
| Destructive | `#DC2626` | - | Errors, warnings |

### Typography

- **Font Family:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700, 800

### Component Library

Based on [shadcn/ui](https://ui.shadcn.com/) methodology:
- Button (7 variants)
- Card, Input, Label, Checkbox
- Select, Switch, Tabs
- Dropdown Menu, Toast, Tooltip
- Loading states, Skeletons, Empty states

See `packages/ui/` for the complete component library.

---

## Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **pnpm** 8.x (`npm install -g pnpm`)
- **Git** ([download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JustAGhosT/whatssummarize.git
   cd whatssummarize
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   For the web app:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

   For the API:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

4. **Start development servers**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:3001](http://localhost:3001)

### Environment Variables

#### Web App (`apps/web/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes* | Supabase anonymous key |
| `NEXT_PUBLIC_API_URL` | No | API server URL (default: localhost:3001) |

*Required for production. Development mode includes mock authentication.

#### API Server (`apps/api/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes** | Secret for JWT tokens (min 32 chars) |
| `DATABASE_PATH` | No | SQLite database path |
| `OPENAI_API_KEY` | No | OpenAI API key for AI summaries |
| `ANTHROPIC_API_KEY` | No | Anthropic API key (alternative) |

**Required for production. Development mode uses placeholder.

---

## Project Structure

### Apps

| App | Port | Description |
|-----|------|-------------|
| `apps/web` | 3000 | Main Next.js frontend |
| `apps/api` | 3001 | Express API server |
| `apps/chrome-extension` | - | WhatsApp Web browser extension |

### Key Files

```
apps/web/src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication
│   └── ...
├── components/
│   ├── ui/                # UI components
│   ├── features/          # Feature components
│   └── layouts/           # Layout components
├── contexts/              # React contexts
├── lib/                   # Utilities
│   └── supabase/          # Supabase client
└── styles/                # Global styles

apps/api/src/
├── config/                # Configuration
├── db/                    # Database entities
├── middleware/            # Express middleware
├── routes/                # API routes
├── services/              # Business logic
│   └── ai/                # AI summary service
└── utils/                 # Utilities
```

---

## Development

### Available Scripts

```bash
# Start all apps in development mode
pnpm dev

# Build all apps for production
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Clean build artifacts
pnpm clean
```

### Running Individual Apps

```bash
# Start only the web app
pnpm --filter whatsapp-conversation-summarizer-frontend dev

# Start only the API
pnpm --filter @whatssummarize/api dev
```

### Chrome Extension Development

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `apps/chrome-extension/`

---

## Testing

### Test Types

- **Unit Tests:** `tests/unit/`
- **Component Tests:** `tests/components/`
- **Integration Tests:** `tests/integration/`
- **E2E Tests:** `tests/e2e/`
- **Performance Tests:** `tests/performance/`

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run E2E tests
pnpm --filter @playwright/test test
```

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Chat Export Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat-export/upload` | Upload chat file |
| POST | `/api/chat-export/extension` | Receive from extension |
| GET | `/api/chat-export/:id` | Get export by ID |

See `docs/api/openapi.yaml` for complete API documentation.

---

## Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with `git push`

### API Deployment

The API can be deployed to:
- Vercel Serverless Functions
- Railway
- Render
- Docker containers

See `docs/runbook.md` for detailed deployment instructions.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | System architecture overview |
| [Authentication](docs/AUTHENTICATION.md) | Auth flow documentation |
| [Testing Strategy](docs/TESTING_STRATEGY.md) | Testing approach |
| [Observability](docs/OBSERVABILITY.md) | Monitoring and logging |
| [User Guide](docs/USER_GUIDE.md) | End-user documentation |
| [Roadmap](docs/ROADMAP.md) | Development roadmap |
| [Code Review Analysis](docs/CODE_REVIEW_ANALYSIS.md) | Detailed code analysis |

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## Security

For security vulnerabilities, please see our [Security Policy](SECURITY.md) or email security@whatssummarize.com.

### Best Practices

- Never commit `.env` files
- Use strong JWT secrets in production
- Enable HTTPS in production
- Implement rate limiting
- Sanitize user input

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI component inspiration
- [Supabase](https://supabase.com/) - Authentication and database
- [Vercel](https://vercel.com/) - Hosting platform
- [OpenAI](https://openai.com/) / [Anthropic](https://anthropic.com/) - AI providers

---

## Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/JustAGhosT/whatssummarize/issues)
- **Discussions:** [GitHub Discussions](https://github.com/JustAGhosT/whatssummarize/discussions)

---

*Built with ❤️ by the WhatsSummarize team*
