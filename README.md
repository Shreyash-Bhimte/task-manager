# Task Manager — Backend Developer Intern Assignment

A full-stack task management app built with FastAPI + React, demonstrating secure REST API design, JWT authentication, role-based access control, and production deployment.

## Live URLs
- **Frontend:** https://task-manager-eosin-nine.vercel.app
- **Backend API:** https://task-manager-api-dwur.onrender.com
- **Swagger Docs:** https://task-manager-api-dwur.onrender.com/docs

---

## Tech Stack

**Backend**
- Python 3.11, FastAPI, SQLAlchemy ORM, Alembic migrations
- bcrypt (password hashing), python-jose (JWT)
- PostgreSQL via Supabase

**Frontend**
- React 18 + Vite, React Router, CSS Modules, Axios

**Deployment**
- Backend: Render (free tier)
- Frontend: Vercel

---

## Features

### Authentication
- User registration with bcrypt password hashing
- JWT login with 30-minute token expiry
- Protected `/auth/me` endpoint returns current user

### Role-Based Access Control
- Two roles: `user` and `admin`
- Users can only see and manage their own tasks
- Admins can see all tasks and list all users via `/admin/users`

### Tasks CRUD
- Create, read, update, delete tasks
- Task status: `todo`, `in_progress`, `done`
- Owner scoping enforced on all operations

### API Design
- Versioned routes at `/api/v1/`
- Pydantic input validation on all endpoints
- Proper HTTP status codes (201, 400, 401, 403, 404, 204)
- Swagger UI auto-generated at `/docs`

---

## API Routes

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/auth/register` | No | Register new user, returns JWT |
| POST | `/api/v1/auth/login` | No | Login, returns JWT |
| GET | `/api/v1/auth/me` | JWT | Get current user |

### Tasks
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/v1/tasks` | JWT | List tasks (own; admin sees all) |
| POST | `/api/v1/tasks` | JWT | Create task |
| GET | `/api/v1/tasks/{id}` | JWT | Get single task |
| PUT | `/api/v1/tasks/{id}` | JWT | Update task |
| DELETE | `/api/v1/tasks/{id}` | JWT | Delete task |

### Admin
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/v1/admin/users` | JWT + Admin | List all users |

---

## Database Schema

```sql
-- Users
id           UUID PRIMARY KEY
email        VARCHAR UNIQUE NOT NULL
hashed_password VARCHAR NOT NULL
role         ENUM('user', 'admin') DEFAULT 'user'
created_at   TIMESTAMP

-- Tasks
id           UUID PRIMARY KEY
title        VARCHAR NOT NULL
description  TEXT
status       ENUM('todo', 'in_progress', 'done') DEFAULT 'todo'
owner_id     UUID REFERENCES users(id)
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

---

## Project Structure
```
task-manager/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── auth.py       # register, login, me
│   │   │   ├── tasks.py      # CRUD routes
│   │   │   └── admin.py      # admin-only routes
│   │   ├── core/
│   │   │   ├── config.py     # settings from env
│   │   │   ├── security.py   # JWT + bcrypt
│   │   │   └── database.py   # SQLAlchemy engine + session
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   └── main.py           # FastAPI app, router registration
│   ├── alembic/              # database migrations
│   └── requirements.txt
└── frontend/
├── src/
│   ├── components/       # TaskCard, CreateTaskForm
│   ├── pages/            # Login, Register, Dashboard
│   ├── hooks/            # useAuth, useTasks
│   └── lib/              # axios instance with JWT header
└── vite.config.js
```
---

## Local Setup

### Prerequisites
- Python 3.11+
- Node 18+
- PostgreSQL database (Supabase free tier recommended)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
SECRET_KEY=your-long-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run migrations and start:
```bash
alembic upgrade head
uvicorn app.main:app --reload
```

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
VITE_API_URL=http://localhost:8000/api/v1

```bash
npm run dev
```

App: `http://localhost:5173`

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Secret for JWT signing (use a long random string) |
| `ALGORITHM` | JWT algorithm — `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## Security Implementation

- **Passwords** hashed with bcrypt — never stored in plain text
- **JWT** stored in localStorage with 30-minute expiry
  - *Tradeoff:* localStorage is simpler for SPAs but vulnerable to XSS. httpOnly cookies are more secure (JS cannot read them) but require CSRF protection. For production with sensitive data, httpOnly cookies are preferred.
- **CORS** restricted to known frontend origins only
- **Input validation** on both frontend (empty field checks) and backend (Pydantic schemas with type enforcement)
- **Role enforcement** implemented as a reusable FastAPI `Depends()` guard — clean and composable

---

## Scalability Notes

This app is currently a monolith on single instances. Production scaling path:

**Horizontal scaling:** The FastAPI backend is fully stateless — JWT auth requires no server-side sessions, so multiple instances can run behind a load balancer (e.g. AWS ALB or Render auto-scaling) without shared state issues.

**Caching:** Redis can cache frequent reads such as task lists, reducing database load significantly. FastAPI integrates cleanly with `aiocache` or `redis-py` for TTL-based response caching.

**Rate limiting:** A Redis-backed rate limiter (`slowapi`) can be added as FastAPI middleware to protect auth endpoints from brute-force attacks, with per-IP or per-user bucket limits.

**Microservices split:** As the app grows, auth and tasks can be extracted into separate services with independent databases, communicating via REST or a message queue (RabbitMQ/Kafka). An API gateway handles upstream routing and token verification.

**Database:** Connection pooling via PgBouncer (already using Supabase's pooler in production) keeps Postgres connections efficient under load.
