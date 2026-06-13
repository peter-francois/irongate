import type { MiddlewareHandler } from "hono";

export const logger: MiddlewareHandler = async (c, next) => {
  const start = performance.now();
  await next();
  const ms = performance.now() - start;
  console.log(
    `${c.req.method} ${c.req.path} - ${c.res.status} (${ms.toFixed(2)}ms)`,
  );
};
