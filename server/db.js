import pkg from "pg";
const { Pool } = pkg;

// AJUSTA ESTOS DATOS CON TU POSTGRESQL
export const pool = new Pool({
  user: "postgres",
  password: "1234",
  host: "localhost",
  port: 5432,
  database: "juego_memoria"
});