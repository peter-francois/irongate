import app from "./app";

Bun.serve({
  fetch: app.fetch,
  idleTimeout: 0,
});
