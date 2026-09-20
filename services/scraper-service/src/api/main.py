import os
import logging
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.schemas.tournament import TournamentData, ScrapeJobRequest
from src.tasks.celery_app import scrape_collegiate_club
from src.ai.extractor import TournamentExtractor

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("scraper_service")

app = FastAPI(
    title="Badminton Tournament Ingestion & AI Scraper Service",
    description="Asynchronous ingestion pipeline leveraging Celery, Redis, Instaloader, and GPT-4o Vision.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DMV_COLLEGIATE_HANDLES = [
    "vcubadmintonclub",
    "umdclubbadminton",
    "towsonubc",
    "umbc.badminton",
    "jhuttc",
]


@app.get("/health")
def health_check() -> Dict[str, str]:
    return {"status": "healthy", "service": "scraper-service"}


@app.post("/api/v1/trigger-scrape")
def trigger_scrape(job: ScrapeJobRequest) -> Dict[str, Any]:
    """
    Pushes an asynchronous scraping job to Celery queue backed by Redis.
    """
    logger.info(f"Enqueuing scrape job for handle: @{job.target_handle}")
    task = scrape_collegiate_club.delay(job.target_handle)
    return {
        "status": "QUEUED",
        "task_id": str(task.id),
        "target_handle": job.target_handle,
    }


@app.post("/api/v1/sync-dmv-circuit")
def sync_dmv_circuit() -> Dict[str, Any]:
    """
    Triggers scraping cycle across all target DMV collegiate badminton clubs.
    """
    enqueued_tasks = []
    for handle in DMV_COLLEGIATE_HANDLES:
        task = scrape_collegiate_club.delay(handle)
        enqueued_tasks.append({"handle": handle, "task_id": str(task.id)})

    return {
        "status": "BATCH_ENQUEUED",
        "total_clubs": len(enqueued_tasks),
        "tasks": enqueued_tasks,
    }


@app.post("/api/v1/extract-direct", response_model=TournamentData)
def extract_direct(payload: Dict[str, str]) -> TournamentData:
    """
    Synchronous preview endpoint to test GPT-4o Vision extraction on an image and caption.
    """
    image_url = payload.get("image_url", "")
    caption = payload.get("caption", "")
    handle = payload.get("handle", "test_club")

    if not image_url or not caption:
        raise HTTPException(
            status_code=400, detail="Both 'image_url' and 'caption' are required."
        )

    extractor = TournamentExtractor()
    return extractor.extract_from_flyer(image_url, caption, handle)
