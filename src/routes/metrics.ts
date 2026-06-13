import { Hono } from "hono";
import {
  addMetric,
  getAllMetrics,
  getMetricsByMachine,
} from "../store/metrics";
import { MetricSchema } from "../types/metric";
import { zValidator } from "@hono/zod-validator";

const metrics = new Hono();

metrics.post("/", zValidator("json", MetricSchema), async (c) => {
  const validated = c.req.valid("json");
  addMetric(validated.machineId, validated);
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
