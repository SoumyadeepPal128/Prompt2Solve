import { request } from "./client.js";

export async function registerUser(email, username, password) {
  return request({
    url: "/auth/register",
    method: "POST",
    data: { email, username, password },
  });
}

export async function loginUser(email, password) {
  return request({
    url: "/auth/login",
    method: "POST",
    data: { email, password },
  });
}

export async function logoutUser() {
  return request({ url: "/auth/logout", method: "POST" });
}

export async function getCurrentUser() {
  return request({ url: "/auth/me", method: "GET" });
}