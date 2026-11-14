import express, { Request, Response } from "express";
import { Db } from "./db";
import { parseId, validarTarefa } from "./validation";

interface LinhaTarefa {
  id: number;
  titulo: string;
  concluida: number;
  criada_em: string;
}

const paraJson = (l: LinhaTarefa) => ({
  id: l.id,
  titulo: l.titulo,
  concluida: l.concluida === 1,
  criadaEm: l.criada_em,
});

export function criarApp(db: Db) {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.get("/tarefas", (_req: Request, res: Response) => {
    const linhas = db.prepare("SELECT * FROM tarefas ORDER BY id").all() as LinhaTarefa[];
    res.json(linhas.map(paraJson));
  });

  app.get("/tarefas/:id", (req: Request, res: Response) => {
    const id = parseId(String(req.params.id));
    if (id === null) return res.status(400).json({ erro: "Id inválido" });
    const linha = db.prepare("SELECT * FROM tarefas WHERE id = ?").get(id) as
      LinhaTarefa | undefined;
    if (!linha) return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json(paraJson(linha));
  });

  app.post("/tarefas", (req: Request, res: Response) => {
    const r = validarTarefa(req.body);
    if (!r.ok) return res.status(400).json({ erro: r.erro });
    const info = db
      .prepare("INSERT INTO tarefas (titulo, concluida) VALUES (?, ?)")
      .run(r.value.titulo, r.value.concluida ? 1 : 0);
    const linha = db
      .prepare("SELECT * FROM tarefas WHERE id = ?")
      .get(info.lastInsertRowid) as LinhaTarefa;
    res.status(201).json(paraJson(linha));
  });

  app.put("/tarefas/:id", (req: Request, res: Response) => {
    const id = parseId(String(req.params.id));
    if (id === null) return res.status(400).json({ erro: "Id inválido" });
    const r = validarTarefa(req.body);
    if (!r.ok) return res.status(400).json({ erro: r.erro });
    const info = db
      .prepare("UPDATE tarefas SET titulo = ?, concluida = ? WHERE id = ?")
      .run(r.value.titulo, r.value.concluida ? 1 : 0, id);
    if (info.changes === 0)
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    const linha = db.prepare("SELECT * FROM tarefas WHERE id = ?").get(id) as LinhaTarefa;
    res.json(paraJson(linha));
  });

  app.delete("/tarefas/:id", (req: Request, res: Response) => {
    const id = parseId(String(req.params.id));
    if (id === null) return res.status(400).json({ erro: "Id inválido" });
    const info = db.prepare("DELETE FROM tarefas WHERE id = ?").run(id);
    if (info.changes === 0)
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.status(204).send();
  });

  return app;
}
