import { Hono } from "hono";
import metrics from "./routes/metrics";
import { logger } from "./middlewares/logger";

const app = new Hono();
app.use(logger);
app.route("/metrics", metrics);

export default app;
