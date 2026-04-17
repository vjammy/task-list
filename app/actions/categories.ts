'use server';

import { getDb } from '@/db';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    if (!name || !name.trim()) {
      return { error: 'Category name is required.' };
    }

    const sql = getDb();
    const color = (formData.get('color') as string) || '#6B7280';

    await sql`INSERT INTO categories (name, color) VALUES (${name.trim()}, ${color})`;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create category:', error);
    return { error: 'Failed to create category. Please try again.' };
  }
}

export async function deleteCategory(id: number) {
  try {
    const sql = getDb();
    await sql`DELETE FROM categories WHERE id = ${id}`;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { error: 'Failed to delete category. Please try again.' };
  }
}
