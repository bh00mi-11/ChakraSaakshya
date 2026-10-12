from pydantic import BaseModel, Field
from datetime import datetime, timezone


class HealthResponse(BaseModel):
    """
    Standard generic health response schema.
    Reports backend service status only. FalkorDB graph checks are reserved for kickoff.
    """
    status: str = Field(default="healthy", description="Application status")
    app_name: str = Field(description="Name of the service")
    environment: str = Field(description="Runtime environment")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="UTC timestamp of the health check"
    )
