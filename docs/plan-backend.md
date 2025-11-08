📡 Phase 2: Back-End (Node.js API)
Goal: Build a performant, secure API that fulfills specific functional constraints.

Framework: Use Node.js with a lightweight framework like Express or Fastify.

Data Ingestion: Load the adresses.json file [4]. CHECK

Search Implementation:

Implement the recommended trie-search for rapid retrieval [9] CHECK, or a similar efficient data structure if you prefer, to make the dataset searchable [8] CHECK.

Endpoint Logic (GET /search/:query):

Constraint Check: Ensure the API only provides suggestions if the input is at least 3 characters [10].

Limiting: Slice the output to return a maximum of 20 results [11]. CHECK

Response Format: Ensure it returns a JSON Array of objects matching their examples [12, 13].

Production Readiness [60]:

Logging: Integrate a logger (e.g., winston or morgan) to track requests. 

Security [56]: Implement basic security (e.g., helmet for headers, rate-limiting to prevent abuse).

Error Handling: Ensure graceful failure if the dataset is missing or malformed.

Unit Testing [58]:

BE: Test the search logic specifically (e.g., does it actually return exactly 20 results? Does it ignore 2-letter queries?).

Integration Testing [58]:

Use a tool like Supertest to test the actual API endpoints.

🚀 Phase 5: Delivery & DevOps (Bonus Skills)
Goal: Satisfy the "nice to have" skills (CI/CD, Cloud) and ensure ease of review.

Documentation: Write a clear README.md explaining how to build, test, and run the solution locally [46]. explicitly mention why certain architectural decisions were made.

CI/CD: Set up a simple GitHub Action that runs your tests automatically on every push. This demonstrates CI/CD skills.

Hosting: Deploy the app so it is live [46].

Option A (Easiest): Vercel/Netlify for the React front-end, and Render/Railway for the Node back-end.

Option B (Advanced): Dockerize the application to demonstrate cloud-native skills.