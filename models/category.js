import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

export default model("Category", categorySchema);