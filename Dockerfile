# ── Build Stage: Client ──────────────────────────────────────────
FROM node:20-alpine AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ── Build Stage: Server ──────────────────────────────────────────
FROM node:20-alpine AS server-build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npx prisma generate
RUN npm run build

# ── Production Stage ─────────────────────────────────────────────
FROM node:20-alpine AS production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 citeuser

WORKDIR /app

# Copy server build
COPY --from=server-build --chown=citeuser:nodejs /app/server/dist ./dist
COPY --from=server-build --chown=citeuser:nodejs /app/server/node_modules ./node_modules
COPY --from=server-build --chown=citeuser:nodejs /app/server/prisma ./prisma

# Copy client build into server's public dir
COPY --from=client-build --chown=citeuser:nodejs /app/client/dist ./public

USER citeuser

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
