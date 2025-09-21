### README: Mock Server (`server.jsx`) for Talentflow

This document provides a detailed overview of the mock server implementation for the Talentflow application. It explains the server's purpose, core technologies, data models, and API functionality to provide a clear understanding for a technical evaluator.

---

### Purpose
The mock server, built with **MirageJS**, acts as a full-featured replacement for a real backend API. Its primary function is to allow the front-end of the Talentflow application to be developed and tested completely independently. It simulates real-world server behaviors, including handling data requests, updates, and even intentional network latency and errors, providing a robust environment for front-end development.

---

### Key Technologies
* **MirageJS**: The core of the mock server. It intercepts `fetch` requests from the front end and uses its own in-memory database to simulate a backend, making development possible without a live server.
* **FakerJS**: A library used to generate large amounts of realistic, yet fake, data. This is crucial for populating the mock database with over 1000 candidate records to test the application's performance.
* **Dexie.js**: A wrapper for the browser's **IndexedDB**, serving as the persistence layer for the mock data. This replaces temporary in-memory storage, ensuring that any changes made—like creating a new job or updating a candidate's stage—will persist even after the browser is refreshed. This allows developers to maintain their work between sessions.

---

### Data Models
The server is configured with three primary data models to reflect the application's core data structure:
* `jobs`: Each job has a `title`, `status` (e.g., "active", "archived"), a list of `tags` (e.g., "React"), and a numerical `order` for sorting.
* `candidates`: Each candidate has a `name`, `email`, and is associated with a specific job via `jobId`. Their progress is tracked through a `stage` (e.g., "applied", "screen", "hired") and a `timeline` of stage changes.
* `assessments`: An assessment is linked to a `jobId` and contains a `title` and an array of `sections`. Each section, in turn, contains an array of `questions` with a specific `type` (e.g., "single-choice", "long-text") and optional `validation` rules or `conditions`.

---

### Initial Data Seeding
Upon the first run, the server's internal database is automatically populated with a predefined set of data. This seeding process ensures that the application is ready to be explored and tested immediately without any manual data entry.
* **Jobs**: The server creates **25 unique job postings**, each with a title, status, tags, and an initial display order.
* **Candidates**: Over **1000 mock candidates** are generated using `FakerJS`. This large dataset allows for the testing of performance-intensive features like the virtualized lists on the Candidates page.
* **Assessments**: Three detailed assessments are created for specific jobs, showcasing different question types and conditional logic, enabling a full demonstration of the assessment builder and preview pages.

---

### API Endpoints and Simulated Realism
The server defines a comprehensive set of RESTful API endpoints for managing the platform's data. To mimic a real-world server, several layers of realism have been added:
* **Artificial Latency**: All API requests are configured with a simulated network latency of 750 milliseconds to prevent the application from feeling instantaneous during development.
* **Intended Errors**: Write operations (such as `POST`, `PATCH`, or `PUT`) are configured to fail a small percentage of the time. This allows the front-end code to be tested for its ability to handle and recover gracefully from network or server errors.
    * `POST /jobs`: Has a 5-10% chance of failing.
    * `PATCH /jobs/:id`: Has a 5-10% chance of failing.
    * `PATCH /jobs/:id/reorder`: Has a higher failure rate of **30%** to specifically test the front-end's rollback mechanism for drag-and-drop actions.
* **Route Logic**: Endpoints for fetching data support a variety of query parameters for filtering, searching, and sorting, demonstrating the server's ability to handle complex data manipulation requests.
    * `GET /jobs`: Supports filtering by `search`, `status`, and `tags`, as well as sorting by `order` and `name`. It also includes pagination.
    * `POST /jobs`: Creates a new job with a unique ID and slug.
    * `GET /candidates`: Filters candidates by `stage` and `jobId`.
    * `PATCH /candidates/:id`: Updates a candidate's stage and automatically adds an entry to their `timeline`.
    * `PUT /assessments/:jobId`: Creates or updates a job-specific assessment.
    * `POST /assessments/:jobId/submit`: Saves a candidate's assessment responses to the IndexedDB.