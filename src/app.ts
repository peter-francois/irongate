import { Hono } from "hono";
import metrics from "./routes/metrics";
import { logger } from "./middlewares/logger";
import { auth } from "./middlewares/auth";

const app = new Hono();
app.use(logger);
app.use(auth)
app.route("/metrics", metrics);

export default app;
