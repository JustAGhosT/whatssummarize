# WhatsApp Conversation Summarizer

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJustAGhosT%2Fwhatssummarize)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](https://github.com/JustAGhosT/whatssummarize/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A powerful tool to analyze and summarize your WhatsApp conversations, providing insights and analytics about your chats. Built with Next.js, TypeScript, and Supabase.

## ✨ Features

- 📊 Advanced chat analytics and visualization
- 🤖 AI-powered conversation summaries
- 🔍 Full-text search across all conversations
- 🎨 Dark/Light mode with system preference
- 📱 Fully responsive design
- 🔄 Real-time updates
- 📤 Export reports in multiple formats
- 🔒 End-to-end encryption for privacy
- 🚀 Blazing fast performance

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8.x (or npm/yarn)
- Git 2.25+
- Supabase account (for backend services)

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Update the variables in .env.local with your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

### Production Deployment

Deploy your own instance with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJustAGhosT%2Fwhatssummarize)

## 🛠️ Build

To create a production build:

```bash
pnpm build
# or
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components powered by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
