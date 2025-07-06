# ---------- BUILD STAGE ----------
FROM node:22.17.0-alpine AS builder

ENV NODE_ENV=build

# Seguridad y estructura
USER node
WORKDIR /home/node

# Copia solo lo necesario para instalar deps
COPY package*.json ./
RUN npm ci

# Copia todo lo demás (código fuente, prisma, etc.)
COPY --chown=node:node . .

# 👉 Prisma generate antes del build
RUN npx prisma generate --schema=src/infrastructure/prisma/schema.prisma

# Build y prune
RUN npm run build && npm prune --omit=dev

---

# ---------- RUNTIME STAGE ----------
FROM node:22.17.0-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node

# Copia solo lo necesario para producción
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/main"]
