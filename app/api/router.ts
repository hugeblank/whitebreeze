import { z } from "zod";
import { publicProcedure, router } from "~/api/trpc";
import { diddoc, resolveProfile } from "~/lib/resolver.server";
import { BlueskyProfile } from "~/lib/types";
import { listEntries } from "~/lib/whitewind.server";
import { AtUri } from "@atproto/syntax";

export const appRouter = router({
  getProfile: publicProcedure
    .output(BlueskyProfile.nullable())
    .query(async () => (await resolveProfile(diddoc.id)) ?? null),
  listPosts: publicProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
      }),
    )
    .output(
      z.object({
        cursor: z.string().optional(),
        records: z.array(
          z.object({
            rkey: z.string(),
            title: z.string(),
            createdAt: z.date({ coerce: false }),
          }),
        ),
      }),
    )
    .query(async ({ input }) => {
      const entries = await listEntries(input.cursor);
      return {
        cursor: entries.cursor,
        records: entries.records
          .filter((entry) => entry.value.visibility === "public")
          .map((entry) => {
            const uri = new AtUri(entry.uri);
            return {
              title: entry.value.title,
              createdAt: new Date(entry.value.createdAt),
              rkey: uri.rkey,
            };
          }),
      };
    }),
});

export type AppRouter = typeof appRouter;
