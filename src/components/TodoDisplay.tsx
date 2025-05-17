import type { todo } from "../model/todo";


export const TodoDisplay = (
    { todos, handleDelete, handleToggleComplete }: { todos: todo[]; handleDelete: (id: string) => void; handleToggleComplete: (id: string) => void; }
  ) => {
    return (
      <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between px-4 py-2 border rounded-lg shadow-sm bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                  className="w-5 h-5"
                />
                <span
                  className={`${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.description}
                </span>
              </div>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
    );
  }
  