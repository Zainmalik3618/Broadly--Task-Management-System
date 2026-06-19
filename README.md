# Boardly — Trello Lite

A beginner-friendly PERN task management MVP with private boards, lists, task details, priorities, due dates, and persisted drag-and-drop ordering.

## Stack

- PostgreSQL 16
- Express 5 and Node.js
- React 19 with Vite
- Tailwind CSS
- JWT and bcrypt
- `@hello-pangea/dnd`

## Project structure

```text
backend/
  src/
    config/       Environment and PostgreSQL connection
    controllers/  HTTP request handlers
    db/           SQL schema and initializer
    middleware/   Authentication and error handling
    models/       Parameterized database queries
    routes/       REST endpoints
frontend/
  src/
    components/   Reusable UI
    context/      Authentication state
    hooks/        Reusable React hooks
    pages/        Route-level screens
    services/     API client
```

## Local setup

Prerequisites: Node.js 20+, npm, and PostgreSQL 14+ (or Docker).

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Start PostgreSQL. With Docker:

   ```bash
   docker compose up -d
   ```

3. Create environment files:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   On Windows PowerShell, use `Copy-Item` instead of `cp` if needed. Change `JWT_SECRET` before deploying.

   The default database name is `task_management_system`. If your PostgreSQL
   username, password, host, or port differs, update `DATABASE_URL` in
   `backend/.env`.

4. Initialize the tables:

   ```bash
   npm run db:init
   ```

5. Run each app in a separate terminal:

   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

Open `http://localhost:5173`.

## API

All board, list, and task routes require `Authorization: Bearer <token>`.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/boards` | List/create boards |
| GET/PUT/DELETE | `/api/boards/:id` | Read/update/delete board |
| POST | `/api/boards/:boardId/lists` | Create list |
| PUT/DELETE | `/api/lists/:id` | Update/delete list |
| POST | `/api/lists/:listId/tasks` | Create task |
| PUT/DELETE | `/api/tasks/:id` | Update/delete task |
| PATCH | `/api/tasks/:id/move` | Move/reorder task |

The move endpoint accepts:

```json
{
  "listId": 3,
  "position": 1
}
```

It runs in a transaction, compacts the source list, opens a position in the destination list, moves the task, and returns the refreshed board.

## Production notes

- Serve both apps over HTTPS and use a strong `JWT_SECRET`.
- Restrict `CLIENT_URL` to the deployed frontend.
- Run the schema through a migration tool before evolving it in production.
- JWT is stored in local storage for MVP simplicity. For a higher-security deployment, use short-lived access tokens and secure HTTP-only refresh cookies.
