# SkillGraph AI Deployment Checklist

## Frontend (Vercel)
- [ ] Ensure `frontend/package.json` has a valid `build` script
- [ ] Set `VITE_API_URL` environment variable in Vercel to the backend URL
- [ ] Confirm `frontend/.env.example` is available for local development
- [ ] Use `npm run build` locally to validate production build
- [ ] Configure Vercel to use the `frontend` directory as the project root if needed
- [ ] Add `vercel.json` to support SPA routing and Vite static build

## Backend (Render)
- [ ] Ensure `backend/package.json` has `start` script for production
- [ ] Use `PORT` from environment variables
- [ ] Set `CORS_ORIGIN` in Render to the deployed frontend domain or `*` during staging
- [ ] Add `NEO4J_URI`, `NEO4J_USERNAME`, and `NEO4J_PASSWORD` as Render secrets
- [ ] Confirm `/health` endpoint returns `200 OK`
- [ ] Confirm `/api` endpoints return valid JSON
- [ ] Add `render.yaml` to define Render services and deployment settings

## General
- [ ] Review updated `README.md` for deployment steps and environment variables
- [ ] Remove hardcoded local API URLs from frontend source code
- [ ] Remove debug console logs from production code
- [ ] Verify all pages are responsive and present data gracefully
- [ ] Verify `npm run build` succeeds for frontend
- [ ] Verify backend starts successfully with no startup errors
- [ ] Keep `.env` files out of source control
