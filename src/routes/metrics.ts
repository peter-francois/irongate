import { Hono } from "hono";
import { addMetric, getAllMetrics, getMetricsByMachine } from "../store/metrics";
import type { Metric } from "../types/metric";

const metrics = new Hono();

metrics.post("/", async (c) => {
  const body = await c.req.json<Metric>();
  addMetric(body.machineId, body);
  return c.json({ success: true }, 201);
});

metrics.get("/", (c) => {
  const all = getAllMetrics();
  return c.json(all);
});

metrics.get("/:machineId", (c) => {
  const machineId = c.req.param("machineId");
  const result = getMetricsByMachine(machineId);

  if (!result) {
    return c.json({ error: "Machine not found" }, 404);
  }

  return c.json(result);
});

export default metrics;
