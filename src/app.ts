import { Hono } from "hono";
import metrics from "./routes/metrics";
import { logger } from "./middlewares/logger";
import { auth } from "./middlewares/auth";

const app = new Hono();
app.use(auth)
app.use(logger);
app.route("/metrics", metrics);

export default app;
