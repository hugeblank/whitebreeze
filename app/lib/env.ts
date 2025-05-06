import { z } from "zod";
export const env = z
  .object({
    HANDLE: z.string(),
    TITLE: z.string().min(1).optional().default("Home"),
  })
  .parse(process.env);
