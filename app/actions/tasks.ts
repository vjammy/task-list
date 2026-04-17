'use server';

import { getDb } from '@/db';
import { revalidatePath } from 'next/cache';

export async function createTask(formData: FormData) {
  try {
    const sql = getDb();
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const priority = (formData.get('priority') as string) || 'medium';
    const categoryId = formData.get('category_id') as string;
    const dueDate = formData.get('due_date') as string;

    await sql`
      INSERT INTO tasks (title, description, priority, category_id, due_date)
      VALUES (${title}, ${description}, ${priority},
              ${categoryId ? Number(categoryId) : null},
              ${dueDate || null})
    `;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create task:', error);
    return { error: 'Failed to create task. Please try again.' };
  }
}

export async function updateTaskStatus(id: number, status: string) {
  try {
    const sql = getDb();
    await sql`UPDATE tasks SET status = ${status} WHERE id = ${id}`;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update task status:', error);
    return { error: 'Failed to update task status. Please try again.' };
  }
}

export async function deleteTask(id: number) {
  try {
    const sql = getDb();
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete task:', error);
    return { error: 'Failed to delete task. Please try again.' };
  }
}

export async function updateTask(id: number, formData: FormData) {
  try {
    const sql = getDb();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const categoryId = formData.get('category_id') as string;
    const dueDate = formData.get('due_date') as string;
    const status = formData.get('status') as string;

    await sql`
      UPDATE tasks SET
        title       = ${title},
        description = ${description},
        status      = ${status},
        priority    = ${priority},
        category_id = ${categoryId ? Number(categoryId) : null},
        due_date    = ${dueDate || null}
      WHERE id = ${id}
    `;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update task:', error);
    return { error: 'Failed to update task. Please try again.' };
  }
}
