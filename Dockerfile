# ---- Estágio de build ----
FROM node:22-slim AS build
WORKDIR /app

# Ferramentas necessárias para compilar o módulo nativo better-sqlite3
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

# ---- Estágio final (somente produção) ----
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000 DB_FILE=/data/tarefas.db
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN mkdir /data && chown node:node /data
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
