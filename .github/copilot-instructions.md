<<<<<<< HEAD
# Mystira.App - AI Assistant Instructions

## Project Overview
Mystira is an interactive adventure platform for children featuring educational storytelling with gamification elements.

## Architecture Rules (STRICT)
- **Hexagonal/Clean Architecture**: Strict layer separation
- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Use cases, orchestration, MediatR handlers
- **Infrastructure Layer**: External services, database, third-party integrations
- **API Layer**: Controllers only, no business logic
- **NO VIOLATIONS**: Breaking these rules requires explicit justification

## Technology Stack
- **Backend**: .NET 9, C#, ASP.NET Core
- **Frontend**: Blazor WebAssembly PWA
- **Database**: Azure Cosmos DB
- **Cloud**: Azure
- **Architecture**: Hexagonal/Clean Architecture with DDD

## Code Generation Rules

### When Creating API Endpoints
```csharp
// Always use this pattern:
[ApiController]
[Route("api/[controller]")]
public class EntityController : ControllerBase
{
    private readonly IMediator _mediator;
    // Controller should ONLY dispatch to MediatR
}
```

### When Creating Use Cases
```csharp
// Always follow this structure:
public class UseCaseNameCommand : IRequest
{
    // Command properties
}

public class UseCaseNameHandler : IRequestHandler
{
    // Handler implementation with dependency injection
}

public class UseCaseNameValidator : AbstractValidator
{
    // Validation rules
}
```

### When Working with Domain Entities
```csharp
// Domain entities must:
// 1. Inherit from BaseEntity or AggregateRoot
// 2. Use private setters
// 3. Include business logic as methods
// 4. Raise domain events when state changes
```

## Security Requirements
- **COPPA Compliance**: Required for all child-related features
- **PII Protection**: Never log or expose personally identifiable information
- **Authentication**: Use JWT with proper claims
- **Authorization**: Role-based with policy requirements
- **Input Validation**: FluentValidation on all commands/queries

## Testing Requirements
- **Unit Tests**: Minimum 80% code coverage
- **Integration Tests**: All API endpoints
- **Architecture Tests**: Enforce layer dependencies
- **Security Tests**: Authentication/authorization flows

## Performance Standards
- **API Response Time**: <200ms for 95th percentile
- **Database Queries**: Use proper indexing and pagination
- **Caching**: Redis for frequently accessed data
- **Async/Await**: All I/O operations must be async

## File Organization
```
/src
  /Mystira.App.Domain           # Pure domain logic
  /Mystira.App.Application      # Use cases and orchestration
  /Mystira.App.Infrastructure   # External services
  /Mystira.App.Api              # Public API
  /Mystira.App.Admin.Api        # Admin API
  /Mystira.App.PWA              # Blazor frontend
/tests
  /Mystira.App.Domain.Tests
  /Mystira.App.Application.Tests
  /Mystira.App.Api.Tests
  /Mystira.App.Architecture.Tests
```

## Common Commands

### Build and Test
```bash
dotnet build
dotnet test
dotnet format
```

### Run Services
```bash
dotnet run --project src/Mystira.App.Api
dotnet run --project src/Mystira.App.Admin.Api
dotnet run --project src/Mystira.App.PWA
```

## Important Documentation
- [Architecture Rules](./docs/architecture/ARCHITECTURAL_RULES.md)
- [Best Practices](./docs/best-practices.md)
- [API Documentation](./docs/api/README.md)
- [Setup Guide](./docs/setup/README.md)

## AI Assistant Behavior

### When Asked to Create Code
1. Always check architecture compliance
2. Follow established patterns in the codebase
3. Include proper error handling
4. Add XML documentation comments
5. Create corresponding unit tests

### When Reviewing Code
1. Verify layer separation
2. Check for business logic in controllers
3. Ensure async/await usage
4. Validate security considerations
5. Confirm test coverage

### When Suggesting Improvements
1. Prioritize child safety and COPPA compliance
2. Focus on performance and scalability
3. Maintain clean architecture principles
4. Consider Azure-native solutions
5. Suggest appropriate design patterns
=======
# WhatsApp Conversation Summarizer - AI Assistant Instructions

## Project Overview
A comprehensive platform for analyzing and summarizing conversations across multiple messaging platforms, starting with WhatsApp. The application provides AI-powered summaries of chat histories with a modern, secure, and scalable architecture.

## Architecture

This is a **monorepo** managed with `pnpm` and `Turbo`, following a modular architecture with clear separation of concerns.

### Key Principles
- **Server-Side Rendering**: Leverage Next.js App Router for optimal performance and security
- **Authentication Middleware**: Server-side authentication protection for all user routes
- **Component-Based UI**: Reusable, accessible components following shadcn/ui methodology
- **Type Safety**: Strict TypeScript across the entire codebase
- **Testing**: Comprehensive test coverage with Jest, React Testing Library, and Playwright

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **UI Components**: Custom component library using Tailwind CSS and Radix UI primitives (shadcn/ui style)
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React
- **State Management**: React Context and Server Components

### Backend
- **Platform**: Supabase
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with SSR
- **Storage**: Supabase Storage for file uploads
- **API**: Next.js API Routes and Server Actions

### Testing
- **Unit/Integration**: Jest with React Testing Library
- **E2E**: Playwright
- **Coverage**: SonarCloud integration

### DevOps
- **Package Manager**: pnpm 8.x
- **Build Tool**: Turbo (monorepo orchestration)
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, SonarCloud
- **Deployment**: Vercel (optional, can be toggled)

## Project Structure

```
.
├── apps/
│   ├── web/           # Next.js frontend application (primary app)
│   ├── api/           # Backend API service
│   ├── backend/       # Node.js backend service
│   └── frontend/      # Additional frontend service
├── packages/          # Shared packages and utilities
├── tests/             # E2E test suites (Playwright)
├── tools/             # Build and development tools
└── docs/              # Documentation
```

## Code Generation Rules

### When Creating Next.js Pages (App Router)
```typescript
// app/[route]/page.tsx
// Always use Server Components by default
export default async function PageName() {
  // Fetch data directly in the component
  const data = await fetchData();
  
  return (
    <div>
      {/* UI components */}
    </div>
  );
}

// For client components, use 'use client' directive
'use client';

export default function ClientComponent() {
  // Client-side logic
}
```

### When Creating API Routes
```typescript
// app/api/[route]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Always validate authentication first
  // Handle the request
  // Return proper NextResponse
}

export async function POST(request: NextRequest) {
  // Same pattern
}
```

### When Creating UI Components
```typescript
// Always follow shadcn/ui patterns
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Always define props interface
  className?: string;
  // Other props
}

export function Component({ className, ...props }: ComponentProps) {
  return (
    <div className={cn("base-classes", className)} {...props}>
      {/* Component content */}
    </div>
  );
}
```

### When Working with Supabase Auth
```typescript
// Always use SSR-compatible clients
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Cookie handlers
      }
    }
  );
}
```

## Coding Standards

### TypeScript
- **Always use strict mode**
- Define interfaces for all component props
- Use type inference where possible, but be explicit when needed
- Avoid `any` type - use `unknown` or proper types
- Use enums for constants with multiple related values

### React/Next.js
- Prefer Server Components over Client Components
- Use Server Actions for mutations when possible
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Use proper error boundaries
- Implement loading and error states

### Styling
- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use the `cn()` utility for conditional classes
- Maintain consistent spacing (use Tailwind's spacing scale)
- Follow accessibility best practices (ARIA labels, semantic HTML)

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Testing
```typescript
// Component tests
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });
});

// E2E tests (Playwright)
import { test, expect } from '@playwright/test';

test('feature description', async ({ page }) => {
  await page.goto('/');
  // Test implementation
});
```

## Security Guidelines

### Authentication
- **Always** protect sensitive routes with middleware
- Verify user sessions server-side
- Use Row Level Security (RLS) in Supabase
- Never expose sensitive data in client components
- Implement proper CORS policies

### Data Handling
- Validate all user inputs
- Sanitize data before rendering
- Use parameterized queries
- Implement rate limiting
- Handle errors gracefully without exposing internals

### Environment Variables
- Prefix public variables with `NEXT_PUBLIC_`
- Never commit secrets to version control
- Use `.env.local` for local development
- Document all required environment variables

## Common Patterns

### Data Fetching
```typescript
// Server Component
async function ServerComponent() {
  const data = await fetch('...', { cache: 'no-store' });
  return <div>{/* render data */}</div>;
}

// Client Component
'use client';
function ClientComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    // Fetch data
  }, []);
  return <div>{/* render data */}</div>;
}
```

### Error Handling
```typescript
// Always use try-catch for async operations
try {
  const result = await operation();
  return NextResponse.json(result);
} catch (error) {
  console.error('Operation failed:', error);
  return NextResponse.json(
    { error: 'Operation failed' },
    { status: 500 }
  );
}
```

### Form Handling
```typescript
// Use Server Actions for form submissions
'use server';
export async function submitForm(formData: FormData) {
  const data = {
    field: formData.get('field') as string,
  };
  // Validate and process
}
```

## Development Workflow

### Before Starting
1. Pull latest changes from main
2. Run `pnpm install` to update dependencies
3. Check for any pending migrations or setup tasks

### During Development
1. Write code following the patterns above
2. Run linter: `pnpm lint`
3. Run tests: `pnpm test`
4. Check types: `tsc --noEmit`
5. Test locally: `pnpm dev`

### Before Committing
1. Ensure all tests pass
2. Run linter and fix issues
3. Verify no console errors
4. Check for security vulnerabilities
5. Update documentation if needed

## Performance Considerations

- Use `next/image` for all images
- Implement proper caching strategies
- Minimize client-side JavaScript
- Use dynamic imports for code splitting
- Optimize bundle size (analyze with `next build`)
- Implement proper loading states

## Accessibility

- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers
- Support reduced motion preferences

## Documentation

- Document complex logic with comments
- Update README for new features
- Maintain API documentation
- Document breaking changes
- Keep migration guides updated

## Key Files to Reference

- `apps/web/middleware.ts` - Authentication middleware
- `apps/web/lib/supabase/server.ts` - Supabase server client
- `apps/web/components/ui/` - Reusable UI components
- `playwright.config.ts` - E2E test configuration
- `sonar-project.properties` - Code quality configuration

## Important Notes

- The Vercel deployment workflow is **disabled by default** (see README)
- Focus is currently on Chrome extension development
- WhatsApp integration is the primary feature
- Multi-platform support (Telegram, Discord) is planned but not yet implemented
- Always check SonarCloud feedback for code quality issues

## Questions to Ask Before Implementing

1. Does this feature require authentication?
2. Should this be a Server or Client Component?
3. What are the error scenarios?
4. How will this affect mobile users?
5. Are there accessibility concerns?
6. Does this need to be tested?
7. Will this impact performance?
8. Should this be documented?

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Playwright](https://playwright.dev/)
>>>>>>> feat-stabilize-wave-1
