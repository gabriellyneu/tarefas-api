import request from "supertest";
import { criarApp } from "../../src/app";
import { criarBanco, Db } from "../../src/db";

// Teste de integração: API REST + banco de dados SQL real (SQLite em memória)
describe("API /tarefas (teste de integração)", () => {
  let db: Db;
  let app: ReturnType<typeof criarApp>;

  beforeEach(() => {
    db = criarBanco(":memory:");
    app = criarApp(db);
  });

  afterEach(() => db.close());

  it("GET /health responde ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("POST cria a tarefa e persiste no banco SQL", async () => {
    const res = await request(app).post("/tarefas").send({ titulo: "Criar pipeline" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, titulo: "Criar pipeline", concluida: false });

    const linha = db.prepare("SELECT titulo FROM tarefas WHERE id = 1").get() as {
      titulo: string;
    };
    expect(linha.titulo).toBe("Criar pipeline");
  });

  it("POST com dados inválidos retorna 400", async () => {
    const res = await request(app).post("/tarefas").send({ titulo: "" });
    expect(res.status).toBe(400);
  });

  it("GET lista e busca por id", async () => {
    await request(app).post("/tarefas").send({ titulo: "A" });
    await request(app).post("/tarefas").send({ titulo: "B" });

    const lista = await request(app).get("/tarefas");
    expect(lista.body).toHaveLength(2);

    const um = await request(app).get("/tarefas/2");
    expect(um.status).toBe(200);
    expect(um.body.titulo).toBe("B");
  });

  it("GET com id inexistente retorna 404 e id inválido retorna 400", async () => {
    expect((await request(app).get("/tarefas/99")).status).toBe(404);
    expect((await request(app).get("/tarefas/abc")).status).toBe(400);
  });

  it("PUT atualiza a tarefa", async () => {
    await request(app).post("/tarefas").send({ titulo: "Velha" });
    const res = await request(app)
      .put("/tarefas/1")
      .send({ titulo: "Nova", concluida: true });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ titulo: "Nova", concluida: true });
    expect((await request(app).put("/tarefas/9").send({ titulo: "x" })).status).toBe(404);
  });

  it("DELETE remove a tarefa", async () => {
    await request(app).post("/tarefas").send({ titulo: "Remover" });
    expect((await request(app).delete("/tarefas/1")).status).toBe(204);
    expect((await request(app).get("/tarefas/1")).status).toBe(404);
    expect((await request(app).delete("/tarefas/1")).status).toBe(404);
  });
});
