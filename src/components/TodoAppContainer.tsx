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
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Todo App</h2>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTodo}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Filter + Sort Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="text-sm text-blue-600 hover:underline"
        >
          Sort: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </button>
      </div>

      <TodoDisplay
        handleDelete={handleDelete}
        handleToggleComplete={handleToggleComplete}
        todos={filteredTodos}
      />
    </div>
  );
};

export default TodoAppContainer;
