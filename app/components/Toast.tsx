'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useTransition } from 'react';
import { createTask, updateTaskStatus, deleteTask } from '@/app/actions/tasks';
import { createCategory, deleteCategory } from '@/app/actions/categories';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const toast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-md shadow-lg text-sm font-medium text-white ${
              t.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useTaskActions() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleCreateTask(formData: FormData) {
    startTransition(async () => {
      const result = await createTask(formData);
      if (result.error) toast(result.error, 'error');
      else toast('Task created');
    });
  }

  function handleUpdateStatus(id: number, status: string) {
    startTransition(async () => {
      const result = await updateTaskStatus(id, status);
      if (result.error) toast(result.error, 'error');
      else toast('Task updated');
    });
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this task?')) return;
    startTransition(async () => {
      const result = await deleteTask(id);
      if (result.error) toast(result.error, 'error');
      else toast('Task deleted');
    });
  }

  return { isPending, handleCreateTask, handleUpdateStatus, handleDelete };
}

export function useCategoryActions() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleCreateCategory(formData: FormData) {
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result.error) toast(result.error, 'error');
      else toast('Category created');
    });
  }

  function handleDeleteCategory(id: number) {
    if (!confirm('Delete this category?')) return;
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.error) toast(result.error, 'error');
      else toast('Category deleted');
    });
  }

  return { isPending, handleCreateCategory, handleDeleteCategory };
}
