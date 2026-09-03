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

*   **Backend:** Node.js, Express, MongoDB (Mongoose)
*   **AI / LLM:** Google Gemini API (Structured JSON output parsing)
*   **Code Execution:** Piston (Open-source sandboxed execution engine, self-hosted via Docker)
*   **Frontend:** React (Vite), Tailwind CSS v4, React Router, Axios

---

## Architecture & Engineering Notes

*   **Layered Backend Design:** Follows a strict `routes` → `validators` → `controllers` → `models/db` pipeline.
*   **Centralized Error Handling:** Utilizes custom `ApiError` and `ApiResponse` classes coupled with a global error-handling middleware. Async route errors are caught using a shared `asyncHandler` wrapper, eliminating repetitive `try/catch` blocks.
*   **Database Schema Strategy:**
    *   *Embedding:* Test cases are embedded directly within the parent `Problem` document, as they have no independent meaning outside their specific problem.
    *   *Referencing:* User relationships (`createdBy`) utilize `ObjectId` referencing, treating users as distinct, independently-queryable entities.

---

## Local Deployment Guide

To run this project locally, you will need to host the Piston execution engine on your own machine, as the public API lacks a permanent free tier for portfolio projects.

### Prerequisites

*   **Node.js** (v18+ recommended)
*   **Docker Desktop** (running)
*   **MongoDB:** An Atlas account (free tier) or a local MongoDB instance
*   **Google Gemini API Key:** Obtainable for free at [aistudio.google.com](https://aistudio.google.com/)

### 1. Setup the Execution Sandbox (Piston)

Piston has no permanent free public tier for projects like this, so it needs to run locally via Docker. By default, the Piston image comes with **no languages installed**, so you must install the C++ runtime manually after starting the container.

**Start the container:**
```bash
mkdir piston-data
cd piston-data
docker run --privileged -v ${PWD}:/piston -dit -p 2000:2000 --name piston_api ghcr.io/engineer-man/piston
