import { useState, useEffect } from "react";
import { TodoDisplay } from "./TodoDisplay";
import type { todo } from "../model/todo";

const LOCAL_STORAGE_KEY = "todos";
const FILTER_KEY = "todo_filter";
const SORT_ORDER_KEY = "todo_sort_order";
const isTesting = import.meta.env.STORYBOOK === "true";

const saveToStorage = (key: string, value: any) => {
  if (!isTesting) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (!isTesting) {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        return defaultValue;
      }
    }
  }
  return defaultValue;
};

const TodoAppContainer = () => {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState<todo[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "active">(() =>
    loadFromStorage(FILTER_KEY, "all")
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() =>
    loadFromStorage(SORT_ORDER_KEY, "desc")
  );

  // Load todos
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as todo[];
      parsed.forEach((t) => {
        t.createdAt = new Date(t.createdAt);
        t.updatedAt = new Date(t.updatedAt);
      });
      setTodos(parsed);
    }
  }, []);

  // Save filter and sortOrder when changed
  useEffect(() => {
    saveToStorage(FILTER_KEY, filter);
  }, [filter]);

  useEffect(() => {
    saveToStorage(SORT_ORDER_KEY, sortOrder);
  }, [sortOrder]);

  const updateTodoById = (id: string, updater: (todo: todo) => todo) => {
    const updated = todos.map((t) => (t.id === id ? updater(t) : t));
    setTodos(updated);
    saveToStorage(LOCAL_STORAGE_KEY, updated);
  };

  const handleAddTodo = () => {
    const trimmed = description.trim();
    if (!trimmed) return;

    const now = new Date();
    const newTodo: todo = {
      id: crypto.randomUUID(),
      description: trimmed,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    saveToStorage(LOCAL_STORAGE_KEY, newTodos);
    setDescription("");
  };

  const handleToggleComplete = (id: string) => {
    updateTodoById(id, (todo) => ({
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date(),
    }));
  };

  const handleDelete = (id: string) => {
    const updated = todos.filter((todo) => todo.id !== id);
    setTodos(updated);
    saveToStorage(LOCAL_STORAGE_KEY, updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const filteredTodos = todos
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "active") return !t.completed;
      return true;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime()
    );

  return (
    <div className="min-h-[80vh] min-w-[80vw] bg-gray-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-xl shadow-md p-5 sm:p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Manage Your To-Do's Effortlessly
        </h2>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Add a new todo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleAddTodo}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:scale-[0.98] transition"
          >
            Add
          </button>
        </div>

        {/* Sort + Filter Controls */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3 text-sm">
          {/* Sort Info */}
          <div className="flex items-center gap-2 text-gray-600">
            <span>
              Sorted by:{" "}
              <strong>
                {sortOrder === "asc" ? "Oldest First" : "Newest First"}
              </strong>
            </span>
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="px-3 py-1 border border-gray-300 rounded-md text-blue-600 hover:bg-blue-50 transition"
              aria-label="Toggle sort order"
            >
              Toggle
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 ml-auto">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as "all" | "active" | "completed")}
                className={`px-4 py-1.5 rounded-full text-sm capitalize transition font-medium ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto pr-1">
          {filteredTodos.length > 0 ? (
            <TodoDisplay
              handleDelete={handleDelete}
              handleToggleComplete={handleToggleComplete}
              todos={filteredTodos}
            />
          ) : (
            <div className="flex items-center justify-center h-full py-10 text-gray-500 text-sm italic">
              🎉 You're all done!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoAppContainer;
