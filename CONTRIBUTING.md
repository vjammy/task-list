# Contributing to Task List

Thank you for your interest in contributing. This guide covers the basics for getting started.

## Setup

1. Fork and clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and configure your `DATABASE_URL`
4. Run `db/schema.sql` against your database
5. Start the dev server with `npm run dev`

## Development Workflow

1. Create a branch from `master`:
   ```bash
   git checkout -b your-name/short-description
   ```

2. Make your changes. Keep commits focused and descriptive.

3. Verify your changes:
   ```bash
   npm run lint
   npm run build
   ```

4. Push and open a pull request against `master`.

## Code Style

- **TypeScript** — Strict mode is enabled. Avoid `any`; use proper types.
- **Components** — Use `'use client'` only when interactivity is required. Default to server components.
- **Styling** — Tailwind CSS utility classes. No custom CSS unless unavoidable.
- **Server Actions** — All mutations go through `app/actions/`. Always include input validation and try/catch error handling.
- **Database** — Raw SQL via the Neon serverless client. Always include `updated_at = now()` in UPDATE queries.

## Commit Messages

Use present tense, imperative style:

```
Add search filter to task list
Fix pagination offset calculation
Replace any with proper types
```

## Pull Request Guidelines

- One logical change per PR
- Include a clear description of what and why
- Ensure `npm run lint` and `npm run build` pass
- Link any related issues

## Reporting Issues

Open an issue with:

- Steps to reproduce
- Expected vs actual behavior
- Browser and Node.js version
