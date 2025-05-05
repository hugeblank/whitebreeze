import { diddoc, pds } from "./resolver.server";
import { ATPListWhitewindEntries, ATPGetWhitewindEntries } from "./types";

export async function listEntries(cursor?: string) {
  return await ATPListWhitewindEntries.parseAsync(
    await (
      await fetch(
        `${pds}/xrpc/com.atproto.repo.listRecords?repo=${diddoc.id}&collection=com.whtwnd.blog.entry${cursor ? `&cursor=${cursor}` : ""}`,
      )
    ).json(),
  );
}

export async function getEntry(rkey: string) {
  return await ATPGetWhitewindEntries.parseAsync(
    await (
      await fetch(
        `${pds}/xrpc/com.atproto.repo.getRecord?repo=${diddoc.id}&collection=com.whtwnd.blog.entry&rkey=${rkey}`,
      )
    ).json(),
  );
}
