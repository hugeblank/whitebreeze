import { z, type ZodType } from "zod";

const Entry = z.object({
  // ignore blobs & $type as they're extraneous
  theme: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  createdAt: z.string().datetime().optional(),
  visibility: z.enum(["public", "author", "url"]),
});
function getRecord<T extends ZodType>(type: T) {
  return z.object({
    uri: z.string(),
    cid: z.string(),
    value: type,
  });
}
function listRecords<T extends ZodType>(type: T) {
  return z.object({
    cursor: z.string(),
    records: z.array(getRecord(type)),
  });
}
export const ATPListWhitewindEntries = listRecords(Entry);
export const ATPGetWhitewindEntries = getRecord(Entry);

export const BlueskyProfile = z.object({
  associated: z.object({
    lists: z.number(),
    feedgens: z.number(),
    starterPacks: z.number(),
    labeler: z.boolean(),
  }),
  avatar: z.string().url().optional(),
  banner: z.string().url().optional(),
  createdAt: z.string().datetime(),
  description: z.string().optional(),
  did: z.string().regex(/did:(plc|web):.+/),
  displayName: z.string().optional(),
  followersCount: z.number(),
  followsCount: z.number(),
  handle: z.string().optional(),
  indexedAt: z.string().datetime(),
  // labels: z.array(unknown),
  postsCount: z.number(),
});
