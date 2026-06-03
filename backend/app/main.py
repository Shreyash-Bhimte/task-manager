from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, tasks, admin
from app.core.config import settings

app = FastAPI(
    title="Task Manager API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

origins = [
    "http://localhost:5173",
    "https://task-manager-eosin-nine.vercel.app",
    "https://task-manager-98awhmdg2-shreyash-bhimtes-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Task Manager API is running"}