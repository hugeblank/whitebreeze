import { z } from "zod";
export const env = z
  .object({
    HANDLE: z.string(),
    TITLE: z.string().min(1).default("Home"),
  })
  .parse(process.env);
