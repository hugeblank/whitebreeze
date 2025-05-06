import { getEntry } from "~/lib/whitewind.server";
import type { Route } from "./+types/home";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { rehypeFixFootnote, whitewindSchema } from "~/lib/parser";
import { makeMeta } from "~/lib/commonmeta";
import { CommentSection } from "~/components/CommentSection";
import { env } from "~/lib/env.server";
import { cn } from "~/lib/utils";
import { diddoc } from "~/lib/resolver.server";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png" },
];

export function meta({ data: { title, handle, url } }: Route.MetaArgs) {
  return makeMeta(url, title || "Untitled Blog Post", handle);
}

const linkRegex =
  /^<link +rel="post" +href="(?:at:\/\/did:.+\/app\.bsky\.feed\.post\/|https?:\/\/bsky\.app\/profile\/.+\/post\/)(.*)\??.*"\/>/;

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    const {
      value: { title, content },
    } = await getEntry(params.rkey);
    const rkey = content.match(linkRegex);
    return {
      handle: env.HANDLE,
      title,
      content,
      did: diddoc.id,
      rkey: rkey && rkey[1],
      url: request.url,
    };
  } catch (e) {
    console.error(e);
    throw new Response(null, {
      status: 404,
      statusText: `No such entry with rkey ${params.rkey}`,
    });
  }
}

const components: Components = {
  img: (props) => {
    const { className, ...rest } = props;
    return <img {...rest} className={cn(className, "border-2")} />;
  },
};

export default function Home({
  loaderData: { title, content, did, rkey },
}: Route.ComponentProps) {
  return (
    <>
      <article className="prose prose-img:rounded-md prose-code:rounded-md dark:prose-invert sm:prose-sm md:prose-md lg:prose-lg xl:prose-xl 2xl:prose-2xl 4xl:prose-4xl mx-auto **:target:rounded-md **:target:border-2 **:target:border-blue-300">
        <Markdown
          components={components}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            [rehypeSanitize, whitewindSchema],
            rehypeFixFootnote,
          ]}
        >
          {`${title ? `# ${title}\n\n---\n` : ""}${content}`}
        </Markdown>
      </article>
      {rkey && <CommentSection className="mx-auto" did={did} rkey={rkey} />}
    </>
  );
}
