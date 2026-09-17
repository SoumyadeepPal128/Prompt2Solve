# Prompt2Solve

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://prompt2solve.vercel.app)
[![Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/SoumyadeepPal128/Prompt2Solve)

**Prompt2Solve** is a full-stack platform that transforms plain-language descriptions into complete, playable, LeetCode-style coding problems. By leveraging Google Gemini for generation and a sandboxed execution engine for verification, this project ensures that AI-generated problems are technically sound and come with verified ground-truth test cases.

**Live Deployment:** [https://prompt2solve.vercel.app](https://prompt2solve.vercel.app)

---

## 🎯 The Problem It Solves

If you want to practice a specific algorithmic concept, prepare for a niche interview scenario, or explore a variation of a classic coding challenge, you are generally limited to static problem banks like LeetCode or GeeksforGeeks. If a problem doesn't exist in their database, you can't practice it in a real coding environment.

While Large Language Models (LLMs) can generate code and write problem statements, they suffer from a critical flaw: **Logic hallucinations.** If you ask an LLM to generate a coding test or custom problem, it frequently hallucinates test cases, contradicts its own constraints, or approves incorrect solutions because it relies on probabilistic text generation rather than actual code execution.

**Prompt2Solve bridges this gap by grounding AI generation in actual execution.** It solves the "hallucinated test case" problem by never trusting the LLM's output directly. Instead, it takes the AI-generated problem, extracts the reference solution, and compiles/runs it in a secure sandbox against the generated inputs. Only the *actual outputs of that execution* are saved as the definitive test cases. This gives you an on-demand, infinitely expanding LeetCode environment where every generated problem is guaranteed to have logically sound, verified test cases.

---

## ✨ How It Works: The Core Flow

1. **Prompt:** A user submits a plain-language prompt (e.g., "the two sum problem" or a custom scenario).
2. **Generation:** Google Gemini generates a structured problem definition (title, description, constraints), a C++ reference solution, and a set of sample inputs using a constrained JSON schema.
3. **Verification:** The generated C++ reference solution is compiled and executed against every generated sample input inside a sandboxed environment (Piston).
4. **Validation:** Only inputs that execute successfully become verified test cases. The expected outputs are captured directly from the sandboxed execution, discarding any hallucinated outputs from the LLM.
5. **Storage:** The verified problem and its embedded test cases are saved to MongoDB.
6. **Solving:** The user opens a split-pane workspace, writes their own C++ solution, and submits it.
7. **Judging:** The user's code is compiled and executed against the verified test cases, stopping at the first failing case to return a definitive verdict (Accepted / Wrong Answer).

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js, MongoDB (Mongoose)
* **AI / LLM:** Google Gemini API (Structured JSON output parsing)
* **Code Execution:** Piston (Open-source sandboxed execution engine, self-hosted via Docker)
* **Frontend:** React (Vite), Tailwind CSS v4, React Router, Axios
* **Authentication:** JWT (httpOnly cookies)

---

## 🧠 Architecture & Engineering Notes

* **Layered Backend Design:** Follows a strict `routes` → `validators` (express-validator) → `controllers` → `models/db` pipeline to maintain separation of concerns.
* **Centralized Error Handling:** Utilizes custom `ApiError` and `ApiResponse` classes coupled with a global error-handling middleware. Async route errors are cleanly caught using a shared `asyncHandler` wrapper.
* **Database Schema Strategy:**
  * *Embedding:* Test cases are embedded directly within the parent `Problem` document, as they have no independent meaning outside their specific problem.
  * *Referencing:* User relationships (`createdBy`) utilize `ObjectId` referencing, treating users as distinct, independently-queryable entities.
* **Frictionless Authentication:** A dedicated `optionalAuth` middleware safely attaches `req.user` if a valid session exists without blocking guest requests. Login is completely optional; authenticated users simply have their generated problems attributed to their accounts.
* **Architecture Trade-off:** To avoid the high costs of cloud-hosting a sandboxed code execution engine, the frontend is highly available on Vercel, while the backend and Piston sandbox run on a local machine exposed via an `ngrok` tunnel. *(Note: If generation or submissions fail on the live site, the local tunneling server is likely offline).*

---

## 🚀 Local Deployment Guide

To run this project locally, you must host the Piston execution engine on your own machine.

### Prerequisites
* **Node.js** (v18+ recommended)
* **Docker Desktop** (or native Docker Engine)
* **MongoDB:** An Atlas account (free tier) or a local MongoDB instance
* **Google Gemini API Key:** Obtainable for free at [aistudio.google.com](https://aistudio.google.com/)

### 1. Setup the Execution Sandbox (Piston)

By default, the Piston Docker image comes with **no languages installed**. You must start the container and manually install the C++ runtime.

**Start the container:**
```bash
mkdir piston-data
cd piston-data
docker run --privileged -v ${PWD}:/piston -dit -p 2000:2000 --name piston_api ghcr.io/engineer-man/piston
```

**Install the C++ runtime (One-time setup):**
Wait a few seconds for the container to start, then run this command:
```bash
curl -X POST http://localhost:2000/api/v2/packages \
-H "Content-Type: application/json" \
-d '{"language": "gcc", "version": "10.2.0"}'
```
*(This may take 10-30 seconds to download. It will output a JSON response confirming the installation).*

> **⚠️ Windows WSL2 / Docker Desktop Warning:** 
> If you are running Docker Desktop on Windows with the WSL2 backend, you may encounter an issue where Piston hangs on every execution. This occurs because cgroup v2 delegation requires `systemd`, which Docker Desktop's internal WSL distro lacks. If every submission times out, the reliable fix is installing Docker Engine directly inside a standard Ubuntu WSL2 distribution (with `systemd` enabled) rather than using Docker Desktop.

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Configure your `.env` file:
```env
PORT=4000
MONGO_URI=your-mongodb-connection-string
DB_NAME=prompt2solve
GEMINI_API_KEY=your-gemini-api-key
PISTON_API_URL=http://localhost:2000/api/v2
ACCESS_TOKEN_SECRET=generate-a-long-random-string
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=generate-a-different-long-random-string
REFRESH_TOKEN_EXPIRY=10d
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup

By default, the frontend points to the deployed ngrok tunnel. To run fully locally, update `API_BASE_URL` in `src/api/client.js` to `http://localhost:4000/api`.

```bash
cd frontend
npm install
npm run dev
```

---

## 🚧 Known Limitations & Roadmap

* **Language Support:** Currently hardcoded to C++ for generation and execution.
* **Exact Match Judging:** Verdicts require an exact `stdout` string match. Deterministic problems work perfectly, but problems with multiple equally valid outputs (e.g., returning any valid index pair for Two Sum) may incorrectly reject mathematically valid solutions. *Planned fix: Implement custom checker functions (Special Judge) per problem.*
* **Code Editor:** The solve page currently uses a plain `textarea`. *Planned fix: Integrate Monaco Editor for syntax highlighting and a true IDE feel.*
* **Execution Model:** Relies on standard `stdin/stdout` I/O rather than LeetCode's class-method signature style. 
* **Regeneration Flow:** No UI exists yet to iteratively tweak or re-prompt a generated problem if the LLM's first attempt misses the mark.
