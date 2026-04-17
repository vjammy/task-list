import { getDb } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

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

  const result = await sql`
    UPDATE tasks SET
      title       = COALESCE(${body.title ?? null}, title),
      description = COALESCE(${body.description ?? null}, description),
      status      = COALESCE(${body.status ?? null}, status),
      priority    = COALESCE(${body.priority ?? null}, priority),
      category_id = COALESCE(${body.category_id !== undefined ? body.category_id : null}, category_id),
      due_date    = COALESCE(${body.due_date ?? null}, due_date)
    WHERE id = ${Number(id)}
    RETURNING *
  `;
  if (result.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
