import { publicProcedure, router } from "~/api/trpc";

export const hero = router({
  message: publicProcedure.query(() => "Get started building your Jebsite!"),
});
