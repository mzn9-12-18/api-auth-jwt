import Category from "../models/category.js";

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ msg: "Error al obtener categorías" });
  }
};

// Obtener una categoría por ID
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ msg: "ID de categoría inválido" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ msg: "Error al obtener categoría" });
  }
};

// Crear una categoría
const postCategory = async (req, res) => {
  try {
    const { nombre, estado } = req.body;

    if (typeof nombre !== "string" || nombre.trim().length < 3 || nombre.trim().length > 50) {
      return res.status(400).json({
        msg: "El nombre debe tener entre 3 y 50 caracteres",
      });
    }

    if (estado !== undefined && typeof estado !== "boolean") {
      return res.status(400).json({
        msg: "El estado debe ser booleano",
      });
    }

    const existe = await Category.findOne({
      nombre: { $regex: `^${nombre.trim()}$`, $options: "i" },
    });

    if (existe) {
      return res.status(400).json({
        msg: "Ya existe una categoría con ese nombre",
      });
    }

    const category = await Category.create({
      nombre: nombre.trim(),
      estado: estado ?? true,
    });

    return res.status(201).json({
      msg: "Categoría creada correctamente",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "El nombre de categoría ya existe" });
    }

    return res.status(500).json({ msg: "Error al crear categoría" });
  }
};

// Actualizar una categoría
const putCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ msg: "ID de categoría inválido" });
    }

    if (nombre !== undefined &&
      (typeof nombre !== "string" || nombre.trim().length < 3 || nombre.trim().length > 50)) {
      return res.status(400).json({
        msg: "El nombre debe tener entre 3 y 50 caracteres",
      });
    }

    if (estado !== undefined && typeof estado !== "boolean") {
      return res.status(400).json({ msg: "El estado debe ser booleano" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    if (nombre !== undefined) {
      const duplicada = await Category.findOne({
        _id: { $ne: id },
        nombre: { $regex: `^${nombre.trim()}$`, $options: "i" },
      });

      if (duplicada) {
        return res.status(400).json({ msg: "Ya existe una categoría con ese nombre" });
      }

      category.nombre = nombre.trim();
    }

    if (estado !== undefined) category.estado = estado;

    await category.save();

    return res.status(200).json({
      msg: "Categoría actualizada correctamente",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "El nombre de categoría ya existe" });
    }

    return res.status(500).json({ msg: "Error al actualizar categoría" });
  }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ msg: "ID de categoría inválido" });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    return res.status(200).json({
      msg: "Categoría eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error al eliminar categoría" });
  }
};

export {
  getCategories,
  getCategory,
  postCategory,
  putCategory,
  deleteCategory,
};