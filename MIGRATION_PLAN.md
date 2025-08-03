# Codebase Reorganization Plan

## Target Structure

project-root/
├── apps/
│   ├── frontend/      # Frontend application
│   ├── backend/       # Backend application  
│   ├── web/           # Frontend application (from frontend/)
│   └── api/           # Backend application (from backend/)
├── packages/
│   ├── ui/            # Shared UI components
│   ├── config/        # Shared configurations
│   └── utils/         # Shared utilities
├── tools/             # Development tools and scripts
└── docs/              # Project documentation

## Migration Tasks

### 1. Directory Restructuring

- [x] Rename `frontend/` to `apps/web/`
- [x] Rename `backend/` to `apps/api/`
- [x] Create `packages/` directory structure
  - [x] `packages/ui/`
  - [x] `packages/config/`
  - [x] `packages/utils/`

### 2. Move and Reorganize Code

- [x] Move shared UI components to `packages/ui/`
  - [x] Button component
  - [x] Input component (including SearchInput)
  - [x] Label component
  - [x] Card component
  - [x] Dropdown Menu component
- [x] Move shared configurations to `packages/config/`
  - [x] Added base TypeScript configuration
  - [x] Added shared ESLint configuration
  - [x] Set up package structure and dependencies
- [x] Move shared utilities to `packages/utils/`
  - [x] Added common utility functions (cn, formatDate, truncate, etc.)
  - [x] Set up package structure and dependencies
  - [x] Added TypeScript configuration
- [x] Move test utilities to `tools/test-utils/`
  - [x] Created structured test utilities package
  - [x] Added custom render with theme provider
  - [x] Added common test mocks (router, localStorage, etc.)
  - [x] Added test utility functions and helpers
  - [x] Added TypeScript support and proper type definitions
- [x] Move development scripts to `tools/scripts/`
  - [x] Set up TypeScript configuration for scripts
  - [x] Moved and converted `generate-test-data.js` to TypeScript
  - [x] Moved and converted `organize-tests.js` to TypeScript
  - [x] Added proper error handling and user feedback
  - [x] Created documentation in README.md

### 3. Update Configuration Files

- [x] Update `package.json` workspaces
  - [x] Added workspaces configuration for packages and tools
  - [x] Added new scripts for development tasks
  - [x] Updated devDependencies with required packages
  - [x] Added lint-staged configuration
- [x] Update import paths in source files
  - [x] Updated @/lib/ → @utils/ imports
  - [x] Updated @/components/ → @ui/ imports
  - [x] Processed 195 files, updated 2 files
- [ ] Update build configurations
- [ ] Update test configurations
- [ ] Update CI/CD pipelines

### 4. Testing and Validation

- [ ] Run test suite
- [ ] Verify build process
- [ ] Test application functionality

### 5. Cleanup

- [ ] Remove old directories and files
- [ ] Update documentation
- [ ] Commit changes

## Notes

- All file paths in configuration files will need to be updated to reflect the new structure.
- Dependencies between packages should be updated to use workspace references.
- Ensure all team members are aware of the new structure and update their local environments accordingly.
