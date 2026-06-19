const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const token = localStorage.getItem("trello_lite_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem("trello_lite_token");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  boards: () => request("/boards"),
  board: (id) => request(`/boards/${id}`),
  createBoard: (body) => request("/boards", { method: "POST", body: JSON.stringify(body) }),
  updateBoard: (id, body) => request(`/boards/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteBoard: (id) => request(`/boards/${id}`, { method: "DELETE" }),
  createList: (boardId, body) =>
    request(`/boards/${boardId}/lists`, { method: "POST", body: JSON.stringify(body) }),
  updateList: (id, body) => request(`/lists/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteList: (id) => request(`/lists/${id}`, { method: "DELETE" }),
  createTask: (listId, body) =>
    request(`/lists/${listId}/tasks`, { method: "POST", body: JSON.stringify(body) }),
  updateTask: (id, body) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
  moveTask: (id, body) =>
    request(`/tasks/${id}/move`, { method: "PATCH", body: JSON.stringify(body) })
};
