# wanderlust

## Quick start

This app was developed to run on Render (https://render.com). You can also run it locally for development.

Required environment variables

- `ATLASDB_URL` — MongoDB connection string (Atlas). Example: `mongodb+srv://user:pass@cluster0.mongodb.net/wanderlust`.
- `SECRET` — a session secret used by express-session and connect-mongo.

Optional environment variables you may need to set on Render or locally:

- `MAPBOX_TOKEN` — Mapbox token if map features are used.

Run locally (Windows PowerShell)

```powershell
# install dependencies
npm install

# create a .env file in the project root with the required variables, for example:
# ATLASDB_URL="your-mongo-url"
# SECRET="some-long-secret"

# start in dev mode (auto-restart on changes)
npm run dev

# or start in production mode
npm run start
```

## Deploying to Render

1. Create a new Web Service on Render and connect your repository.
2. Set the build and start commands (Render will use the `start` script by default). Ensure `npm install` runs during build.
3. In the Render dashboard, add the environment variables `ATLASDB_URL` and `SECRET` (and `MAPBOX_TOKEN` if needed).
4. Deploy. Render will run `npm run start` (which runs `node app.js`).

## Notes

- The app binds to port 8080 in `app.js`. Render provides a PORT env var; if needed, change the server startup to use `process.env.PORT || 8080`.
- If you want me to switch the app to honor `process.env.PORT` and add a small health-check route, I can implement that change now.

## CI / CD with GitHub Actions

This repository includes a GitHub Actions workflow at `.github/workflows/ci-cd.yml` that:

- Runs on pull requests and pushes to `main`.
- Installs dependencies and runs `npm test`.
- When a push to `main` succeeds, the workflow will attempt to trigger a Render deploy via the Render API.

To enable automatic deploys from Actions, add the following repository secrets in GitHub:

- `RENDER_API_KEY` — an API key from Render with deploy permissions.
- `RENDER_SERVICE_ID` — the Render service id for your web service.

If those secrets are not set the workflow will still run the install/test steps but skip the deploy step.

If you want I can also:

- Modify `app.js` to read `process.env.PORT` (recommended for Render).
- Add a health-check route and a tiny test that uses an in-memory MongoDB for CI so the build can exercise the server start without external DBs.
