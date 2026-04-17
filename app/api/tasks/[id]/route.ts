import { getDb } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();
  const result = await sql`SELECT t.*, c.name AS category_name, c.color AS category_color
    FROM tasks t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ${Number(id)}`;
  if (result.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();
  const body = await request.json();

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
  }

  // Fetch current task to build update with explicit values
  const current = await sql`SELECT * FROM tasks WHERE id = ${Number(id)}`;
  if (current.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const title = body.title !== undefined ? body.title : current[0].title;
  const description = body.description !== undefined ? body.description : current[0].description;
  const status = body.status !== undefined ? body.status : current[0].status;
  const priority = body.priority !== undefined ? body.priority : current[0].priority;
  const categoryId = body.category_id !== undefined ? body.category_id : current[0].category_id;
  const dueDate = body.due_date !== undefined ? body.due_date : current[0].due_date;

  const result = await sql`
    UPDATE tasks SET
      title       = ${title},
      description = ${description},
      status      = ${status},
      priority    = ${priority},
      category_id = ${categoryId},
      due_date    = ${dueDate},
      updated_at  = now()
    WHERE id = ${Number(id)}
    RETURNING *
  `;
  return NextResponse.json(result[0]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();
  const result = await sql`DELETE FROM tasks WHERE id = ${Number(id)} RETURNING id`;
  if (result.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
