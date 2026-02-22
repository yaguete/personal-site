# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ThinkMakeTest.ai - Personal website combining portfolio, blog (MDX), and experimental AI playground tools. Built with Next.js 15 (App Router), React 19, and Tailwind CSS 4.

## Commands

```bash
# Development (use --webpack flag to avoid MDX issues with Turbopack)
npm run dev          # Starts Next.js on localhost:3000

# Full stack (frontend + Flask backend for playground tools)
./start.sh           # Starts backend (localhost:5001) + frontend (localhost:3000)
./stop.sh            # Stops both servers

# Build and lint
npm run build        # Production build
npm run lint         # ESLint + Prettier

# Manual backend only
cd heroku-deploy && source venv/bin/activate && python3 main.py
```

## Architecture

### Data Flow
- `app/data.ts` → Single source of truth for all content (work experience, education, projects, blog posts)
- `app/page.tsx` → Homepage that imports and renders data from `data.ts`
- **Rule**: Never duplicate content in `page.tsx`; always edit `data.ts`

### Key Directories
- `app/` - Next.js App Router application
- `app/api/` - API routes (proxy to Flask backend)
- `app/components/` - Shared UI components
- `app/playground/` - Self-contained experimental tools (each with own page, components, optional backend)
- `heroku-deploy/` - Flask backend services (legacy/support - avoid adding new logic)
- `lib/` - Shared utilities

### Playground Tool Structure
Each tool in `app/playground/[tool-name]/` follows:
```
page.tsx              # Main page
components/           # Tool-specific components
api/route.ts          # Next.js API route (if needed)
backend/              # Python service (if needed)
README.md             # Tool documentation
```

### SEO/Structured Data
JSON-LD exists in two places - keep descriptions synchronized:
1. `app/layout.tsx` - Main ProfilePage + Person schema (lines ~25 and ~82)
2. `app/components/StructuredData.tsx` - Fallback for blog posts (~line 50)

## Code Style

### TypeScript/React
- **Components**: PascalCase (`ContactSection.tsx`)
- **Hooks**: camelCase with "use" prefix (`useClickOutside.tsx`)
- **Functions/variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Imports**: Use `@/*` path aliases (configured in tsconfig.json)

### Python (heroku-deploy/)
- **Files/directories**: snake_case
- **Functions/variables**: snake_case
- **Classes**: PascalCase

### Prettier Config
- No semicolons
- Single quotes
- 2-space tabs
- Trailing commas

## API Routes

All API routes validate input and use environment-based backend URLs:
- Development: `http://127.0.0.1:5001`
- Production: Heroku URL

Available endpoints:
- `/api/linkedin-recommendation` - LinkedIn recommendation generator
- `/api/preprint-audit` - Academic preprint PDF analysis
- `/api/profile-analyzer` - Candidate profile analysis
- `/api/printbuddy` - HP Support knowledge base search

## Detailed Documentation

For comprehensive standards and technical details:
- `docs/PROJECT_STRUCTURE_STANDARDS.md` - Naming conventions, security, git workflow
- `docs/TECHNICAL_DOCUMENTATION.md` - Component flows, deployment, SEO details
