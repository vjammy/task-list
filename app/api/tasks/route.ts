import { getDb } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

export async function GET(request: NextRequest) {
  const sql = getDb();
  const { searchParams } = new URL(request.url);

  const status = searchParams.get('status');
  const category_id = searchParams.get('category_id');
  const priority = searchParams.get('priority');

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIdx = 1;

  if (status) { conditions.push(`t.status = $${paramIdx++}`); params.push(status); }
  if (category_id) { conditions.push(`t.category_id = $${paramIdx++}`); params.push(Number(category_id)); }
  if (priority) { conditions.push(`t.priority = $${paramIdx++}`); params.push(priority); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT t.*, c.name AS category_name, c.color AS category_color
    FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
    ${where}
    ORDER BY CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END, t.created_at DESC
  `;

  const tasks = await sql.query(query, params);
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const sql = getDb();
  const body = await request.json();

  if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const status = body.status && VALID_STATUSES.includes(body.status) ? body.status : 'pending';
  const priority = body.priority && VALID_PRIORITIES.includes(body.priority) ? body.priority : 'medium';

  const result = await sql`
    INSERT INTO tasks (title, description, status, priority, category_id, due_date)
    VALUES (${body.title.trim()}, ${body.description ?? ''}, ${status},
            ${priority}, ${body.category_id ?? null}, ${body.due_date ?? null})
    RETURNING *
  `;
  return NextResponse.json(result[0], { status: 201 });
}
