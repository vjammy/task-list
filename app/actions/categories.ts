'use server';

import { getDb } from '@/db';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  const sql = getDb();
  const name = formData.get('name') as string;
  const color = (formData.get('color') as string) || '#6B7280';

  await sql`INSERT INTO categories (name, color) VALUES (${name}, ${color})`;
  revalidatePath('/');
}

export async function deleteCategory(id: number) {
  const sql = getDb();
  await sql`DELETE FROM categories WHERE id = ${id}`;
  revalidatePath('/');
}
