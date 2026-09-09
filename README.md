# SkillGraph AI

![CI](https://img.shields.io/badge/status-active-brightgreen) ![Stack](https://img.shields.io/badge/frontend-React%20%7C%20Vite-blue) ![DB](https://img.shields.io/badge/database-Neo4j-orange) ![License](https://img.shields.io/badge/license-None-lightgrey)

Professional knowledge-graph explorer for career data, skills, roles and company-technology relationships.

**Live app:** [skillgraph-ai-sailu1.vercel.app](https://skillgraph-ai-sailu1.vercel.app)
**Live API:** [skillgraph-ai-levw.onrender.com](https://skillgraph-ai-levw.onrender.com) — check with [`/health`](https://skillgraph-ai-levw.onrender.com/health)

The Vercel deployment currently has Deployment Protection enabled, so visitors are redirected to a Vercel login. Turn it off under the Vercel project's **Settings → Deployment Protection** to make the app public. The Render backend runs on the free tier and spins down when idle, so the first request after a quiet period can take ~50s.

---

## Project Overview

SkillGraph AI is a full-stack web application that visualizes a career knowledge graph (people, skills, roles, companies, technologies, vulnerabilities) and provides role recommendations, analytics and a career assistant. The frontend is an interactive single-page app built with React and React Flow; the backend is an Express API that queries a Neo4j graph database and exposes endpoints consumed by the UI.

Key capabilities implemented in this repository:

- Interactive graph visualization (React Flow) with pan/zoom, minimap and node details
- Person selector and search to focus the graph on an individual and their immediate neighborhood
- Recommendations engine that computes role matches and missing skills for a person
- Analytics endpoints (counts and breakdowns for skills, companies, roles, technologies)
- Career Assistant and Profile pages powered by Neo4j queries

---

## Why a Graph Database?

Graph databases (Neo4j / CognoDB Cloud) are a natural fit for connected, relationship-first data such as people, skills and roles. Compared to a relational database, a native graph engine provides:

- Fast multi-hop traversal without expensive joins
- Intuitive modelling of entities and relationships
- Flexible schema for evolving ontologies (new node labels / relation types)
- Built-in algorithms for path-finding, similarity, and neighborhood analysis

Example model (conceptual):

- Person nodes connected to Skill nodes via HAS_SKILL
- Role nodes connected to Skill nodes via REQUIRES
- Company nodes connected to Technology nodes via USES

Why this matters:

- To compute "roles a person can target" the system performs multi-hop traversal: Person -> HAS_SKILL -> Skill <- REQUIRES <- Role. A graph query finds roles with overlapping skills quickly without complicated JOINs.
- To suggest hiring companies for a role: Role <- HIRING_FOR <- Company and Company -> USES -> Technology allows traversal for recommendation signals across two hops or more.

Small example (natural language):

- Find roles that require the same skills a person already has (Person -> HAS_SKILL -> Skill <- REQUIRES <- Role)
- Find companies using technologies related to a person's skills (Person -> HAS_SKILL -> Skill -> (related Technology) -> Company)

---

## Features

The application implements the following features (as found in the codebase):

- Dashboard — overview page with the interactive graph and quick metrics
- Interactive Graph — React Flow rendering of nodes and edges with node details
- Person Selector — choose a Person to focus the graph (the seed data ships with one, `Sailu`)
- Skills Explorer — list and analytics for Skill nodes
- Companies — Companies listing and basic insights
- Roles — Roles listing and required-skill mapping
- Recommendations — role-match recommendations for a selected person
- Analytics — aggregated counts and breakdowns for graph categories
- Career Assistant — guidance based on missing skills and recommended learning steps
- Profile — person-centric view
- Search — quick node search in the graph view
- Graph Visualization — minimap, fit-to-view, pan, zoom, and node highlighting

---

## Tech Stack

- Frontend
  - React 18 (Vite) + React Router
  - React Flow for interactive graph rendering
  - Axios for API requests
  - Chart.js / react-chartjs-2 for charts

- Backend
  - Node.js + Express
  - neo4j-driver (official Neo4j JavaScript driver)
  - Simple controller/service structure that uses parameterized Cypher

- Database
  - Neo4j (AuraDB / CognoDB Cloud compatible)

- Graph Library
  - reactflow (official React Flow)

- Charts
  - chart.js + react-chartjs-2

- Styling
  - Inline styles with design tokens; no CSS framework required

- Deployment
  - Frontend: Vercel (static deployment)
  - Backend: Render (or any Node host)

---

## Architecture

The application follows a straightforward two-tier architecture:

Frontend (React SPA)
  ↓ (REST)
Express API (Node.js)  — controllers & services
  ↓ (neo4j-driver)
Neo4j JavaScript Driver
  ↓
CognoDB Cloud (Neo4j AuraDB compatible)

Key components:

- frontend/src/components/GraphView.jsx — interactive React Flow implementation
- backend/config/neo4j.js — driver initialization (reads env vars)
- backend/services/neo4jService.js — small wrapper for session-run and parameterized queries
- backend/controllers/* — controllers that implement /api endpoints consumed by the UI

---

## Graph Data Model (Mermaid)

```mermaid
graph LR
  Person -- HAS_SKILL --> Skill
  Role -- REQUIRES --> Skill
  Company -- USES --> Technology
  Company -- HIRING_FOR --> Role
  Person -- TARGETS --> Role
  Technology -- HAS_VULNERABILITY --> Vulnerability
```

---

## Main Cypher Queries (examples and explanation)

The backend exposes a set of read-only queries. Below are the most important queries used by the application, taken from the controller implementations:

1) Graph payload for the React Flow view (backend/controllers/graphViewController.js)

```cypher
MATCH (a)-[r]->(b)
RETURN
  elementId(a) AS sourceId,
  labels(a)[0] AS sourceType,
  a.name AS sourceName,
  type(r) AS relation,
  elementId(b) AS targetId,
  labels(b)[0] AS targetType,
  b.name AS targetName
```

- Purpose: returns a flattened edge list and deduplicated nodes derived from all relationships. The controller converts elementId(...) values to stable string ids and builds nodes/edges for React Flow.

2) Person's skills (used for the recommendations flow)

```cypher
MATCH (p:Person {name: $name})
OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)
RETURN p, collect(distinct s.name) AS personSkills
```

- Parameterized: `$name` is provided by the controller to avoid injection and enable query plans caching.

3) Roles and required skills (recommendations)

```cypher
MATCH (r:Role)
OPTIONAL MATCH (r)-[:REQUIRES]->(sk:Skill)
RETURN r.name AS roleName, collect(distinct sk.name) AS requiredSkills
```

- Purpose: controller loads required skills for each role and computes a match percentage in application logic.

4) Analytics overview (aggregates)

```cypher
MATCH (p:Person) RETURN count(p) AS total
```

- Purpose: each label is counted by its own query and the controller assembles the response. Chaining one `MATCH` per label into a single pipeline looks tidier but breaks on a partially populated graph: a label with no nodes drops every row, the query returns no records, and the endpoint fails.

Why graph traversal is powerful

- Multi-hop queries are expressed naturally and run efficiently in graph engines. For example, to find roles related to a person via shared skills you can traverse: (Person)-[:HAS_SKILL]->(Skill)<-[:REQUIRES]-(Role) in a single query or combine small queries and post-process results in-app.

---

## Screenshots

- Dashboard
<img width="1919" height="880" alt="image" src="https://github.com/user-attachments/assets/9ba38c31-0e1a-4845-a955-d2a071d7da2c" />


- Graph
<img width="1904" height="855" alt="image" src="https://github.com/user-attachments/assets/f2e34f45-5018-43f6-8a70-3379df359ac9" />

<img width="1877" height="871" alt="image" src="https://github.com/user-attachments/assets/c6c462ed-4344-4b77-b150-a86f5bcc3e6e" />
<img width="1872" height="809" alt="image" src="https://github.com/user-attachments/assets/c2fc89e8-5d00-453e-bd2a-06b43d20b4c5" />

- Analytics
 <img width="1714" height="258" alt="image" src="https://github.com/user-attachments/assets/8e7d0b4c-edf6-4ee5-9f60-2d6277800456" />

- Recommendations
 <img width="1911" height="842" alt="image" src="https://github.com/user-attachments/assets/38c3a2fe-7e8d-49ff-a4c6-08fc83f790b0" />


- Career Assistant
 <img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/0608ae79-1f1a-4b6f-ae2e-ed3aa6d3c5c6" />

- Profile
<img width="1918" height="885" alt="image" src="https://github.com/user-attachments/assets/42ec8e45-d468-416f-973c-a1730e77e52b" />


---

## Installation (local)

1. Clone the repository

```bash
git clone <repo-url> skillgraph-ai
cd skillgraph-ai
```

2. Install frontend and backend dependencies

```bash
cd frontend
npm install
cd ../backend
npm install
```

3. Configure environment variables

- Copy `backend/.env.example` → `backend/.env` and provide NEO4J_URI, NEO4J_USERNAME and NEO4J_PASSWORD (do not commit secrets).
- Copy `frontend/.env.example` → `frontend/.env` and set VITE_API_URL if the backend runs on a non-default host.

4. Run the backend

```bash
cd backend
npm start
```

5. Seed the graph (first run only)

```bash
cd backend
node seed-cognodb.js      # constraints, nodes and relationships
node run-cognodb.js       # relationship queries from database/relationship-queries.md
```

Both scripts use `MERGE`, so re-running them is safe and will not duplicate data. A fully seeded graph holds 67 nodes and 137 relationships.

6. Run the frontend

```bash
cd frontend
npm run dev
```

Open the app at: `http://localhost:3000` (Vite default)

---

## Environment Variables (.env.example)

`backend/.env.example`

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
# NEO4J_URI=bolt://localhost:7687   # example (commented) - do not commit credentials
# NEO4J_URI=bolt+s://<instance>.databases.cognodb.cloud
# NEO4J_USERNAME=neo4j
# NEO4J_PASSWORD=secret
```

`frontend/.env.example`

```env
VITE_API_URL=https://skillgraph-ai-levw.onrender.com
```

Set this to `http://localhost:5000` in `frontend/.env` to point the UI at a local backend. Vite bakes the value in at build time, so changing it on Vercel requires a redeploy, not just a restart.

---

## Project Structure

```
skillgraph-ai/
├── backend/
│   ├── config/
│   │   └── neo4j.js           # driver initialization (reads env vars)
│   ├── controllers/          # API controllers (graph, person, recommendations, analytics, etc.)
│   ├── routes/               # Express route wiring
│   ├── services/             # neo4jService.js wrapper
│   ├── database/             # schema.cypher, schema-cognodb.cypher, relationships.cypher
│   ├── seed-cognodb.js       # loads schema-cognodb.cypher, one statement per request
│   ├── run-cognodb.js        # runs the statements in database/relationship-queries.md
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── GraphView.jsx  # React Flow integration and graph rendering
│   │   ├── services/api.js
│   │   └── pages/             # other SPA pages (Dashboard, Recommendations, Profile...)
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .env.example
```

---

## Future Improvements

Realistic next steps without breaking existing features:

- Add an optional startup health-check that runs `driver.verifyConnectivity()` and fails with a helpful message when env vars are misconfigured (the code already attempts this on server start).
- Add role-similarity algorithms (graph algorithms) for better recommendations.
- Add unit and integration tests for controllers and React components.
- Add authentication and per-user preferences (so multiple users can save views).

---

## Assignment Mapping (WEXA AI CognoDB)

| Requirement | Status | Notes |
|---|---:|---|
| Use a real CognoDB Cloud instance | PASS (requires env) | backend/config/neo4j.js validates CognoDB-style URI; set NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD to connect. |
| Connect using official Neo4j JS driver | PASS | `neo4j-driver` is used in `backend/config/neo4j.js` |
| Read credentials from environment variables | PASS | All credentials are read from process.env in config/neo4j.js |
| Never hardcode URI/username/password | PASS | No secrets in code; `.env.example` contains commented examples only |
| Use parameterized Cypher queries | PASS | Controllers use `runReadQuery(cypher, params)` (examples in `recommendationController.js`) |
| Handle DB connection failures gracefully | PASS | server attempts `verifyConnectivity()` at startup and controllers catch errors and return 500 responses |
| Provide seed/load script for graph DB | PASS | `backend/seed-cognodb.js` loads `database/schema-cognodb.cypher` through the driver; `run-cognodb.js` applies `database/relationship-queries.md` |
| Application reads live data from DB (not local JSON) | PASS | Controllers use neo4jService to run Cypher and return live results |

---

## Demo

- Frontend: https://skillgraph-ai-sailu1.vercel.app (behind Vercel Deployment Protection)
- Backend: https://skillgraph-ai-levw.onrender.com
- Video walkthrough: _TBD_

---

## Deployment (Vercel frontend + Render backend)

This repository is prepared to deploy the frontend as a Vercel static site and the backend as a Render web service. The project already includes `vercel.json` (frontend) and `render.yaml` (Render infrastructure manifest) to simplify deployment. Below are step-by-step instructions and the environment variables required.

High-level steps

1. Create a GitHub (or GitLab) repository and push this project to the `main` branch.
2. Deploy the backend to Render (recommended):
   - Import the repository into Render using the `render.yaml` manifest (Render supports a "Deploy from Repo" flow and will detect `render.yaml`).
   - Fill in the values Render leaves blank (`sync: false` in `render.yaml`) from the service's **Environment** tab:
     - `NEO4J_URI` = bolt+s://<instance>.databases.cognodb.com (CognoDB/AuraDB URI)
     - `NEO4J_USERNAME` = <username>
     - `NEO4J_PASSWORD` = <password>
     - `CORS_ORIGIN` = https://skillgraph-ai-sailu1.vercel.app
     - `VITE_API_URL` (only for the optional Render static frontend; with Vercel, set it there instead)
   - Confirm Render creates a web service named `skillgraph-ai-backend` and that it uses `backend` as the root. The `render.yaml` in the repo uses `npm install` and `npm start`.
   - After creation, open the Render service and set any additional secrets in the dashboard if necessary.

3. Deploy the frontend to Vercel (recommended):
   - Create a new Vercel project and import the repository.
   - In the Vercel project settings -> Environment Variables, set:
     - `VITE_API_URL` = https://<your-render-backend-url>
   - Build & deploy; Vercel will use `frontend/package.json` and `vercel.json` to build the static site.

CORS details

- The backend reads `CORS_ORIGIN` at runtime and uses it for the `cors()` middleware. Set `CORS_ORIGIN` to your Vercel application origin (for example, `https://skillgraph-ai-sailu1.vercel.app`) in Render secrets. This ensures only the frontend origin is allowed rather than using `*`.

Post-deployment verification

1. Wait for Render to finish building and starting the backend; open the Render service URL and verify the health endpoint responds:
   - `GET https://skillgraph-ai-levw.onrender.com/health` should return JSON { status: 'ok' }
2. Verify Neo4j connectivity in Render logs — the server attempts `driver.verifyConnectivity()` at startup and will log success or a helpful error message.
3. After backend is running, deploy frontend to Vercel and confirm the site loads.
4. Verify API endpoints from the frontend (or using curl/postman):
   - `GET https://skillgraph-ai-levw.onrender.com/api/graph`
   - `GET https://skillgraph-ai-levw.onrender.com/api/persons`
   - `GET https://skillgraph-ai-levw.onrender.com/api/skills`
   - `GET https://skillgraph-ai-levw.onrender.com/api/companies`
   - `GET https://skillgraph-ai-levw.onrender.com/api/roles`
   - `GET https://skillgraph-ai-levw.onrender.com/api/recommendations/<personName>`
   - `GET https://skillgraph-ai-levw.onrender.com/api/analytics/overview`
   - `GET https://skillgraph-ai-levw.onrender.com/api/career-advice/<personName>`

Environment variables to set (summary)

- Render (backend) — set in the service's Environment tab (declared `sync: false` in `render.yaml`):
  - `NEO4J_URI` (e.g. bolt+s://<instance>.databases.cognodb.cloud)
  - `NEO4J_USERNAME`
  - `NEO4J_PASSWORD`
  - `CORS_ORIGIN` (set to Vercel origin e.g., https://skillgraph-ai-sailu1.vercel.app)
  - (optional) `VITE_API_URL` if you use Render static frontend instead of Vercel

- Vercel (frontend) — Environment Variables in Vercel project settings:
  - `VITE_API_URL` = https://<your-render-backend-url>

Security and secrets

- Never commit NEO4J credentials or CORS origin secrets to source control. Use Render secrets and Vercel environment variables.
- The codebase contains `backend/database/schema.cypher` for seeding the graph — run this separately via cypher-shell or CognoDB import tooling against your CognoDB instance if you need seed data.

Automating deployment

- Render: the included `render.yaml` declares both services and leaves every credential as `sync: false`, so importing it as a Blueprint creates the services and then prompts for the values.
- Vercel: `vercel.json` is present to set a static build configuration; link your repo in Vercel and add the `VITE_API_URL` environment variable in project settings.

---

## Live URLs

| | URL | Notes |
|---|---|---|
| Frontend (Vercel) | https://skillgraph-ai-sailu1.vercel.app | Deployment Protection is on, so visitors hit a Vercel login first |
| Backend (Render) | https://skillgraph-ai-levw.onrender.com | Free instance, spins down when idle |
| Database | CognoDB Cloud (`bolt+s://<instance>.databases.cognodb.com`) | Credentials live in Render environment variables |

To repoint either side, set `VITE_API_URL` in Vercel to the backend URL and redeploy, and set `CORS_ORIGIN` in Render to the frontend origin.

`CORS_ORIGIN` is currently unset on the Render service, so `server.js` falls back to `*` and the API accepts requests from any origin. Setting it to the Vercel origin narrows that to the one site that needs it.

---

## Author

Sailu Chittala

- GitHub: https://github.com/sailuchittala
- LinkedIn: https://www.linkedin.com/in/sailuchittala

---
