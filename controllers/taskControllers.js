import Task from "../models/task.js";
import Category from "../models/category.js";
import mongoose from "mongoose";

// Obtener todas las tareas del usuario autenticado
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).populate("category");

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
    const {
      title,
      description,
      fechaEntrega,
      completed,
      category,
    } = req.body;

    // Validar título
    if (
      typeof title !== "string" ||
      title.trim().length < 3 ||
      title.trim().length > 100
    ) {
      return res.status(400).json({
        msg: "El título es obligatorio y debe tener entre 3 y 100 caracteres",
      });
    }

    // Validar descripción
    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        msg: "La descripción debe ser un texto",
      });
    }

    // Validar completed
    if (
      completed !== undefined &&
      typeof completed !== "boolean"
    ) {
      return res.status(400).json({
        msg: "completed debe ser un valor booleano",
      });
    }

    // Validar fecha de entrega
    if (fechaEntrega !== undefined) {
      if (
        typeof fechaEntrega !== "string" ||
        Number.isNaN(Date.parse(fechaEntrega))
      ) {
        return res.status(400).json({
          msg: "La fecha de entrega no es válida",
        });
      }
    }

    // Validar categoría si fue enviada
    let categoryId = null;

    if (category !== undefined && category !== null && category !== "") {
      if (!mongoose.isValidObjectId(category)) {
        return res.status(400).json({
          msg: "El ID de categoría no es válido",
        });
      }

      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res.status(400).json({
          msg: "La categoría indicada no existe",
        });
      }

      categoryId = existingCategory._id;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      fechaEntrega: fechaEntrega || undefined,
      completed: completed ?? false,
      category: categoryId,
      user: req.user.id,
    });

    return res.status(201).json({
      msg: "Tarea creada correctamente",
      task,
    });
  } catch (error) {
    console.error("Error al crear tarea:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        msg: "Los datos de la tarea no son válidos",
      });
    }

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

    const task = await Task.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        msg: "Tarea no encontrada",
      });
    }

    const {
      title,
      description,
      fechaEntrega,
      completed,
      category,
    } = req.body;

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        title.trim().length < 3 ||
        title.trim().length > 100
      ) {
        return res.status(400).json({
          msg: "El título debe tener entre 3 y 100 caracteres",
        });
      }

      task.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          msg: "La descripción debe ser un texto",
        });
      }

      task.description = description.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({
          msg: "completed debe ser un valor booleano",
        });
      }

      task.completed = completed;
    }

    if (fechaEntrega !== undefined) {
      if (
        fechaEntrega !== null &&
        (typeof fechaEntrega !== "string" ||
          Number.isNaN(Date.parse(fechaEntrega)))
      ) {
        return res.status(400).json({
          msg: "La fecha de entrega no es válida",
        });
      }

      task.fechaEntrega = fechaEntrega || undefined;
    }

    if (category !== undefined) {
      if (category === null || category === "") {
        task.category = null;
      } else {
        if (!mongoose.isValidObjectId(category)) {
          return res.status(400).json({
            msg: "El ID de categoría no es válido",
          });
        }

        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
          return res.status(400).json({
            msg: "La categoría indicada no existe",
          });
        }

        task.category = existingCategory._id;
      }
    }

    await task.save();

    return res.status(200).json({
      msg: "Tarea actualizada correctamente",
      task,
    });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        msg: "Los datos de la tarea no son válidos",
      });
    }

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

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
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

export {
  getTasks,
  postTask,
  putTask,
  deleteTask,
};