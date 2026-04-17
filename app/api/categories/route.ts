import { getDb } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const sql = getDb();
  const categories = await sql`SELECT * FROM categories ORDER BY name`;
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const sql = getDb();
  const body = await request.json();

  try {
    const result = await sql`
      INSERT INTO categories (name, color) VALUES (${body.name}, ${body.color ?? '#6B7280'})
      RETURNING *
    ` as Record<string, unknown>[];
    return NextResponse.json(result[0], { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === '23505') {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
