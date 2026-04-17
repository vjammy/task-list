'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { updateTaskStatus, deleteTask, updateTask } from '@/app/actions/tasks';
import { CategoryBadge } from './CategoryBadge';
import { useToast } from './Toast';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category_id: number | null;
  category_name: string | null;
  category_color: string | null;
  due_date: string | null;
  created_at: string;
}

interface TaskCardProps {
  task: Task;
  categories?: { id: number; name: string; color: string }[];
}

export function TaskCard({ task, categories = [] }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  const nextStatus: Record<string, string> = {
    pending: 'in_progress',
    in_progress: 'completed',
    completed: 'pending',
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const isCompleted = task.status === 'completed';

  function handleSave(formData: FormData) {
    startTransition(async () => {
      const result = await updateTask(task.id, formData);
      if (result.error) toast(result.error, 'error');
      else { toast('Task updated'); setEditing(false); }
    });
  }

  if (editing) {
    return (
      <form action={handleSave} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <input type="text" name="title" defaultValue={task.title} required
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2">
            <textarea name="description" defaultValue={task.description} rows={2}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select name="priority" defaultValue={task.priority}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select name="status" defaultValue={task.status}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select name="category_id" defaultValue={task.category_id ?? ''}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">No Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input type="date" name="due_date" defaultValue={task.due_date ? task.due_date.split('T')[0] : ''}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 mt-3">
          <button type="submit" disabled={isPending}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => setEditing(false)}
            className="px-4 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${isCompleted ? 'border-green-500 opacity-75' : task.priority === 'high' ? 'border-red-500' : task.priority === 'medium' ? 'border-yellow-500' : 'border-gray-300'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-900 ${isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
              {statusLabels[task.status]}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.category_name && task.category_color && (
              <CategoryBadge name={task.category_name} color={task.category_color} />
            )}
            {task.due_date && (
              <span className="text-xs text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setEditing(true)}
            disabled={isPending}
            className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title="Edit task"
          >
            ✎
          </button>
          <button
            onClick={() => {
              startTransition(async () => {
                const result = await updateTaskStatus(task.id, nextStatus[task.status]);
                if (result.error) toast(result.error, 'error');
                else toast('Task updated');
              });
            }}
            disabled={isPending}
            className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title={`Move to ${statusLabels[nextStatus[task.status]]}`}
          >
            {isCompleted ? '↩' : '✓'}
          </button>
          <button
            onClick={() => {
              if (!confirm('Delete this task?')) return;
              startTransition(async () => {
                const result = await deleteTask(task.id);
                if (result.error) toast(result.error, 'error');
                else toast('Task deleted');
              });
            }}
            disabled={isPending}
            className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
