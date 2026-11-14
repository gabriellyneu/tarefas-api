import Database from "better-sqlite3";

export type Db = Database.Database;

/** Abre (ou cria) o banco SQL e garante o esquema da tabela. */
export function criarBanco(arquivo: string = ":memory:"): Db {
  const db = new Database(arquivo);
  db.exec(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      concluida INTEGER NOT NULL DEFAULT 0,
      criada_em TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  return db;
}
