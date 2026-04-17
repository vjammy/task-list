'use server';

import { getDb } from '@/db';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  try {
    const sql = getDb();
    const name = formData.get('name') as string;
    const color = (formData.get('color') as string) || '#6B7280';

    await sql`INSERT INTO categories (name, color) VALUES (${name}, ${color})`;
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
