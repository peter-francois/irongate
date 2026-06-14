import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  vus: 10,
  duration: "30s",
};

const TOKEN = __ENV.API_TOKEN;

const MACHINES = ["machine-1", "machine-2", "machine-3", "machine-4", "machine-5"];
const KINDS = ["temperature", "pressure", "speed", "presence", "power"];

export default function () {
  const machineId = MACHINES[Math.floor(Math.random() * MACHINES.length)];
  const kind = KINDS[Math.floor(Math.random() * KINDS.length)];

  const payload = JSON.stringify({
    machineId,
    kind,
    value: Math.random() * 100,
    timestamp: new Date().toISOString(),
  });

  const res = http.post("http://irongate:3000/metrics", payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  check(res, {
    "status is 201": (r) => r.status === 201,
  });

  sleep(0.5);
}
