"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Swal from "sweetalert2";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  limitDate: string;
}

export default function TaskManager() {
  const token = localStorage.getItem("token");
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    limitDate: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    limitDate: "",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const validateTask = (task: typeof newTask) => {
    const errors = { title: "", description: "", limitDate: "" };
    if (task.title.length < 3 || task.title.length > 30)
      errors.title = "El título debe tener entre 3 y 30 caracteres.";
    if (task.description.length < 5 || task.description.length > 150)
      errors.description =
        "La descripción debe tener entre 5 y 150 caracteres.";
    const taskDate = new Date(task.limitDate);
    const today = new Date();
    if (
      isNaN(taskDate.getTime()) ||
      taskDate < today ||
      taskDate > new Date(today.setFullYear(today.getFullYear() + 3))
    ) {
      errors.limitDate =
        "La fecha límite debe ser entre hoy y dentro de 3 años.";
    }
    setErrors(errors);
    return !Object.values(errors).some((err) => err);
  };

  const getTasks = async () => {
    const response = await fetch("http://localhost:8001/api/task", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.tasks === undefined) {
      Swal.fire({
        title: "Debes iniciar sesión",
        text: "Por favor, inicia sesión para acceder a tus tareas.",
        icon: "warning",
        confirmButtonText: "Iniciar sesión",
      }).then(() => {
        localStorage.removeItem("token");
        router.push("/iniciar-sesion");
      });
    } else {
      setTasks(data.tasks);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTask(newTask)) {
      const task: Partial<Task> = {
        title: newTask.title,
        description: newTask.description,
        limitDate: new Date(newTask.limitDate).toISOString(),
      };

      const response = await fetch("http://localhost:8001/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        getTasks();
        setNewTask({ title: "", description: "", limitDate: "" });
      } else {
        Swal.fire({
          title: "Debes iniciar sesión",
          text: "Por favor, inicia sesión para acceder a tus tareas.",
          icon: "warning",
          confirmButtonText: "Iniciar sesión",
        }).then(() => {
          router.push("/iniciar-sesion");
        });
      }
    }
  };

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await fetch(`http://localhost:8001/api/task/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editingTask),
      });

      getTasks();
      setEditingTask(null);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
  };

  const deleteTask = async (id: string) => {
    await fetch(`http://localhost:8001/api/task/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => getTasks())
      .catch((err) => (errors.limitDate = "Error al agregar la tarea."));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Debes iniciar sesión",
        text: "Por favor, inicia sesión para acceder a tus tareas.",
        icon: "warning",
        confirmButtonText: "Iniciar sesión",
      }).then(() => {
        router.push("/iniciar-sesion");
      });
    }

    getTasks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          <Link href="/tareas">Gestor de Tareas</Link>
        </h1>

        <form onSubmit={addTask} className="mb-6 space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Título de la tarea"
            className="w-full p-2 border border-gray-300 rounded"
          />

          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}

          <textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Descripción de la tarea"
            className="w-full p-2 border border-gray-300 rounded"
          />

          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}

          <input
            type="date"
            value={newTask.limitDate}
            onChange={(e) =>
              setNewTask({ ...newTask, limitDate: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />

          {errors.limitDate && (
            <p className="text-red-500 text-sm">{errors.limitDate}</p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Tarea
          </button>
        </form>

        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="bg-gray-100 p-4 rounded">
              {editingTask && editingTask.id === task.id ? (
                <form onSubmit={updateTask} className="space-y-2">
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <textarea
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="date"
                    value={editingTask.limitDate.split("T")[0]}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        limitDate: new Date(e.target.value).toISOString(),
                      })
                    }
                    className=" p-2 border border-gray-300 rounded"
                  />
                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        status: e.target.value as any["status"],
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="Cancelada">Cancelada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Completada">Completada</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Fecha límite: {formatDate(task.limitDate)}</p>
                  <p>Estado: {task.status}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => startEditing(task)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
}
