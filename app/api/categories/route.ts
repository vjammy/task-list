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

  const result = await sql`
    INSERT INTO categories (name, color) VALUES (${body.name}, ${body.color ?? '#6B7280'})
    RETURNING *
  `;
  return NextResponse.json(result[0], { status: 201 });
}
