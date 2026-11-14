import { parseId, validarTarefa } from "../../src/validation";

describe("validarTarefa (teste unitário)", () => {
  it("aceita um título válido e aplica concluida=false por padrão", () => {
    const r = validarTarefa({ titulo: "  Estudar CI  " });
    expect(r).toEqual({ ok: true, value: { titulo: "Estudar CI", concluida: false } });
  });

  it("rejeita corpo que não é objeto", () => {
    expect(validarTarefa(null).ok).toBe(false);
    expect(validarTarefa("texto").ok).toBe(false);
  });

  it("rejeita título vazio ou ausente", () => {
    expect(validarTarefa({ titulo: "   " }).ok).toBe(false);
    expect(validarTarefa({}).ok).toBe(false);
  });

  it("rejeita título com mais de 120 caracteres", () => {
    expect(validarTarefa({ titulo: "a".repeat(121) }).ok).toBe(false);
  });

  it("rejeita 'concluida' que não seja booleano", () => {
    expect(validarTarefa({ titulo: "x", concluida: "sim" }).ok).toBe(false);
  });
});

describe("parseId (teste unitário)", () => {
  it("converte inteiros positivos", () => {
    expect(parseId("42")).toBe(42);
  });

  it("retorna null para valores inválidos", () => {
    expect(parseId("0")).toBeNull();
    expect(parseId("-1")).toBeNull();
    expect(parseId("abc")).toBeNull();
    expect(parseId("1.5")).toBeNull();
  });
});
