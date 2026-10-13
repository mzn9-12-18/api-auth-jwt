// SERVER CON NODE:HTTP
// import { createServer } from "node:http";

// const server = createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Bienvenidos al Backend!\n");
// });

// server.listen(3000, "127.0.0.1", () => {
//   console.log("Listening on 127.0.0.1:3000");
// });

//Express
import "dotenv/config";
import express from "express";
import cors from "cors";
import { dbConnect } from "./config/database.js";
import taskRouter from "./routes/taskRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
const port = 4500;

//middleware -> función que está entre la req y la res
app.use(express.json());
app.use(express.static("public")); //configuramos la carpeta public para nuestras páginas web
app.use(cors());



await dbConnect();

app.use("/api/task", taskRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server online en puerto: ${port}`);
});
