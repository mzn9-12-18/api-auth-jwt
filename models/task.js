import { Schema, model } from "mongoose";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Task", taskSchema);
