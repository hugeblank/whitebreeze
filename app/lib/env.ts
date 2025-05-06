import { z } from "zod";
export const env = z
  .object({
    HANDLE: z.string(),
    TITLE: z.preprocess(
      (arg) => (typeof arg === "string" && arg.length === 0 ? undefined : arg),
      z.string().default("Home"),
    ),
  })
  .parse(process.env);
