import { useState, useEffect } from "react";
import { TodoDisplay } from "./TodoDisplay";
import type { todo } from "../model/todo";

const LOCAL_STORAGE_KEY = "todos";

const isTesting = import.meta.env.STORYBOOK === "true"; // Set in `.storybook/preview.ts`

const saveTodosToLocalStorage = (todos: todo[]) => {
  if (!isTesting) {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
};


const TodoAppContainer = () => {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState<todo[]>([]);

  // Load from localStorage
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

  // Save to localStorage whenever todos change
  const updateTodoById = (id: string, updater: (todo: todo) => todo) => {
    const updated = todos.map((t) => (t.id === id ? updater(t) : t));
    setTodos(updated);
    saveTodosToLocalStorage(updated);
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

    setTodos([newTodo, ...todos]);
    saveTodosToLocalStorage([newTodo, ...todos]);
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
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    saveTodosToLocalStorage(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

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
      <TodoDisplay 
        handleDelete={handleDelete} 
        handleToggleComplete={handleToggleComplete} 
        todos={todos} 
      />
    </div>
  );
};

export default TodoAppContainer;