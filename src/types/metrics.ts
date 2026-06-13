type MetricValue = boolean | number | string;
type MetricKind = "temperature" | "pressure" | "speed" | "presence" | "power";

export interface Metric {
  machineId: string;
  timestamp: Date;
  metricsType: MetricKind;
  value: MetricValue;
}
