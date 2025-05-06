import { getEntry } from "~/lib/whitewind.server";
import type { Route } from "./+types/home";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { rehypeFixFootnote, whitewindSchema } from "~/lib/parser";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const {
      value: { title, content },
    } = await getEntry(params.rkey);
    return `${title ? `# ${title}\n\n---\n` : ""}${content}`;
  } catch (e) {
    console.error(e);
    throw new Response(null, {
      status: 404,
      statusText: `No such entry with rkey ${params.rkey}`,
    });
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <article className="prose prose-img:rounded-md prose-code:rounded-md dark:prose-invert sm:prose-sm md:prose-md lg:prose-lg xl:prose-xl 2xl:prose-2xl 4xl:prose-4xl mx-auto **:target:rounded-md **:target:border-2 **:target:border-blue-300">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, whitewindSchema],
          rehypeFixFootnote,
        ]}
      >
        {loaderData}
      </Markdown>
    </article>
  );
}
