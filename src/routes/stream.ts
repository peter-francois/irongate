import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { subscribe } from "../store/metrics";
import type { Metric } from "../types/metric";

const stream = new Hono();

stream.get("/", (c) => {
  return streamSSE(c, async (sseStream) => {
    const unsubscribe = subscribe((metric: Metric) => {
      sseStream.writeSSE({
        data: JSON.stringify(metric),
        event: "metric-added",
      });
    });

    sseStream.onAbort(() => {
      unsubscribe();
    });

    await new Promise(() => {});
  });
});

export default stream;
