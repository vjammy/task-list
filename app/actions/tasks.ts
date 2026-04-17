'use server';

import { getDb } from '@/db';
import { revalidatePath } from 'next/cache';

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

export async function createTask(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    if (!title || !title.trim()) {
      return { error: 'Title is required.' };
    }

    const priority = (formData.get('priority') as string) || 'medium';
    if (!VALID_PRIORITIES.includes(priority)) {
      return { error: 'Invalid priority value.' };
    }

    const categoryId = formData.get('category_id') as string;
    if (categoryId && isNaN(Number(categoryId))) {
      return { error: 'Invalid category ID.' };
    }

    const sql = getDb();
    const description = (formData.get('description') as string) || '';
    const dueDate = formData.get('due_date') as string;

    await sql`
      INSERT INTO tasks (title, description, priority, category_id, due_date)
      VALUES (${title.trim()}, ${description}, ${priority},
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
    if (!VALID_STATUSES.includes(status)) {
      return { error: 'Invalid status value.' };
    }

    const sql = getDb();
    await sql`UPDATE tasks SET status = ${status}, updated_at = now() WHERE id = ${id}`;
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

    const current = await sql`SELECT * FROM tasks WHERE id = ${id}` as Record<string, unknown>[];
    if (current.length === 0) {
      return { error: 'Task not found.' };
    }
    const row = current[0] as Record<string, string | number | null>;

    const title = (formData.get('title') as string) ?? String(row.title ?? '');
    const description = (formData.get('description') as string) ?? String(row.description ?? '');
    const priority = (formData.get('priority') as string) ?? String(row.priority ?? 'medium');
    const status = (formData.get('status') as string) ?? String(row.status ?? 'pending');
    const categoryId = (formData.get('category_id') as string) ?? (row.category_id != null ? String(row.category_id) : '');
    const dueDate = (formData.get('due_date') as string) ?? (row.due_date != null ? String(row.due_date) : '');

    if (!title.trim()) {
      return { error: 'Title cannot be empty.' };
    }
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return { error: 'Invalid priority value.' };
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return { error: 'Invalid status value.' };
    }

    await sql`
      UPDATE tasks SET
        title       = ${title},
        description = ${description},
        status      = ${status},
        priority    = ${priority},
        category_id = ${categoryId ? Number(categoryId) : null},
        due_date    = ${dueDate || null},
        updated_at  = now()
      WHERE id = ${id}
    `;
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update task:', error);
    return { error: 'Failed to update task. Please try again.' };
  }
}
