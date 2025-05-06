import { getEntry } from "~/lib/whitewind.server";
import type { Route } from "./+types/home";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { rehypeFixFootnote, whitewindSchema } from "~/lib/parser";
import { makeMeta } from "~/lib/commonmeta";
import { CommentSection } from "~/components/CommentSection";
import { env } from "~/lib/env.server";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png" },
];

export function meta({ data: { title, handle }, location }: Route.MetaArgs) {
  return makeMeta(location, title || "Untitled Blog Post", handle);
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const {
      value: { title, content },
    } = await getEntry(params.rkey);
    const link = content.match(/^<link rel="post" href="(.*)"\/>/);
    return {
      handle: env.HANDLE,
      title,
      content,
      uri: link && link[1],
    };
  } catch (e) {
    console.error(e);
    throw new Response(null, {
      status: 404,
      statusText: `No such entry with rkey ${params.rkey}`,
    });
  }
}

export default function Home({
  loaderData: { title, content, uri },
}: Route.ComponentProps) {
  console.log(uri);
  return (
    <>
      <article className="prose prose-img:rounded-md prose-code:rounded-md dark:prose-invert sm:prose-sm md:prose-md lg:prose-lg xl:prose-xl 2xl:prose-2xl 4xl:prose-4xl mx-auto **:target:rounded-md **:target:border-2 **:target:border-blue-300">
        <Markdown
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
      {uri && <CommentSection className="mx-auto" uri={uri} />}
    </>
  );
}
