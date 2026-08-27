# Online Judge — Code Changes & Deployment Guide

This document describes:

1. **What was changed** in the codebase and **why**.
2. **How to deploy** the project (locally, with Docker, and in production).
3. **How to use Docker** correctly.

> All commands below assume you are in the project folder that **directly contains
> the `BACKEND/` and `frontend/` folders** (the inner `OnlineJudge-main` folder).

---

## 🚀 Quick Start (the whole thing in 3 steps)

You only need **Docker Desktop** and a **MongoDB Atlas** connection string.

```powershell
# 1. Create your config file (Windows)
.\setup.ps1
#    ...or on macOS/Linux:  sh setup.sh
#    ...or manually:        Copy-Item .env.example .env

# 2. Open .env and paste your Atlas string into MONGODB_URL (that is the ONLY required field)

# 3. Build & run everything
docker compose up --build
```

Then open **<http://localhost:3000>**. That's it — backend, frontend, and all three
language runtimes (C++/Python/Java) come up together.

- The only value you must fill in is `MONGODB_URL`.
- `JWT_SECRET`, the API URL, and CORS all have working defaults (change `JWT_SECRET`
  before going public).
- Stop with `Ctrl+C`, then `docker compose down`.

Everything below is reference detail (what changed, running without Docker, and production).

---

## Part 1 — Code Changes

### 🔴 Critical fixes

| # | File | Problem | Fix |
|---|------|---------|-----|
| 1 | `BACKEND/controllers/Solution.js` | Submissions were **never saved** to the database, so submission history and the "solved / not solved" status never worked. | Added `Solution.create(...)` after grading so every submission is persisted. |
| 2 | `BACKEND/controllers/Solution.js` | After every submission the code deleted **all** files in `outputs/`, so two submissions running at the same time deleted each other's artifacts (flaky verdicts). | Cleanup now removes **only the current submission's** source/binary, guarded by existence checks, and runs in a `finally` block so nothing leaks on errors. |
| 3 | `BACKEND/services/generateFile.js` + `Solution.js` | Every Java submission was written to the same `codes/java/Main.java`, and input files were named from the class name, so **concurrent Java submissions collided**. | Each Java submission now gets its own directory `codes/java/<uuid>/Main.java`, and input files are named with a unique `jobId`. |

### 🟠 Correctness / security fixes

| # | File | Problem | Fix |
|---|------|---------|-----|
| 4 | `BACKEND/routes/Problem.js` | `PUT /updateProblem/:id` was registered **twice** — the second copy had **no auth**, allowing anyone to edit problems. | Removed the duplicate, unprotected route. The remaining route keeps `auth, isAdmin`. |
| 5 | `BACKEND/middlewares/Auth.js` | `isAdmin` / `isUser` sent a 500 in their `catch` block but then still called `next()`, causing "headers already sent" errors. `auth` also crashed when the `Authorization` header was absent, and logged the JWT secret + tokens to the console. | Added `return` in the catch blocks, guarded the missing-header case, and removed the secret/token logging. |
| 6 | `BACKEND/scripts/executeCpp.js`, `executeJava.js`, `executePython.js` | Any output to **stderr** (e.g. harmless warnings) was treated as a failure, marking correct solutions as "Incorrect Code". | Now only a real non-zero exit / timeout (`error`) fails a run; stderr alone no longer fails it. |
| 7 | `BACKEND/models/Solution.js` | `default: Date.now()` was evaluated once at startup, so every submission got the **server start time**. | Changed to `default: Date.now` (function reference) so each document gets its own timestamp. |
| 8 | `BACKEND/index.js` | A dangling `app.get` statement did nothing; CORS was hard-open with no way to restrict it. | Removed the dead line, added a `GET /` health-check route, and made CORS configurable via the `CORS_ORIGIN` env var (still open by default). |

### 🟡 Frontend fixes

| # | File | Problem | Fix |
|---|------|---------|-----|
| 9 | `frontend/src/components/api.jsx` | Backend URL was hard-coded to `http://localhost:4000`, and `withcredentials` was misspelled (silently ignored). | URL now comes from `REACT_APP_API_URL` (falls back to localhost). Removed the broken credentials option (auth uses the `Authorization` header, so it isn't needed). |
| 10 | `frontend/src/components/UserDashboard.jsx` | Imported `css` from `@emotion/react`, which is **not a declared dependency** (only present transitively) and was unused. | Removed the unused import to avoid a fragile/broken build. |

### 🐳 Docker & configuration

| # | File | Change |
|---|------|--------|
| 11 | `BACKEND/Dockerfile` | Rebuilt: Node 20 LTS, `build-base`/`python3`/`openjdk17` toolchain with `JAVA_HOME` set, `npm ci` (reproducible install from the lockfile), runs as a **non-root** `judge` user, and starts with `npm start` (production) instead of `nodemon`. |
| 12 | `BACKEND/.dockerignore` | Now excludes **`.env`** (previously the secrets were baked into the image), plus git/docker files and runtime dirs. Keeps `package-lock.json` so `npm ci` works. |
| 13 | `BACKEND/.env.example` | **New** — template for the required env vars (no real secrets). |
| 14 | `frontend/Dockerfile`, `frontend/nginx.conf`, `frontend/.dockerignore` | **New** — multi-stage build (Node build → nginx serve) with a SPA fallback so React Router routes survive a page refresh. |
| 15 | `frontend/.env.example` | **New** — template for `REACT_APP_API_URL`. |
| 16 | `docker-compose.yml` (project root) | **New** — brings up backend + frontend with one command. |
| 17 | `.gitignore` | Added the runtime-generated `codes/`, `outputs/`, `testcases/` and `frontend/build/` directories. |

### ⚠️ Known remaining limitations (not changed)

- **Code is executed inside the API container**, not in a per-submission sandbox. This is fine for a demo but is **not secure** for untrusted public users — a malicious submission runs with the container's privileges/network. Proper isolation means running each submission in a throwaway container with `--network none`, memory/CPU/PID limits, and a hard timeout. Ask if you want this designed.
- Several **legacy components are unused / point at non-existent endpoints**: `Dashboard.jsx`, `AddProblem.jsx`, `ProblemDetails.jsx`, `CodeSubmissionBox.js`, `LogoutButton.jsx`. They are not part of the active flow (the real screens are `UserDashboard`, `AdminDashboard`, `CreateProblem`, `EditProblem`, `SolveProblem`). Consider deleting them.
- `UserDashboard` links each problem name to `/problems/:id`, a route that isn't defined in `App.js` (the working action is the green **Solve Problem** button). Left as-is.
- Java submissions must declare `public class Main` (the runner compiles/executes a class named `Main`).

---

## Part 2 — Prerequisites

- **MongoDB** database — a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works. Get its connection string.
- Either:
  - **Docker Desktop** (recommended, includes `docker compose`), **or**
  - **Node.js 18+** with C++ (`g++`), **Python 3**, and a **JDK** installed locally (only needed if you run without Docker, since the backend compiles/executes submissions).

---

## Part 3 — 🔑 Rotate the exposed secrets (do this first)

The original `BACKEND/.env` committed **real, live credentials** (a MongoDB Atlas username/password and the JWT secret). Treat them as compromised:

1. In **MongoDB Atlas → Database Access**, change the database user's password (or create a new user and delete the old one).
2. Choose a new, long, random `JWT_SECRET`.
3. Put the new values only in your local `BACKEND/.env` (which is git-ignored and Docker-ignored) — never commit them.

---

## Part 4 — Configure environment variables

There are two ways to run the project, each with its own config file:

### If you use Docker / docker compose (recommended) → one file

Use the **single root `.env`** file. It is the only config you need to touch.

```powershell
Copy-Item .env.example .env      # or run .\setup.ps1
```

Then edit `.env` and set just `MONGODB_URL`:

```
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/OJdatabase
JWT_SECRET=dev-secret-change-me-in-production   # change before going public
REACT_APP_API_URL=http://localhost:4000         # leave as-is for local
CORS_ORIGIN=                                     # empty = allow all origins
```

`docker compose` reads this file automatically and passes the values to both containers.
**Do not wrap the Atlas string in quotes** here, and URL-encode any special characters in the password.

### If you run with `npm` directly (no Docker) → per-folder files

```powershell
Copy-Item BACKEND/.env.example BACKEND/.env       # set MONGODB_URL + JWT_SECRET
Copy-Item frontend/.env.example frontend/.env     # only if backend isn't on localhost:4000
```

---

## Part 5 — Run locally **without** Docker

**Backend:**
```powershell
cd BACKEND
npm install
npm run dev        # nodemon with auto-reload  (or: npm start)
```
You should see `DB Connected Successfully` and `App is listening at the PORT 4000`.

**Frontend (in a second terminal):**
```powershell
cd frontend
npm install
npm start          # opens http://localhost:3000
```

---

## Part 6 — Run with Docker

### Option A — Full stack with docker-compose (recommended)

Make sure the root `.env` exists (see Part 4), then, from the folder containing `docker-compose.yml`:

```powershell
docker compose up --build
```

- Frontend → <http://localhost:3000>
- Backend  → <http://localhost:4000>

Stop with `Ctrl+C`, then `docker compose down`.

> Compose reads every value (including `MONGODB_URL`, `JWT_SECRET`, and
> `REACT_APP_API_URL`) from the root `.env`. If you deploy the backend to a public
> URL, set `REACT_APP_API_URL` in `.env` and rebuild (`docker compose up --build`)
> so the frontend bundle points at it.

### Option B — Backend container only

```powershell
cd BACKEND
docker build -t online-judge-backend .
docker run --rm -p 4000:4000 --env-file .env online-judge-backend
```

Key points about **using Docker correctly** here:

- `--env-file .env` injects secrets **at runtime** — they are no longer baked into the image (`.env` is in `.dockerignore`).
- `-p 4000:4000` maps the container port to your host.
- The container runs as the non-root `judge` user.
- The image contains `g++`, `python3`, and a JDK so all three languages compile/run.

Verify it's up:
```powershell
curl http://localhost:4000/            # -> {"success":true,"message":"Online Judge API is running"}
```

---

## Part 7 — Production deployment

### Backend (any Docker host, e.g. AWS EC2)

1. Install Docker on the server.
2. Copy the project (or just the `BACKEND/` folder) to the server.
3. Create `BACKEND/.env` on the server with production values (never commit it).
4. Build and run:
   ```bash
   docker build -t online-judge-backend ./BACKEND
   docker run -d --name oj-backend -p 4000:4000 \
     --env-file ./BACKEND/.env \
     --restart unless-stopped \
     online-judge-backend
   ```
5. Open port 4000 in the firewall / security group (or, better, put the container behind an Nginx/HTTPS reverse proxy).
6. Set `CORS_ORIGIN` in `.env` to your frontend's domain.
7. In **MongoDB Atlas → Network Access**, allow the server's IP.

### Frontend (Vercel — as in the README)

1. Import the `frontend/` folder as a Vercel project.
2. Set the environment variable `REACT_APP_API_URL` to your **public backend URL** (e.g. `https://api.your-domain.com`).
3. Deploy (build command `npm run build`, output `build/`).

> Alternatively, host the frontend with the provided `frontend/Dockerfile`:
> ```bash
> docker build --build-arg REACT_APP_API_URL=https://api.your-domain.com -t oj-frontend ./frontend
> docker run -d -p 80:80 oj-frontend
> ```

---

## Part 8 — Smoke test after deployment

1. Open the frontend, **Sign up** (choose `Admin` or `User`).
2. **Log in** — an Admin lands on the Admin Dashboard, a User on the User Dashboard.
3. As **Admin**: create a problem with at least one test case.
4. As **User**: open the problem, submit a solution, and confirm the verdict
   (`Accepted` / `Wrong Answer: Failed on test case N` / `Incorrect Code`).
5. Confirm the submission is stored (a `solutions` document now exists in MongoDB).

**Sample AC solutions** for a problem whose test case is input `2 3` → output `5`:

- C++ (`cpp`):
  ```cpp
  #include <iostream>
  int main(){ int a,b; std::cin>>a>>b; std::cout<<a+b; }
  ```
- Python (`python`):
  ```python
  a,b=map(int,input().split()); print(a+b)
  ```
- Java (`java`) — class **must** be `Main`:
  ```java
  import java.util.*;
  public class Main { public static void main(String[] a){ Scanner s=new Scanner(System.in); System.out.print(s.nextInt()+s.nextInt()); } }
  ```

---

## Part 9 — Troubleshooting

| Symptom | Likely cause / fix |
|---------|--------------------|
| `DB Connection Failed` on startup | Wrong `MONGODB_URL`, or the server IP isn't allow-listed in Atlas Network Access. |
| Frontend loads but every API call fails (CORS/network) | `REACT_APP_API_URL` points at the wrong backend, or `CORS_ORIGIN` on the backend doesn't include the frontend origin. Remember CRA bakes the URL at **build** time — rebuild after changing it. |
| All submissions return "Incorrect Code" | The language toolchain is missing (running without Docker) — install `g++` / `python3` / JDK, or use the Docker image which includes them. |
| Java submission fails to compile | The submitted code's public class isn't named `Main`. |
| `npm ci` fails during Docker build | `package-lock.json` is out of sync — run `npm install` locally to refresh it, then rebuild. |
| Docker build fails to compile C++ at runtime | Ensure you're using the updated Dockerfile (it installs `build-base`, which includes the C/C++ headers). |
