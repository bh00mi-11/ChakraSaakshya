from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Generic application settings loaded from environment variables or .env file.
    Does not contain hackathon-specific logic or hardcoded secrets.
    """
    app_name: str = "ChakraSaakshya Foundation API"
    app_env: str = "development"
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    app_debug: bool = True
    allowed_cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Future graph database connection parameters (reserved for event kickoff)
    falkordb_host: str = "127.0.0.1"
    falkordb_port: int = 6379
    falkordb_graph_name: str = "chakra_saakshya_custody"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_cors_origins.split(",") if origin.strip()]


settings = Settings()
