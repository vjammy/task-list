'use client';

import { useCategoryActions } from './Toast';

interface Category {
  id: number;
  name: string;
  color: string;
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const { isPending, handleCreateCategory, handleDeleteCategory } = useCategoryActions();

  return (
    <details className="bg-white rounded-lg shadow p-4 mb-6">
      <summary className="cursor-pointer font-medium text-gray-700">Manage Categories</summary>
      <div className="mt-4 space-y-3">
        <form action={handleCreateCategory} className="flex gap-2">
          <input
            type="text"
            name="name"
            placeholder="Category name"
            required
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="color"
            name="color"
            defaultValue="#6B7280"
            className="w-10 h-9 border border-gray-300 rounded-md cursor-pointer"
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Add
          </button>
        </form>
        {categories.length > 0 && (
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  disabled={isPending}
                  className="text-red-500 text-sm hover:text-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
