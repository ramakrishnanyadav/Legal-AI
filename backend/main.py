from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analyze
from app.core.config import settings
import os

app = FastAPI(
    title="LegalAI API",
    description="AI-powered legal case analysis for Indian criminal law",
    version="1.0.0"
)

# CORS - Updated for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://legal-ai-chi-liart.vercel.app", 
        "https://legal-ai-fbtp.vercel.app", # ← Your Vercel frontend
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])

@app.get("/")
def root():
    return {
        "service": "LegalAI API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
