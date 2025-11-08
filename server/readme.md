# **🌐 Address Autocomplete API Server**

This repository contains the Node.js/TypeScript backend service for the Full-Stack Developer exercise. It provides a highly performant and production-ready autocomplete API that searches a Norwegian address dataset.

## **🚀 Technology Stack**

| Category | Tool / Framework | Purpose |
| :---- | :---- | :---- |
| **Core** | Node.js / TypeScript | Runtime Environment / Language |
| **Framework** | Express | API Routing |
| **Data Structure** | trie-search | Optimized in-memory search for the address dataset |
| **Security** | Helmet, express-rate-limit | HTTP Header hardening, DDoS/Abuse prevention |
| **Testing** | Jest, Supertest | Unit & Integration testing framework |

## **⚙️ Setup and Installation**

### **Prerequisites**

You must have **Node.js installed (`\>=24.11.0`)** as specified in the `package.json` engines.

### **1\. Install Dependencies**

Navigate to the project root directory and install all required packages:

```
npm install
```

### **2\. Configure Environment**

This application uses environment variables (.env) for configuration. Create a file named **.env** in the root directory and add the following:

```
# .env file  
# Use 8080 for local development  
PORT=8080

# This is read by the app.  
# When deploying, hosting platforms typically set this to 'production'.  
NODE\_ENV=development 
```

### **3. Add Dataset**

Place the provided `adresses.json` file inside the `./data/` directory (you may need to create this directory).

## **▶️ Running the Application**

### **💻 Development Mode (Hot Reloading)**

This mode runs the application using ts-node and nodemon, allowing for live code changes without manual restarts.

```
npm run dev
```

The API will be available at: http://localhost:8080/api/search/:query (or the port specified in .env).

### **📦 Production Mode (Build & Start)**

This simulates a deployment environment, building the TypeScript code into optimized JavaScript before execution. The **Rate Limiter is only active in this mode**.

1. **Build TypeScript:** Compile source files from `src/` to `dist/`.  
```
npm run build
```

2. **Start Server:** Run the compiled JavaScript from the dist/ directory.  
```
npm start
```

### **🐳 Docker Deployment**

The provided `Dockerfile` creates a lightweight, production-ready image. The backend API target is specified at **runtime**, where all setting can be overriden by `-e` parameter.

### **Building the Docker Image**

Use a default docker build command like bellow.

```docker build -t server-app:latest .```

### **Running the Docker Container**

The container serves the application on internal port **8080** and in **development** mode. You must map this to a desired host port (e.g., 80 or 8080) to access it externally.

You need to pass the environment variables `-e` that should be accessible by the container.

Example: Run the 'latest' image, mapping container port `81` to host port 8080  

```
docker run -d -p 8080:81 -e PORT=81 -e NODE_ENV=development --name server-prod server-app:latest
```

**Access URL:** Open your web browser to http://localhost which will point to port `8080`.


## **🧪 Testing**

The server includes a comprehensive test suite covering **Unit Tests** (services, controllers, config) and **Integration Tests** (middleware, security, error handling, rate limiting).

| Command | Description |
| :---- | :---- |
| npm test | **Runs all unit and integration tests once.** |
| npm run test:watch | Runs all tests and watches for file changes (ideal for TDD). |

### **Key Test Coverage**

* ✅ **Security:** Confirms that Helmet headers (CSP, X-Frame-Options) are correctly set.  
* ✅ **Rate Limiting:** Confirms that rate limiting is **skipped in Development** and **enforced in Production** (25 req/min).  
* ✅ **Unit Logic:** Ensures the `TrieSearch` service correctly loads data, handles failure, and applies the 20-result limit.