import { check, sleep } from "k6";
import http from "k6/http";


export const options = {
  // Staged load: progressively ramp up VUs, hold at peak, then ramp down
  stages: [
    { duration: "30s", target: 10 },  // warm up
    { duration: "1m", target: 50 },   // ramp up
    { duration: "2m", target: 100 },  // peak load
    { duration: "30s", target: 0 },   // ramp down
  ],
  // Thresholds define pass/fail criteria for the test
  // If any threshold is crossed, K6 exits with a non-zero code (useful in CI)
  thresholds: {
    // Global response time thresholds
    http_req_duration: ["p(95)<50", "p(99)<100", "avg<20"],
    // Threshold scoped to a specific tagged request (POST /metrics only)
    "http_req_duration{name:ingestMetric}": ["p(95)<50"],
    // Built-in K6 failure rate (non-2xx responses) must stay below 5%
    http_req_failed: ["rate<0.05"],
    // Minimum throughput — the API must handle at least 10 req/s
    http_reqs: ["rate>10"],
  },
};

const BASE_URL = "http://irongate:3000";

const TOKEN = __ENV.API_TOKEN;


const MACHINES = ["machine-1", "machine-2", "machine-3", "machine-4", "machine-5"];
const KINDS = ["temperature", "pressure", "speed", "presence", "power"];

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

export default function () {
  const machineId = MACHINES[Math.floor(Math.random() * MACHINES.length)];
  const kind = KINDS[Math.floor(Math.random() * KINDS.length)];

  // --- POST /metrics ---
  const payload = JSON.stringify({
    machineId,
    kind,
    value: Math.random() * 100,
    timestamp: new Date().toISOString(),
  });

  const postRes = http.post(`${BASE_URL}/metrics`, payload, {
    headers,
    // Tag this request so it can be filtered in thresholds and Grafana
    tags: { name: "ingestMetric" },
  });

  // check() returns true only if ALL assertions pass
  // If any assertion fails, postCheck is false
  const postCheck = check(postRes, {
    "status is 201": (r) => r.status === 201,
    "response time < 50ms": (r) => r.timings.duration < 50,
    "body has success": (r) => {
      try {
        return JSON.parse(r.body).success === true;
      } catch {
        return false;
      }
    },
  });

  // --- GET /metrics/:machineId ---
  // Only run the read test if the write succeeded — no point testing reads after a failed write
  if (postCheck) {
    const getRes = http.get(`${BASE_URL}/metrics/${machineId}`, {
      headers,
      tags: { name: "getMetrics" },
    });

    // Read operations should be faster than writes — threshold is 20ms
    check(getRes, {
      "status is 200": (r) => r.status === 200,
      "response time < 20ms": (r) => r.timings.duration < 20,
      "body is array": (r) => {
        try {
          return Array.isArray(JSON.parse(r.body));
        } catch {
          return false;
        }
      },
    });
  }

  // Realistic pause between requests — between 0.5s and 2.5s
  sleep(Math.random() * 2 + 0.5);
}

// teardown() runs once after all VUs have finished
export function teardown() {
  console.log("Load test completed");
}