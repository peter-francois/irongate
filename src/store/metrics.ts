import type { Metric } from "../types/metric";

const store = new Map<string, Metric[]>();

export function addMetric(machineId: string, metric: Metric): void {
  const existing = store.get(machineId);

  if (existing) {
    existing.push(metric);
  } else {
    store.set(machineId, [metric]);
  }
  notify(metric);
}

export function getMetricsByMachine(machineId: string): Metric[] | undefined {
  const existing = store.get(machineId);
  if (existing) return existing;

  return;
}

export function getAllMetrics(): Metric[] {
  return Array.from(store.values()).flat();
}

type Subscriber = (metric: Metric) => void;

const subscribers = new Set<Subscriber>();

export function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function notify(metric: Metric): void {
  for (const fn of subscribers) {
    fn(metric);
  }
}
