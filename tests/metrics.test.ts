import { describe, it, expect } from "bun:test";
import app from "../src/app";

const TOKEN = Bun.env.API_TOKEN ?? "test-token";

const validMetric = {
  machineId: "machine-1",
  kind: "temperature",
  value: 72.4,
  timestamp: new Date().toISOString(),
};

describe("POST /metrics", () => {
  it("should create a metric and return 201", async () => {
    const res = await app.request("/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(validMetric),
    });

    expect(res.status).toBe(201);
  });

  it("should return 401 if token is wrong", async () => {
    const res = await app.request("/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer bad-token",
      },
      body: JSON.stringify(validMetric),
    });

    expect(res.status).toBe(401);
  });
});

describe("GET /metrics", () => {
  it("should return all metrics", async () => {
    const res = await app.request("/metrics", {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });
});

describe("GET /metrics/:machineId", () => {
  it("should return metrics for a known machine", async () => {
    const res = await app.request("/metrics/machine-1", {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    expect(res.status).toBe(200);
  });

  it("should return 404 for unknown machine", async () => {
    const res = await app.request("/metrics/unknown-machine", {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    expect(res.status).toBe(404);
  });
});