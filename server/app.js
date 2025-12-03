import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", router);

app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});