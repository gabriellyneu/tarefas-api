export interface TarefaInput {
  titulo: string;
  concluida: boolean;
}

export type ValidationResult =
  { ok: true; value: TarefaInput } | { ok: false; erro: string };

/** Valida e normaliza o corpo de uma requisição de tarefa. */
export function validarTarefa(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, erro: "Corpo da requisição inválido" };
  }
  const { titulo, concluida } = body as Record<string, unknown>;

  if (typeof titulo !== "string" || titulo.trim().length === 0) {
    return { ok: false, erro: "O campo 'titulo' é obrigatório" };
  }
  if (titulo.trim().length > 120) {
    return { ok: false, erro: "O campo 'titulo' deve ter no máximo 120 caracteres" };
  }
  if (concluida !== undefined && typeof concluida !== "boolean") {
    return { ok: false, erro: "O campo 'concluida' deve ser booleano" };
  }
  return { ok: true, value: { titulo: titulo.trim(), concluida: concluida ?? false } };
}

/** Converte o id da rota em inteiro positivo (ou null se inválido). */
export function parseId(valor: string): number | null {
  if (!/^\d+$/.test(valor)) return null;
  const n = Number(valor);
  return n > 0 && Number.isSafeInteger(n) ? n : null;
}
