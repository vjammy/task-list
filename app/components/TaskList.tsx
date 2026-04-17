import { TaskCard } from './TaskCard';

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

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No tasks found</p>
        <p className="text-sm mt-1">Create your first task above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
