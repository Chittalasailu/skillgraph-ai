# Copilot instructions for SkillGraph AI

## Repository shape

This repository is a two-package app:

- `frontend/` is a React 18 + Vite single-page app that renders the dashboard, analytics, recommendations, and career-assistant workflows.
- `backend/` is a Node.js + Express API that serves graph data from Neo4j and powers the analytics and recommendation endpoints.

The app is intentionally split by runtime concern. Keep frontend-only changes in `frontend/` and backend/data changes in `backend/` unless the change clearly spans both.

## Build, run, and validation commands

Use the package-local commands from the workspace root or by `cd`-ing into each package.

Frontend:

```bash
cd frontend
npm install
npm run dev        # Vite dev server on http://localhost:3000
npm run build      # Production bundle via Vite
npm run preview    # Preview the production bundle locally
```

Backend:

```bash
cd backend
npm install
npm start          # Express server; defaults to PORT or 5000
```

Environment setup:

- Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL`.
- Copy `backend/.env.example` to `backend/.env` and set `PORT`, `NODE_ENV`, `CORS_ORIGIN`, and the Neo4j credentials (`NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`).
- The root `.env.example` is only a pointer file and does not replace the per-package `.env` files.

There is no dedicated test or lint script wired into the current `package.json` files, so there is no repository-standard single-test command to use today. The frontend build (`npm run build`) is the available automated validation command in this repo; for backend smoke-checking, use the health endpoint (`GET /health`).

## High-level architecture

### Frontend

The frontend is a route-based React UI that uses `BrowserRouter` and lazy-loaded page modules from `src/pages/`. The main App shell in `frontend/src/App.jsx` owns the selected person state and passes it to route pages, including the dashboard, recommendations, profile, and career-assistant views.

A few patterns matter for future edits:

- API calls should go through `frontend/src/services/api.js` instead of creating ad hoc fetch logic in components.
- Page-level data loading is handled locally in each page with `useEffect`, `Promise.all`, and the shared Axios client.
- The graph visualization is rendered via `reactflow` and the `GraphView` component, while charts are shown through Chart.js components.

### Backend

The backend starts in `backend/server.js`, sets up Express middleware, defines the top-level health endpoints (`/` and `/health`), and mounts route groups under `/api`.

The backend architecture is intentionally modular:

- `backend/routes/` registers endpoint URLs.
- `backend/controllers/` contains request handlers.
- `backend/services/` contains shared helpers; `neo4jService.js` is the primary database access wrapper.
- `backend/config/neo4j.js` centralizes the Neo4j driver construction so the rest of the codebase does not create connection objects repeatedly.

The graph-backed features are organized around the same concept: query the Neo4j graph, shape that data in controllers, and return JSON to the frontend.

## Key repository conventions

- Match the existing route/controller split when adding new endpoints. If the endpoint corresponds to a domain (`persons`, `roles`, `companies`, `analytics`, `career`, `graph`), place the route in the matching `backend/routes/*.js` file and the handler in the matching `backend/controllers/*.js` file.
- Keep API environment configuration in the package-local `.env` file; do not hardcode `localhost`, `PORT`, or Neo4j credentials into source files.
- When adding a graph-backed feature, keep the Cypher query logic in the backend service layer instead of embedding direct query strings in React components.
- The app expects a person selection to flow through the top-level `selectedPerson` state in `App.jsx`. Reuse that state for cross-page views instead of introducing a separate local state store.
- Frontend deployment is Vercel-oriented (`vercel.json`), and backend deployment is Render-oriented (`render.yaml`). That deployment split is part of the project shape and should be preserved unless the deployment plan is intentionally changing.
