import {
  isAtprotoDid,
  isHandle,
  type Did,
  type DidDocument,
} from "@atcute/identity";
import {
  CompositeDidDocumentResolver,
  CompositeHandleResolver,
  HandleResolutionError,
  PlcDidDocumentResolver,
  WebDidDocumentResolver,
  WellKnownHandleResolver,
} from "@atcute/identity-resolver";
import { NodeDnsHandleResolver } from "@atcute/identity-resolver-node";
import { env } from "./env";
import { BlueskyProfile } from "./types";

// handle resolution
const handleResolver = new CompositeHandleResolver({
  strategy: "race",
  methods: {
    dns: new NodeDnsHandleResolver(),
    http: new WellKnownHandleResolver(),
  },
});

// DID document resolution
const docResolver = new CompositeDidDocumentResolver({
  methods: {
    plc: new PlcDidDocumentResolver(),
    web: new WebDidDocumentResolver(),
  },
});

async function resolveDidDocument(user: string): Promise<DidDocument> {
  if (isAtprotoDid(user)) {
    return await docResolver.resolve(user);
  } else if (isHandle(user)) {
    const did = await handleResolver.resolve(user);
    return await docResolver.resolve(did);
  } else {
    throw new HandleResolutionError(
      `${user} is not valid ATProto DID or Handle.`,
    );
  }
}

function resolvePds(doc: DidDocument) {
  if (!doc.service) return;
  for (const service of doc.service) {
    if (
      service.id === "#atproto_pds" &&
      service.type === "AtprotoPersonalDataServer"
    ) {
      if (typeof service.serviceEndpoint === "string") {
        return service.serviceEndpoint;
      }
      // TODO complete coverage of serviceEndpoint types
    }
  }
}

export async function resolveProfile(did: Did) {
  try {
    const data = await (
      await fetch(
        `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${did}`,
      )
    ).json();
    console.log(data);
    return await BlueskyProfile.parseAsync(data);
  } catch (e) {
    console.error(e);
    // This user could just not have a bluesky profile.
    // Let's be tolerant of that decision.
    return;
  }
}

export const diddoc = await resolveDidDocument(env.HANDLE);

export const pds = resolvePds(diddoc);
