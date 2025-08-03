# Social Media Conversation Summarizer

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJustAGhosT%2Fwhatssummarize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](https://github.com/JustAGhosT/whatssummarize/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A comprehensive platform for analyzing and summarizing conversations across multiple messaging platforms including WhatsApp, Telegram, and Discord. Built with Next.js, TypeScript, and a robust backend service.

## 🚀 Current Status: Phase 1 - MVP Development

We're currently in the MVP phase, focusing on core functionality and WhatsApp integration.
Currently looking for someone to drive the project over the line. As soon as someone signs up you'd be able to check out our [roadmap](../docs/ROADMAP.md) for details on upcoming features and progress.

## ✨ Features

### Core Features (Implemented)

- 📱 WhatsApp Web integration with real-time monitoring
- 📊 Basic chat analytics and message statistics
- 🔍 Message search functionality
- 🎨 Dark/Light mode support
- 📱 Responsive web interface

### Coming Soon (Phase 1)

- 📤 WhatsApp export file upload
- 🤖 AI-powered conversation summaries
- 📅 Message filtering by date range
- 👥 Contact and group management

### Planned Features

- 🔄 Multi-platform support (Telegram, Discord)
- 📧 Email/SMS summary delivery
- 🔒 End-to-end encryption
- 🏢 Enterprise features (Teams, Roles, Permissions)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8.x (or npm/yarn)
- Git 2.25+
- Chrome/Chromium browser (for Puppeteer)
- Supabase account (for authentication)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/JustAGhosT/whatssummarize.git
   cd whatssummarize
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   pnpm install
   
   # Install frontend dependencies
   cd frontend
   pnpm install
   
   # Install backend dependencies
   cd ../backend
   pnpm install
   cd ..
   ```

3. **Set up environment variables**

   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env.local
   
   # Backend
   cp backend/.env.example backend/.env
   
   # Update the variables in both files with your credentials
   ```

4. **Start the development servers**

   ```bash
   # In one terminal (backend)
   cd backend && pnpm dev
   
   # In another terminal (frontend)
   cd frontend && pnpm dev
   ```

5. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

## 🗺️ Roadmap

### Phase 1: MVP (Current)

- [x] WhatsApp Web integration
- [ ] File upload system with drag-and-drop
- [ ] WhatsApp export parser (.txt format)
- [ ] Basic summarization engine
- [ ] User dashboard with analytics

### Phase 2: Multi-Platform Expansion

- [ ] Telegram bot integration
- [ ] Discord bot integration
- [ ] Unified summary generation
- [ ] Email/SMS delivery

### Phase 3: Advanced Features

- [ ] WhatsApp Business API integration
- [ ] Browser extension
- [ ] Enterprise features
- [ ] Advanced AI analysis

## 🛠️ Development

### Project Structure

``` text
.
├── frontend/          # Next.js frontend application
├── backend/           # Node.js backend service
├── shared/            # Shared types and utilities
└── tests/             # Test suites
```

### Testing

Run the test suite:

```bash
# Run all tests
pnpm test

# Run frontend tests
cd frontend && pnpm test

# Run backend tests
cd backend && pnpm test
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd frontend
pnpm build

# Build backend
cd ../backend
pnpm build
```

### One-Click Deployment

Deploy your own instance with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJustAGhosT%2Fwhatssummarize)

## 📚 Documentation

For detailed documentation, please visit our [Documentation Wiki](https://github.com/JustAGhosT/whatssummarize/wiki).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components powered by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Backend powered by [Node.js](https://nodejs.org/) and [Puppeteer](https://pptr.dev/)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📈 Project Status

[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)

## 🔗 Related Projects

- [WhatsApp Web API](https://github.com/pedroslopez/whatsapp-web.js/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Discord.js](https://discord.js.org/)

## 📬 Contact

For feature requests and support, please [open an issue](https://github.com/JustAGhosT/whatssummarize/issues).
