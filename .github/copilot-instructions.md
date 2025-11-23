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
