import type { MiddlewareHandler } from "hono";

export const auth: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("Authorization");
  if (token === `Bearer ${Bun.env.API_TOKEN}`) await next();
  else {
    return c.json({ error: "Unauthorized" }, 401);
  }
};
