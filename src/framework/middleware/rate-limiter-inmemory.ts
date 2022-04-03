import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextFunction, Request, Response } from "express"

export default class RateLimiterMiddleware {

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const rateLimiter = new RateLimiterMemory({
      keyPrefix: "middleware",
      points: 1, // 10 requests
      duration: 60, // per 1 second by IP
    });

    try {
      await rateLimiter.consume(req.ip);
      next();
    } catch {
      res.status(429).send("Too Many Requests");
    }
  };
}