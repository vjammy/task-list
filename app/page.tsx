import { getDb } from '@/db';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { FilterBar } from './components/FilterBar';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface Category {
  id: number;
  name: string;
  color: string;
}

async function getTasks(searchParams: { status?: string; category_id?: string; priority?: string }) {
  const sql = getDb();
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let paramIdx = 1;

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
  const query = `
    SELECT t.*, c.name AS category_name, c.color AS category_color
    FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
    ${where}
    ORDER BY
      CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END,
      t.created_at DESC
  `;

  return sql.query(query, params) as Promise<Record<string, unknown>[]>;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category_id?: string; priority?: string }>;
}) {
  const params = await searchParams;
  const sql = getDb();

  const categories = await sql`SELECT * FROM categories ORDER BY name` as Category[];
  const tasks = await getTasks(params);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Task List</h1>
      <TaskForm categories={categories} />
      <Suspense fallback={<div className="text-center py-4 text-gray-500">Loading filters...</div>}>
        <FilterBar categories={categories} />
      </Suspense>
      <TaskList tasks={tasks} />
    </main>
  );
}
