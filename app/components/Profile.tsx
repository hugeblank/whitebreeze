import type { z } from "zod";
import { type BlueskyProfile } from "~/lib/types";

export default function Profile({
  avatar,
  banner,
  did,
  displayName,
  description,
  handle,
}: z.infer<typeof BlueskyProfile>) {
  return (
    <div
      style={{ "--image-url": `url(${banner})` } as React.CSSProperties}
      className="relative rounded-md border border-gray-500 bg-(image:--image-url) bg-cover bg-local bg-center p-4"
    >
      <div className="m-2 flex flex-col rounded-md bg-black p-3 opacity-80 sm:flex-row">
        <div className="flex flex-none flex-row items-center">
          {avatar && (
            <img
              src={avatar}
              alt="Bluesky avatar"
              className="m-2 size-16 rounded-full"
            />
          )}
          <div className="m-2">
            {displayName && <h4>{displayName}</h4>}
            <h6 className="font-medium hover:text-blue-500 hover:underline">
              <a href={`https://bsky.app/profile/${handle}`}>
                {handle ? `@${handle}` : did}
              </a>
            </h6>
          </div>
        </div>
        {description && (
          <div className="p-3">
            <p className="wrap-normal">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
