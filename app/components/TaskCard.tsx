'use client';

import { useTransition } from 'react';
import { updateTaskStatus, deleteTask } from '@/app/actions/tasks';
import { CategoryBadge } from './CategoryBadge';

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

export function TaskCard({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();

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
            onClick={() => startTransition(() => updateTaskStatus(task.id, nextStatus[task.status]))}
            disabled={isPending}
            className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title={`Move to ${statusLabels[nextStatus[task.status]]}`}
          >
            {isCompleted ? '↩' : '✓'}
          </button>
          <button
            onClick={() => startTransition(() => deleteTask(task.id))}
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
