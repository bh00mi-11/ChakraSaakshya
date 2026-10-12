from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """
    Verifies that the generic health endpoint returns HTTP 200 and healthy status.
    Uses standard synchronous TestClient (backed by httpx) for zero plugin dependency.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "app_name" in data
    assert data["environment"] == "development"
