import { z } from "zod";
export const env = z
  .object({
    HANDLE: z.string(),
    TITLE: z.string().default("Home"),
  })
  .parse(process.env);
