'use server';

import { getDb } from '@/db';
import { revalidatePath } from 'next/cache';

export async function createTask(formData: FormData) {
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
}

export async function updateTaskStatus(id: number, status: string) {
  const sql = getDb();
  await sql`UPDATE tasks SET status = ${status} WHERE id = ${id}`;
  revalidatePath('/');
}

export async function deleteTask(id: number) {
  const sql = getDb();
  await sql`DELETE FROM tasks WHERE id = ${id}`;
  revalidatePath('/');
}

export async function updateTask(id: number, formData: FormData) {
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
}
