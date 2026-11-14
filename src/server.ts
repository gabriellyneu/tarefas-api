import { criarApp } from "./app";
import { criarBanco } from "./db";

const porta = Number(process.env.PORT ?? 3000);
const db = criarBanco(process.env.DB_FILE ?? "tarefas.db");

criarApp(db).listen(porta, () => {
  console.log(`API de tarefas em execução na porta ${porta}`);
});
