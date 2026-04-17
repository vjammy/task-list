# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] — 2026-04-17

### Added

- Task CRUD: create, read, update, delete tasks with title, description, status, priority, category, and due date
- Status workflow: cycle through pending → in_progress → completed
- Priority levels: low, medium, high
- Category management: create and delete color-coded categories
- Five default categories: Work, Personal, Shopping, Health, Learning
- Search: full-text search across task titles and descriptions
- Filters: filter tasks by status, priority, and category
- Pagination: 10 tasks per page
- Inline task editing
- Toast notifications for user feedback
- Responsive design with Tailwind CSS

### Fixed

- Added input validation to all server actions
- Added try/catch error handling to all server actions
- Set `updated_at = now()` in all UPDATE queries
- Added `.env.example` and updated `.gitignore` for `DATABASE_URL`
- Used Geist font via CSS variable instead of hardcoded Arial
- Cached `neon()` client as module-level singleton
- Replaced explicit `any` with proper TypeScript types for ESLint
- Prevented `updateTask` from overwriting fields with null
- UI improvements and remaining bug fixes across components
