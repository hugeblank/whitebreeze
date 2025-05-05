import { initTRPC } from "@trpc/server";
import type { Context } from "~/api/context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
