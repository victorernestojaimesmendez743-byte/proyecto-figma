import { Router } from "express";
import { pool } from "./db.js";
import bcrypt from "bcrypt";

const router = Router();

// Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios (username, password) VALUES ($1, $2)",
      [username, hashed]
    );

    res.json({ ok: true, message: "Usuario registrado" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE username = $1",
      [username]
    );

    if (result.rowCount === 0)
      return res.json({ ok: false, message: "Usuario no existe" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.json({ ok: false, message: "Contraseña incorrecta" });

    res.json({ ok: true, message: "Login exitoso" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;