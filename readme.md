# **🏡 Address Viewer**

Welcome to the Address Viewer! This monorepo project contains two separate applications: the **Client** (a React/Vite front-end) and the **Server** (a Node/Express backend).

This README provides general setup instructions. For detailed information on running, building, and testing each application, please refer to the README file within its respective subdirectory (`/client` or `/server`).

## **🚀 Getting Started**

### **1. Prerequisites**

* **Node.js**: Requires version >=`24.11.0` (as specified in your `package.json`).  
* **Docker**: Required for running containerized builds.  
* **.env Files**: Necessary for specifying ports and external service targets.

### **2. Environment Variables Setup (Crucial!)**

Both the client and server applications require environment variables to connect to each other.

1. **Create `.env` files** in the root of the **client** and **server** directories.  
2. **Client (`/client/.env`)**: Define the proxy target for development. This tells Vite where to forward API calls.
```
   # Client .env (Development)  
   VITE_API_PROXY_TARGET=http://localhost:8080
```

3. **Server (`/server/.env`)**: Define the port the server should listen on.  
```
   # Server .env  
   PORT=8080  
   NODE_ENV=development
```

## **🏃 Running the Application (Manual Method)**

To run the full stack locally (outside of Docker), you need two terminal windows: one for the client and one for the server.

### **Step 1: Run the Backend Server**

The server provides the data endpoint (`/search`).

```
# Navigate to the server directory  
cd server 
```

```
# Install dependencies (if not done already)  
npm install
```

```
# Start the server with Nodemon (auto-reloads on save)  
npm run dev 
```
The server will be running on `http://localhost:8080`.

### **Step 2: Run the Frontend Client**

The client will automatically use the proxy defined in its Vite configuration to reach the server.

```
# Navigate to the client directory  
cd client 
```

```
# Install dependencies  
npm install
```

```
# Start the client dev server 
npm run dev 
```

The client application will be accessible, by default, at `http://localhost:5173`.

## **🐳 Docker Deployment & Testing**

The recommended way to deploy or run production E2E tests is via Docker, as this isolates the environment and ensures portability.

### **1. Docker Build Commands**

Use the appropriate Dockerfile for the application you are building. Note that the **Client build is dynamic** and requires the backend URL at build time.

| Application | Command (from root) |
| :---- | :---- |
| **Client** | `docker build -f client/Dockerfile -t client-app:latest client` |
| **Server** | `docker build -f server/Dockerfile -t server-app:latest server` |

### **2. Docker Run Commands**

Use the `-e` flag to specify runtime configuration for the server, or to launch the built client.

| App | Mode | Command | Access Port |
| :---- | :---- | :---- | :---- |
| **Server** | Production | `docker run -d -p 8080:8080 -e NODE_ENV=production -e PORT=8080 --name server-prod server-app:latest` | `http://localhost:8080` |
| **Client** | Production | `docker run -d -p 80:4173 -e VITE_API_PROXY_TARGET='http://host.docker.internal:8080' --name client-prod client-app:latest` | `http://localhost` |

## **🛠️ Project Management Commands**

All development commands should be run from within their respective subdirectories (`/client` or `/server`).

| Command | Location | Description |
| :---- | :---- | :---- |
| `npm run build` | `/client` or `/server` | Compiles source code for production. |
| `npm run test` | `/client` or `/server` | Runs all unit/integration tests once. |
| `npm run test:e2e:prod` | `/client` | Runs E2E tests against a **production build** (uses Docker/Preview port). |
| `npm run lint` | `/client` or `/server` | Executes code quality checks. |

## Q&A

For detailed setup, dependencies, and advanced usage (like testing, staging builds, and environment configuration), please refer to the dedicated README.md files in the **client/** and **server/** folders.