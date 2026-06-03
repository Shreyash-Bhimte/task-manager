# Task Manager

A full-stack task management app built with FastAPI + React.

## Live URLs
- **Frontend:** https://task-manager-eosin-nine.vercel.app
- **Backend API:** https://task-manager-api-dwur.onrender.com
- **Swagger Docs:** https://task-manager-api-dwur.onrender.com/docs

## Tech Stack
- **Backend:** Python 3.11, FastAPI, SQLAlchemy ORM, Alembic, bcrypt, python-jose
- **Database:** PostgreSQL via Supabase
- **Frontend:** React 18 + Vite, React Router, CSS Modules, Axios
- **Deployment:** Render (backend), Vercel (frontend)

## Features
- JWT authentication (register, login, protected routes)
- Role-based access control (user / admin)
- Full task CRUD — create, read, update, delete
- Owner scoping — users see only their own tasks
- Admin endpoint to list all users
- API versioning at `/api/v1/`
- Swagger docs at `/docs`

## Local Setup

### Prerequisites
- Python 3.11+
- Node 18+
- A Supabase project with PostgreSQL

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
Run migrations and start server:
```bash
alembic upgrade head
uvicorn app.main:app --reload
```

API available at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
VITE_API_URL=http://localhost:8000/api/v1

Start dev server:
```bash
npm run dev
```

App available at `http://localhost:5173`

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Secret for JWT signing |
| `ALGORITHM` | JWT algorithm (HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

## API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/auth/register` | Register new user, returns JWT |
| POST | `/api/v1/auth/login` | Login, returns JWT |
| GET | `/api/v1/auth/me` | Get current user (protected) |

### Tasks (protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/tasks` | List tasks (own tasks; admin sees all) |
| POST | `/api/v1/tasks` | Create task |
| GET | `/api/v1/tasks/{id}` | Get single task |
| PUT | `/api/v1/tasks/{id}` | Update task |
| DELETE | `/api/v1/tasks/{id}` | Delete task |

### Admin
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/admin/users` | List all users (admin only) |

## Security Notes
- Passwords hashed with bcrypt (never stored plain)
- JWT stored in localStorage with 30-minute expiry
- **localStorage vs httpOnly cookie tradeoff:** localStorage is simpler to implement
  and works well for SPAs, but is vulnerable to XSS attacks. httpOnly cookies are
  more secure against XSS since JavaScript cannot read them, but require careful
  CSRF protection. For a production app with sensitive data, httpOnly cookies
  are preferred.
- CORS restricted to known frontend origins
- Input validation on both frontend (empty checks) and backend (Pydantic schemas)

## Scalability Notes

This app is currently a monolith deployed on single instances. To scale:

**Horizontal scaling:** The FastAPI backend is stateless — JWT auth means no
server-side sessions. Multiple instances can run behind a load balancer
(e.g. Render auto-scaling or AWS ALB) without shared state issues.

**Caching:** Redis can cache frequent reads like task lists, reducing database
load. FastAPI integrates cleanly with `redis-py` or `aiocache` for response
caching with TTL-based invalidation.

**Rate limiting:** A Redis-backed rate limiter (e.g. `slowapi`) can be added as
FastAPI middleware to prevent abuse on auth endpoints, with per-IP or per-user
limits.

**Microservices split:** As the app grows, auth and tasks can be split into
separate services with their own databases, communicating via REST or a message
queue like RabbitMQ. An API gateway handles routing and auth verification
upstream.