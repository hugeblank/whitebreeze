import { hero } from "~/api/hero";
import { router } from "~/api/trpc";

export const appRouter = router({
  hero,
});

export type AppRouter = typeof appRouter;
