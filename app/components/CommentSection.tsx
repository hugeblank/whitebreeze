// Inspired by Emily's Comment Section component.
// Modifications:
// - use lucide icons
// - show even when there are 0 replies
// - remove extraneous types
// - use internal throbber component
// - directly pass post url
// https://emilyliu.me/blog/comments

import { Link } from "react-router";
import {
  AppBskyFeedDefs,
  AppBskyFeedPost,
  type $Typed,
  type AppBskyFeedGetPostThread,
} from "@atproto/api";
import { useEffect, useState } from "react";
import { Heart, MessageSquare, Repeat } from "lucide-react";
import Throbber from "./Throbber";

type Thread = $Typed<AppBskyFeedDefs.ThreadViewPost>;

// Function to fetch the thread data
const fetchThreadData = async (
  uri: string,
  setThread: React.Dispatch<React.SetStateAction<Thread | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    const thread = await getPostThread(uri);
    setThread(thread);
  } catch {
    setError("Error loading comments");
  }
};

export const CommentSection = ({
  did,
  rkey,
  className,
}: {
  did: string;
  rkey: string;
  className?: string;
}) => {
  const uri = `at://${did}/app.bsky.feed.post/${rkey}`;
  const postUrl = `https://bsky.app/profile/${did}/post/${rkey}`;

  const [thread, setThread] = useState<Thread | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    fetchThreadData(uri, setThread, setError);
  }, [uri]);

  if (error) {
    return <p className="text-center">{error}</p>;
  }

  if (!thread) {
    return <Throbber large />;
  }

  if (!thread.replies) {
    return <div />;
  }

  const showMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const sortedReplies = thread.replies
    .filter((reply) => AppBskyFeedDefs.isThreadViewPost(reply))
    .map((reply) => reply)
    .sort(sortByLikes);

  return (
    <div className={className}>
      <hr className="my-4" />
      <p>
        <Link
          to={postUrl}
          target="_blank"
          className="flex w-fit items-center gap-2 text-lg hover:underline"
        >
          <span className="flex items-center">
            <MessageSquare color="#7FBADC" />
            <span className="ml-1">{thread.post.replyCount ?? 0} replies</span>
          </span>
          <span className="flex items-center">
            <Repeat color="green" />
            <span className="ml-1">{thread.post.repostCount ?? 0} reposts</span>
          </span>
          <span className="flex items-center">
            <Heart color="pink" />
            <span className="ml-1">{thread.post.likeCount ?? 0} likes</span>
          </span>
        </Link>
      </p>
      <h2 className="mt-6 text-xl font-bold">Comments</h2>
      <p className="mt-2 text-sm">
        Reply on Bluesky{" "}
        <Link
          to={postUrl}
          className="underline"
          target="_blank"
          rel="noreferrer noopener"
        >
          here
        </Link>{" "}
        to join the conversation.
      </p>
      <div className="mt-2 space-y-8">
        {sortedReplies
          .slice(0, visibleCount)
          .filter(
            (value) =>
              AppBskyFeedDefs.isThreadViewPost(value) &&
              AppBskyFeedPost.isRecord(value.post.record),
          )
          .map((reply) => (
            <Comment key={reply.post.uri} comment={reply} />
          ))}
        {visibleCount < sortedReplies.length && (
          <button
            onClick={showMore}
            className="mt-2 text-sm text-blue-500 underline"
          >
            Show more comments
          </button>
        )}
      </div>
      <hr className="my-4" />
    </div>
  );
};

const Comment = ({ comment }: { comment: Thread }) => {
  const author = comment.post.author;
  const avatarClassName = "h-4 w-4 shrink-0 rounded-full bg-gray-300";

  if (!AppBskyFeedPost.isRecord(comment.post.record)) return null;

  return (
    <div className="my-4 text-sm">
      <div className="flex max-w-xl flex-col gap-2">
        <Link
          className="flex flex-row items-center gap-2 hover:underline"
          to={`https://bsky.app/profile/${author.did}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {author.avatar ? (
            <img
              src={comment.post.author.avatar}
              alt="avatar"
              className={avatarClassName}
            />
          ) : (
            <div className={avatarClassName} />
          )}
          <p className="line-clamp-1">
            {author.displayName ?? author.handle}{" "}
            <span className="text-gray-500">@{author.handle}</span>
          </p>
        </Link>
        <Link
          to={`https://bsky.app/profile/${author.did}/post/${comment.post.uri.split("/").pop()}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <p>{comment.post.record.text as string}</p>
          <Actions post={comment.post} />
        </Link>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-neutral-600 pl-2">
          {comment.replies
            .filter((value) => AppBskyFeedDefs.isThreadViewPost(value))
            .sort(sortByLikes<Thread>)
            .map((reply) => (
              <Comment key={reply.post.uri} comment={reply} />
            ))}
        </div>
      )}
    </div>
  );
};
const Actions = ({ post }: { post: AppBskyFeedDefs.PostView }) => (
  <div className="mt-2 flex w-full max-w-[150px] flex-row items-center justify-between opacity-60">
    <div className="flex flex-row items-center gap-1.5">
      <MessageSquare color="currentColor" width={16} />

      <p className="text-xs">{post.replyCount ?? 0}</p>
    </div>
    <div className="flex flex-row items-center gap-1.5">
      <Repeat color="currentColor" width={16} />
      <p className="text-xs">{post.repostCount ?? 0}</p>
    </div>
    <div className="flex flex-row items-center gap-1.5">
      <Heart color="currentColor" width={16} />
      <p className="text-xs">{post.likeCount ?? 0}</p>
    </div>
  </div>
);

const getPostThread = async (uri: string) => {
  const params = new URLSearchParams({ uri });

  const res = await fetch(
    "https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?" +
      params.toString(),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to fetch post thread");
  }

  const data = (await res.json()) as AppBskyFeedGetPostThread.OutputSchema;

  if (!AppBskyFeedDefs.isThreadViewPost(data.thread)) {
    throw new Error("Could not find thread");
  }

  return data.thread;
};

function sortByLikes<T extends Thread>(a: T, b: T) {
  if (
    !AppBskyFeedDefs.isThreadViewPost<T>(a) ||
    !AppBskyFeedDefs.isThreadViewPost<T>(b)
  ) {
    return 0;
  }
  return (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0);
}
