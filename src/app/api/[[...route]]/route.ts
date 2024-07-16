import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import type { PageConfig } from "next";

// export const config: PageConfig = {
//   runtime: "edge",
// };

type envConfig = {
  UPSTASH_REDIS_REST_TOKEN: string;
  UPSTASH_REDIS_REST_URL: string;
};

const app = new Hono().basePath("/api");

app.use("/*", cors());

app.get("/search", async (c) => {
  const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
    env<envConfig>(c);
  const start = performance.now();
  try {
    // -----------------------------------
    const redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });

    const q = c.req.query("q");
    if (!q) return c.json({ message: "invalid search query" }, { status: 400 });
    const query = q?.toUpperCase();

    const res: string[] = [];

    const rank = await redis.zrank("terms", query);
    // console.log("rank---------------------", rank);

    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 60);
      // console.log("zrange---------------------", temp);

      for (const el of temp) {
        console.log("---", el);
        if (!el.startsWith(query)) break;
        if (el.endsWith("*")) {
          res.push(el.substring(0, el.length - 1));
        }
      }
    }
    // ---------------------------------------------

    const end = performance.now();
    return c.json({ countries: res, duration: end - start });
  } catch (error) {
    console.error(error);
    return c.json(
      { countries: [], message: "something went wrong" },
      { status: 500 }
    );
  }
});

export const GET = handle(app);
export default app as never;
