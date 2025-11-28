import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Servir carpeta dist del frontend
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.listen(PORT, () => {
  console.log(`Servidor frontend corriendo en http://localhost:${PORT}`);
});
