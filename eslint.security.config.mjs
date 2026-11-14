import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";

// Análise estática de SEGURANÇA (SAST): regras do eslint-plugin-security
export default tseslint.config(
  { ignores: ["dist/", "coverage/", "node_modules/"] },
  security.configs.recommended,
  { files: ["src/**/*.ts"], languageOptions: { parser: tseslint.parser } },
);
