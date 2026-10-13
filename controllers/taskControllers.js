import Task from "../models/task.js";
import mongoose from "mongoose";

// Obtener las tareas del usuario autenticado
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error al obtener tareas:", error);

    return res.status(500).json({
      msg: "Error al obtener las tareas",
    });
  }
};

// Crear una tarea
const postTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        msg: "El título es obligatorio",
      });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || "",
      user: req.user.id,
    });

    await task.save();

    return res.status(201).json({
      msg: "Tarea creada correctamente",
      task,
    });
  } catch (error) {
    console.error("Error al crear tarea:", error);

    return res.status(500).json({
      msg: "Error al crear la tarea",
    });
  }
};

// Actualizar una tarea
const putTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        msg: "ID de tarea inválido",
      });
    }

    const tarea = await Task.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!tarea) {
      return res.status(404).json({
        msg: "Tarea no encontrada",
      });
    }

    tarea.completed = !tarea.completed;

    await tarea.save();

    return res.status(200).json({
      msg: "Tarea actualizada",
      tarea,
    });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);

    return res.status(500).json({
      msg: "Error al actualizar la tarea",
    });
  }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        msg: "ID de tarea inválido",
      });
    }

    const tarea = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!tarea) {
      return res.status(404).json({
        msg: "Tarea no encontrada",
      });
    }

    return res.status(200).json({
      msg: "Tarea eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);

    return res.status(500).json({
      msg: "Error al eliminar la tarea",
    });
  }
};

export { getTasks, postTask, putTask, deleteTask };