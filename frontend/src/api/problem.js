import { request } from "./client.js";

export async function generateProblem(prompt) {
  return request({
    url: "/generate",
    method: "POST",
    data: { prompt },
  });
}

export async function getAllProblems() {
  return request({ url: "/problems", method: "GET" });
}

export async function getProblemById(problemId) {
  return request({ url: `/problems/${problemId}`, method: "GET" });
}