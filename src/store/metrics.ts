import type { Metric } from "../types/metric";

const store = new Map<string, Metric[]>();

function addMetric(machineId: string, metric: Metric): void {
  const existing = store.get(machineId);

  if (existing) {
    existing.push(metric);
  } else {
    store.set(machineId, [metric]);
  }
}

function getMetricsByMachine(machineId: string): Metric[] | undefined {
  const existing = store.get(machineId);
  if (existing) return existing;

  return;
}
