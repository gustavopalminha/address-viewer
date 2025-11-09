# **🏡 Address Viewer Client Application**

This folder contains the front-end client for the Address Viewer, built using **React, TypeScript, and Vite**. This application is responsible for searching and displaying address information via a backend proxy.

## **🛠️ Project Setup**

### **Prerequisites**

* Node.js (>= `24.11.0`, as defined in `package.json`).  
* npm (or compatible package manager).

### **Installation**

1. Clone the repository.  
2. Install all dependencies:  
   npm install

### **Environment Configuration (Proxy)**

The client uses Vite's proxy mechanism to forward API calls (`/api/search/...`) to a separate backend server. This configuration must be defined in a local environment file.

1. **Create your Environment File**: Use `.env.development` for local dev.  
2. **Mandatory Variable**: This file *must* contain the target URL for your backend server.

| Variable | Description |
| :---- | :---- |
| VITE_API_PROXY_TARGET | The full URL of the backend API server. |

**Example (`.env.development`):**
```
# MANDATORY PROXY: All /api calls are forwarded to this target  
VITE_API_PROXY_TARGET=http://localhost:8080
````

*For production, staging, or custom modes, create the corresponding file (e.g., `.env.staging`).*

## **🚀 Running the Application**

### **Development Mode (Local Proxy)**

For development, you need two separate terminals: one for the backend server (not included here) and one for the client.

1. **Terminal 1 (Backend Server)**:  
   * Start your backend API server (e.g., `npm run dev` in the server project).  
2. **Terminal 2 (Client Application)**:  
   * Run the Vite development server with Hot Module Replacement (HMR). This server listens on port **5173** and handles the proxy forwarding.

npm run devThe application will be accessible at `http://localhost:5173/`.

### **Production Preview Mode**

This command runs a preview server using the compiled, optimized production assets located in the ./dist folder.
```
npm run preview
```
The application will launch on port **`4173`** and is accessible across your local network (`--host`).

### **Available Commands**

| Command | Description |
| :---- | :---- |
| `npm run dev` | Starts the client development server with HMR. |
| `npm run build` | Runs vite build for creating the production bundle (into ./dist). |
| `npm run build:staging` | Creates a production build using staging environment settings. |
| `npm run preview` | Launches the production build assets on port `4173` (accessible via local network). |
| `npm run lint` | Runs ESLint for static code analysis. |

## **🧪 Testing**

Testing is split into unit tests (Vitest) and End-to-End tests (Playwright), with E2E API calls mocked internally for reliability.

### **Unit Tests (Vitest)**

| Command | Description |
| :---- | :---- |
| `npm run test` | Runs all unit tests once (ideal for Continuous Integration). |
| `npm run test:watch` | Runs Vitest in interactive watch mode for rapid development. |
| `npm run test:coverage` | Generates a code coverage report. |

### **E2E Tests (Playwright)**

E2E tests require the application to be running or built first, depending on the environment. The E2E_TARGET variable is embedded in the script and controls which server is launched.

| Command | Environment | Description |
| :---- | :---- | :---- |
| `npm run test:e2e` | Development | Runs tests in headless mode against the **Dev server** (port `5173`). |
| `npm run test:e2e:dev` | Development | Alias for `npm run test:e2e`. |
| `npm run test:e2e:prod` | **Production Build** | **MANDATORY CI TEST.** Runs build, serves production assets (port `4173`), and runs tests against the final optimized bundle. |

## **🐳 Docker Deployment**

The provided `Dockerfile` creates a lightweight, production-ready image.

### **Building the Docker Image**

Use a default docker build command like bellow.

```docker build -t client-app:latest .```

### **Running the Docker Container**

The container serves the application on internal port **4173**. You must map this to a desired host port (e.g., 80 or 3000) to access it externally.

You need to pass the environment variable `-e VITE_API_PROXY_TARGET` that hould be accessible by the container.

Example: Run the 'latest' image, mapping container port `4173` to host port 80  

```
docker run -d -p 80:4173 -e VITE_API_PROXY_TARGET='http://host.docker.internal:8080' --name client-prod client-app:latest
```

**Access URL:** Open your web browser to http://localhost which will point to port `80`.