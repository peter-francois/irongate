import { z } from "zod";

export const MetricSchema = z.object({
  machineId: z.string(),
  kind: z.enum(["temperature", "pressure", "speed", "presence", "power"]),
  value: z.union([z.number(), z.boolean(), z.string()]),
  timestamp: z.string().datetime(),
});

export type Metric = z.infer<typeof MetricSchema>;