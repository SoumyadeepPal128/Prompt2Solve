
# AI-LeetCode

A full-stack platform that transforms plain-language descriptions into complete, playable, LeetCode-style coding problems. By leveraging Google Gemini for generation and a sandboxed execution engine for verification, this project ensures that AI-generated problems are technically sound and come with verified ground-truth test cases.

## How It Works: The Core Flow

The system operates on a strict principle: **Never trust the LLM's output directly; only trust actual execution results.**

1. **Prompt:** A user submits a plain-language prompt (e.g., "the two sum problem" or a completely custom scenario).
2. **Generation:** Google Gemini generates a structured problem definition (title, description, constraints), a C++ reference solution, and a set of sample inputs using a constrained JSON schema.
3. **Verification:** The generated C++ reference solution is compiled and executed against every generated sample input inside a sandboxed environment (Piston).
4. **Validation:** Only inputs that execute successfully become verified test cases. The expected outputs are captured from the actual sandboxed execution, discarding any hallucinated outputs from the LLM.
5. **Storage:** The verified problem and its embedded test cases are saved to MongoDB.
6. **Solving:** The user opens a split-pane, LeetCode-style workspace, writes their own C++ solution, and submits it.
7. **Judging:** The user's code is compiled and executed against the verified test cases, stopping at the first failing case to return a definitive verdict (Accepted / Wrong Answer).

---

## Tech Stack

* **Backend:** Node.js, Express, MongoDB (Mongoose)
* **AI / LLM:** Google Gemini API (Structured JSON output parsing)
* **Code Execution:** Piston (Open-source sandboxed execution engine, self-hosted via Docker)
* **Frontend:** React (Vite), Tailwind CSS v4, React Router, Axios

---

## Architecture & Engineering Notes

* **Layered Backend Design:** Follows a strict `routes` → `validators` → `controllers` → `models/db` pipeline.
* **Centralized Error Handling:** Utilizes custom `ApiError` and `ApiResponse` classes coupled with a global error-handling middleware. Async route errors are caught using a shared `asyncHandler` wrapper, eliminating repetitive `try/catch` blocks.
* **Database Schema Strategy:**
* *Embedding:* Test cases are embedded directly within the parent `Problem` document, as they have no independent meaning outside their specific problem.
* *Referencing:* User relationships (`createdBy`) utilize `ObjectId` referencing, treating users as distinct, independently-queryable entities.



---

## Local Deployment Guide

To run this project locally, you will need to host the Piston execution engine on your own machine, as the public API lacks a permanent free tier for portfolio projects.

### Prerequisites

* **Node.js** (v18+ recommended)
* **Docker Desktop** (running)
* **MongoDB:** An Atlas account (free tier) or a local MongoDB instance
* **Google Gemini API Key:** Obtainable for free at [aistudio.google.com](https://aistudio.google.com/)

### 1. Setup the Execution Sandbox (Piston)

Piston has no permanent free public tier for projects like this, so it needs to run locally via Docker. By default, the Piston image comes with **no languages installed**, so you must install the C++ runtime manually after starting the container.

**Start the container:**

```bash
mkdir piston-data
cd piston-data
docker run --privileged -v ${PWD}:/piston -dit -p 2000:2000 --name piston_api ghcr.io/engineer-man/piston

```

**Install the C++ runtime:**
Wait a few seconds for the container to start, then run this command to tell Piston's API to download and install the C++ compiler (v10.2.0). *This is a one-time setup that persists in your `piston-data/` directory.*

```bash
curl -X POST http://localhost:2000/api/v2/packages \
-H "Content-Type: application/json" \
-d '{"language": "c++", "version": "10.2.0"}'

```

*(Note: It may take 10-30 seconds to download. It will output a JSON response confirming the installation when finished).*

**Confirm it's installed and running:**
Verify that the API is responding and that `c++` is now listed among the available runtimes:

```bash
curl http://localhost:2000/api/v2/runtimes

```

*You should see a JSON array output that includes `{"language": "c++", "version": "10.2.0", "aliases": ["cpp", "cplusplus", ...]}*

**Note on Docker Restarts:**
If you restart your machine, Docker containers don't automatically resume. Before running the backend, check if it's running:

```bash
docker ps

```

If `piston_api` isn't listed, simply start it again with: `docker start piston_api`. You do **not** need to reinstall the language packages.

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
cp .env.example .env

```

Configure your `.env` file:

```env
PORT=4000
MONGO_URI=your-mongodb-connection-string
DB_NAME=ai-leetcode
GEMINI_API_KEY=your-gemini-api-key
PISTON_API_URL=http://localhost:2000/api/v2

```

Start the backend development server:

```bash
npm run dev

```

*(You should see `MongoDB connected` and `Server running on http://localhost:4000` in the console.)*

### 3. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and start the Vite server:

```bash
cd frontend
npm install
npm run dev

```

Navigate to the provided local URL (typically `http://localhost:5173`) in your browser.

---

## Usage Guide

1. **Generate a Problem:** On the home page, enter a description of a coding problem (e.g., "Given an array of integers, return the indices of the two numbers that add up to a specific target").
2. **Wait for Verification:** Generation takes roughly 5–20 seconds. This includes the LLM network call plus multiple sandboxed compile/run checks for every sample input.
3. **Browse & Solve:** View previously generated challenges under the "Problems" tab. Click one to open the split-pane solve view.
4. **Submit Code:** Write your C++ solution in the browser editor and hit submit. The "Result" tab will display your compilation status, an "Accepted" verdict, or the expected vs. actual output for the first failing test case.

---

## Known Limitations & Roadmap

This project is in active development. Several features were intentionally scoped out for the initial release and are slated for future updates:

* **Language Support:** Currently hardcoded to C++ (generation and execution). A language selector will be added in the future.
* **Execution Model:** Relies on a standard `stdin/stdout` I/O model rather than LeetCode's function-parameter style (e.g., `vector<int> twoSum(vector<int>& nums, int target)`).
* **Multiple-Valid-Answer Evaluation:** The judging system currently uses exact-string-match verdicts. While this works perfectly for deterministic yes/no or single-answer problems, problems with multiple valid outputs (like two-sum, where index order might vary) can misjudge a correct solution. *Planned fix: Generate a custom "checker function" for each problem to validate logic rather than exact strings.*
* **Authentication:** The schema includes an optional `createdBy` field, but user authentication is not yet wired in. Currently, anyone running the app locally has full access.
* **Regeneration Flow:** No UI exists yet to re-prompt or tweak a generated problem if the LLM misunderstands the initial request.
* **Deployment:** Because Piston runs via a local Docker container, the platform cannot be easily deployed to standard serverless edge functions. It requires provisioning a small VM to host the execution sandbox.
