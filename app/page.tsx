import { getDb } from '@/db';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { FilterBar } from './components/FilterBar';
import { CategoryManager } from './components/CategoryManager';
import { ToastProvider } from './components/Toast';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface Category {
  id: number;
  name: string;
  color: string;
}

async function getTasks(searchParams: { status?: string; category_id?: string; priority?: string; q?: string; page?: string }) {
  const sql = getDb();
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let paramIdx = 1;

  if (searchParams.q) {
    conditions.push(`(t.title ILIKE $${paramIdx} OR t.description ILIKE $${paramIdx})`);
    params.push(`%${searchParams.q}%`);
    paramIdx++;
  }
  if (searchParams.status) {
    conditions.push(`t.status = $${paramIdx++}`);
    params.push(searchParams.status);
  }
  if (searchParams.category_id) {
    conditions.push(`t.category_id = $${paramIdx++}`);
    params.push(Number(searchParams.category_id));
  }
  if (searchParams.priority) {
    conditions.push(`t.priority = $${paramIdx++}`);
    params.push(searchParams.priority);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await sql.query(`SELECT COUNT(*)::int AS count FROM tasks t ${where}`, params) as { count: number }[];
  const total = countResult[0]?.count ?? 0;

  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = 10;
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  const query = `
    SELECT t.*, c.name AS category_name, c.color AS category_color
    FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
    ${where}
    ORDER BY
      CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END,
      t.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const tasks = await sql.query(query, params) as Record<string, unknown>[];
  return { tasks, page, totalPages, total };
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category_id: number | null;
  category_name: string | null;
  category_color: string | null;
  due_date: string | null;
  created_at: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category_id?: string; priority?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const sql = getDb();

  const categories = await sql`SELECT * FROM categories ORDER BY name` as Category[];
  const { tasks, page, totalPages, total } = await getTasks(params);

  return (
    <ToastProvider>
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Task List</h1>
      <TaskForm categories={categories} />
      <CategoryManager categories={categories} />
      <Suspense fallback={<div className="text-center py-4 text-gray-500">Loading filters...</div>}>
        <FilterBar categories={categories} />
      </Suspense>
      <TaskList tasks={tasks as unknown as Task[]} categories={categories} />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-sm text-gray-600">{total} task{total !== 1 ? 's' : ''}</span>
          {page > 1 && (
            <a href={`?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">Prev</a>
          )}
          <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <a href={`?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">Next</a>
          )}
        </div>
      )}
    </main>
    </ToastProvider>
  );
}
