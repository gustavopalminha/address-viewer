# -----------------------------------------------------------
# GLOBAL STAGE: Define Build Arguments
# -----------------------------------------------------------

# -----------------------------------------------------------
# STAGE 1: Builder
# -----------------------------------------------------------
FROM node:24-alpine AS builder
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -----------------------------------------------------------
# STAGE 2: Runner
# -----------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package.json ./
RUN npm install --omit=dev

EXPOSE 4173

ENTRYPOINT ["npm", "run", "preview", "--", "--host", "--port", "4173"]
