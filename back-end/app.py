import json
import logging
import os
from pathlib import Path
from typing import Any, Generic, List, Optional, Type, TypeVar

import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from pydantic_settings import BaseSettings
from starlette.concurrency import run_in_threadpool

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class Settings(BaseSettings):
    app_name: str = "Res API"
    app_version: str = "0.1.0"
    data_dir: Path = Path("data")
    cache_ttl: int = 300
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost"]
    server_host: str = "0.0.0.0"
    server_port: int = 8000

    model_config = ConfigDict(env_file=".env")


settings = Settings()


class Feedback(BaseModel):
    id: int = Field(..., gt=0)
    user_name: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class Meal(BaseModel):
    id: int = Field(..., gt=0)
    name: str = Field(..., min_length=1)
    rating: float = Field(..., ge=0, le=5)
    price: Optional[str] = None
    orgprice: Optional[str] = None
    img: Optional[str] = None
    isFeatured: Optional[bool] = None
    isPopular: Optional[bool] = None
    isLatest: Optional[bool] = None


class HealthResponse(BaseModel):
    status: str = "healthy"


class Cache(Generic[T]):
    def __init__(self, ttl: int = settings.cache_ttl):
        self._data: dict[str, tuple[List[T], float]] = {}
        self.ttl = ttl

    def get(self, key: str) -> Optional[List[T]]:
        if key not in self._data:
            return None
        data, ts = self._data[key]
        if (os.times()[4] - ts) < self.ttl:
            return data
        return None

    def set(self, key: str, data: List[T]) -> None:
        self._data[key] = (data, os.times()[4])

    def clear(self):
        self._data.clear()


class DataLoader:
    def __init__(self, path: Path):
        self.path = Path(path)
        self.path.mkdir(parents=True, exist_ok=True)

    async def load(self, filename: str) -> List[dict]:
        return await run_in_threadpool(self._read, filename)

    def _read(self, filename: str) -> List[dict]:
        filepath = self.path / filename
        if not filepath.exists():
            logger.warning(f"Missing: {filename}")
            return []

        try:
            with open(filepath) as f:
                data = json.load(f)
            return data if isinstance(data, list) else []
        except json.JSONDecodeError as e:
            logger.error(f"Bad JSON in {filename}: {e}")
            return []


loader = DataLoader(settings.data_dir)
cache = Cache(settings.cache_ttl)


def create_app():
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/", response_model=HealthResponse)
    async def health():
        return HealthResponse()

    @app.get("/apis/meals", response_model=List[Meal])
    async def meals():
        return await _load_data("meals.json", "meals", Meal)

    @app.get("/apis/feedbacks", response_model=List[Feedback])
    async def feedbacks():
        return await _load_data("feedbacks.json", "feedbacks", Feedback)

    async def _load_data(filename: str, key: str, model: Type[T]) -> List[T]:
        cached = cache.get(key)
        if cached:
            return cached

        raw = await loader.load(filename)
        result = []

        for item in raw:
            try:
                result.append(model.model_validate(item))
            except ValidationError as e:
                logger.warning(f"Invalid item in {filename}: {e}")

        cache.set(key, result)
        return result

    return app


app = create_app()

if __name__ == "__main__":
    logger.info(f"Starting on {settings.server_host}:{settings.server_port}")
    uvicorn.run(app, host=settings.server_host, port=settings.server_port)
