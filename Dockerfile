# ---- Estágio de build ----
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# ---- Estágio final (somente produção) ----
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000 DB_FILE=/data/tarefas.db
COPY package*.json ./
RUN npm ci --omit=dev && mkdir /data && chown node:node /data
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
