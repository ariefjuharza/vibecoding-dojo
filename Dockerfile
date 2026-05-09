# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Production Server
FROM node:20-alpine
WORKDIR /app/backend

# Copy backend package files and install only production dependencies
COPY backend/package*.json ./
RUN npm install --only=production

# Copy built backend files
COPY --from=backend-build /app/backend/dist ./dist

# Copy built frontend files to public folder
COPY --from=frontend-build /app/frontend/dist ./public

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/index.js"]
