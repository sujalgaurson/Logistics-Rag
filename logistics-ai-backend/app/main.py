from fastapi import FastAPI
from app.api import upload, ask, extract
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Logistics AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(ask.router)
app.include_router(extract.router)
