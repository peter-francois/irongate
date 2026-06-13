import { Hono } from "hono";
import metrics from "./routes/metrics";
import { logger } from "./middlewares/logger";
import { auth } from "./middlewares/auth";
import stream from "./routes/stream";

const app = new Hono();
app.use(logger);
app.use(auth);
app.route("/metrics", metrics);
app.route("/stream", stream);

export default app;
