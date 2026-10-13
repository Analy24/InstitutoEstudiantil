# ==========================================
# STAGE 1: Frontend Build Stage
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Production Execution Stage
# ==========================================
FROM node:20-alpine AS production
WORKDIR /app/backend

# Instalar herramientas del sistema necesarias para sqlite3
RUN apk add --no-libc-base-binaries --no-cache sqlite python3 make g++

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Crear directorios para persistencia de datos y uploads
RUN mkdir -p /app/backend/uploads

# Exponer el puerto de producción
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
