import type { todo } from "../model/todo";

interface Props {
  todos: todo[];
  handleDelete: (id: string) => void;
  handleToggleComplete: (id: string) => void;
}

export const TodoDisplay = ({
  todos,
  handleDelete,
  handleToggleComplete,
}: Props) => {
  return (
    <ul className="space-y-3" role="list">
      {todos.map((todo) => (
        <li
          key={todo.id}
          role="listitem"
          className="flex items-center justify-between px-4 py-2 border rounded-lg shadow-sm bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
              aria-label={`Toggle ${todo.description}`}
              className="w-5 h-5"
            />
            <span
              className={`${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
              data-testid={`todo-text-${todo.id}`}
            >
              {todo.description}
            </span>
          </div>
          <button
            onClick={() => handleDelete(todo.id)}
            className="text-sm text-red-600 hover:underline"
            aria-label={`Delete ${todo.description}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};
