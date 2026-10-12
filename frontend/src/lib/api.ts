/**
 * Reusable generic API client for communicating with the backend.
 * Uses environment-configured NEXT_PUBLIC_API_URL or defaults to localhost:8000.
 */

export interface HealthStatus {
  status: string;
  app_name: string;
  environment: string;
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorPayload?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function checkBackendHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      let errorBody: unknown;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = null;
      }
      throw new ApiError(
        `Backend responded with HTTP status ${res.status}`,
        res.status,
        errorBody
      );
    }

    const data: HealthStatus = await res.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      `Failed to connect to backend at ${BASE_URL}: ${(err as Error).message}`
    );
  }
}
