💻 Phase 3: Front-End (React)
Goal: Build a responsive SPA with a custom-built search component.

Framework: Create a Single-Page App (SPA) using React [39]. Vite is recommended for modern tooling, but ensure standard CRA (Create React App) compatibility if IE support becomes too difficult with Vite.

Search Component (The Core Challenge):

Constraint: You must not use existing autocomplete libraries [40]. You need to build this manually using standard <input> and React state.

UX: Implement "debouncing" on the input to avoid spamming your API with every keystroke.

Real-time updates: Ensure results display and update as the user types [41].

Results Display:

Map through the API response and display the street name, post number, and city for each result [42].

Handle loading states (e.g., a spinner while fetching) and error states (e.g., "No results found" or API failure).

Browser Compatibility:

Test specifically for Internet Explorer (IE) on desktop [43]. This is an unusual modern requirement. You may need react-app-polyfill or specific Babel configurations to ensure modern JS features work in IE.

🛡️ Phase 4: Testing & "Production Readiness"
Goal: Demonstrate professional rigor beyond just writing features.

Unit Testing [58]:

BE: Test the search logic specifically (e.g., does it actually return exactly 20 results? Does it ignore 2-letter queries?).

FE: Test the search component (e.g., does typing trigger the debounced function?).

Integration Testing [58]:

Use a tool like Supertest to test the actual API endpoints.

Consider a basic end-to-end test (e.g., Cypress or Playwright) if you have time, to show true full-stack confidence.

🚀 Phase 5: Delivery & DevOps (Bonus Skills)
Goal: Satisfy the "nice to have" skills (CI/CD, Cloud) and ensure ease of review.

Documentation: Write a clear README.md explaining how to build, test, and run the solution locally [46]. explicitly mention why certain architectural decisions were made.

CI/CD: Set up a simple GitHub Action that runs your tests automatically on every push. This demonstrates CI/CD skills.

Hosting: Deploy the app so it is live [46].

Option A (Easiest): Vercel/Netlify for the React front-end, and Render/Railway for the Node back-end.

Option B (Advanced): Dockerize the application to demonstrate cloud-native skills.