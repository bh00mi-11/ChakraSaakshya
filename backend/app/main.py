from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.schemas import HealthResponse
from app.errors import register_error_handlers

logging.basicConfig(
    level=logging.INFO if not settings.app_debug else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("chakra_saakshya_backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle management.
    FalkorDB graph connections and teardown will be hooked here at kickoff.
    """
    logger.info(f"Starting {settings.app_name} in [{settings.app_env}] mode")
    yield
    logger.info(f"Shutting down {settings.app_name}")


def create_app() -> FastAPI:
    """
    Application factory pattern.
    Sets up FastAPI with CORS middleware, centralized errors, and basic endpoints.
    """
    app = FastAPI(
        title=settings.app_name,
        description="Generic application foundation for ChakraSaakshya compliance agent.",
        version="0.1.0-foundation",
        lifespan=lifespan,
    )

    # Configure CORS for local development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register centralized error handling
    register_error_handlers(app)

    @app.get("/api/health", response_model=HealthResponse, tags=["System"])
    async def get_health():
        """
        Generic health check endpoint.
        Returns the application status, environment, and timestamp.
        Does NOT connect to FalkorDB (graph checks reserved for hackathon kickoff).
        """
        return HealthResponse(
            status="healthy",
            app_name=settings.app_name,
            environment=settings.app_env,
        )

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.app_debug,
    )
