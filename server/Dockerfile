# -----------------------------------------------------------
# STAGE 1: Builder (Compiles TypeScript to JavaScript)
# This stage uses a full Node image necessary for building tools (tsc, nodemon, etc.)
# -----------------------------------------------------------
FROM node:24-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies, including devDependencies for the 'build' script
RUN npm ci

# Copy all source files
COPY . .

# Compile TypeScript code into JavaScript, outputting to the 'dist' folder
RUN npm run build


# -----------------------------------------------------------
# STAGE 2: Runner (Lightweight Production Image)
# This stage uses a smaller, optimized Node image to run the compiled JS code
# -----------------------------------------------------------
FROM node:24-alpine AS runner

# Set the working directory
WORKDIR /app

# 💡 Environment variables set here are defaults. They are overridden by docker run -e.
# PORT is used by the Express application to listen for connections.
ENV PORT=8080
# NODE_ENV is used by Express and various packages for optimization (e.g., helmet, dotenv)
ENV NODE_ENV=production

# Copy only production dependencies (runtime dependencies)
# We don't copy all dependencies to keep the image small.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled JavaScript files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy source files (for development mode and the start script)
COPY src ./src
# Copy tsconfig files required for 'npm run dev' to function correctly
COPY tsconfig*.json ./

# Copy the data directory and its contents
COPY data ./data 

# Expose the default listening port
EXPOSE ${PORT}

# Default command: Runs the optimized compiled JavaScript for production
CMD ["npm", "run", "start"]