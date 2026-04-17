# Task List

A full-featured task management application built with Next.js, Neon (PostgreSQL), and Tailwind CSS.

## Features

- **Task CRUD** — Create, read, update, and delete tasks with title, description, status, priority, category, and due date
- **Status Workflow** — Cycle tasks through `pending` → `in_progress` → `completed`
- **Priority Levels** — Assign `low`, `medium`, or `high` priority to tasks
- **Category Management** — Organize tasks with color-coded categories (Work, Personal, Shopping, Health, Learning included by default)
- **Search & Filter** — Full-text search across task titles and descriptions; filter by status, priority, and category
- **Pagination** — Efficient browsing with 10 tasks per page
- **Inline Editing** — Edit tasks directly in the UI without page navigation
- **Toast Notifications** — Real-time feedback for all user actions
- **Responsive Design** — Mobile-first layout using Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Database | Neon (Serverless PostgreSQL) |
| Forms | Next.js Server Actions |

## Prerequisites

- **Node.js** 18.17 or later
- **Neon account** — [sign up free](https://neon.tech)
- **psql** (optional, for manual schema setup)

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd task-list
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your Neon connection string:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### 3. Initialize the database

Run the schema against your Neon database:

```bash
psql "postgresql://user:password@host/database?sslmode=require" -f db/schema.sql
```

Or paste the contents of `db/schema.sql` into the Neon SQL editor.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  actions/        # Server actions (mutations)
  api/            # REST API routes
  components/     # React UI components
  layout.tsx      # Root layout
  page.tsx        # Home page
  globals.css     # Global styles
db/
  index.ts        # Neon client singleton
  schema.sql      # Database schema + seed data
```

## Database Schema

### `tasks`

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| title | VARCHAR(255) | Required |
| description | TEXT | Optional |
| status | VARCHAR(20) | `pending`, `in_progress`, or `completed` |
| priority | VARCHAR(10) | `low`, `medium`, or `high` |
| category_id | INTEGER | Foreign key → `categories.id` |
| due_date | DATE | Optional |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

### `categories`

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Unique |
| color | VARCHAR(7) | Hex color code |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List all tasks (supports query params) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/[id]` | Get a task by ID |
| PATCH | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create a category |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

Private — all rights reserved.
