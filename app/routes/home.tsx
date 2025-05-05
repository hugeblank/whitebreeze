import { prefetch } from "~/lib/prefetch";
import type { Route } from "./+types/home";
import { useTRPC } from "~/lib/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";
import Throbber from "~/components/Throbber";
import { Card } from "~/components/ui/card";
import { Link } from "react-router";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "WhiteBreeze" },
    { name: "description", content: "Self-Hosted WhiteWind Blogspot" },
  ];
}

export const unstable_middleware: Route.unstable_MiddlewareFunction[] = [
  async ({ context }) => {
    const {
      queryClient,
      trpc: { listPosts },
    } = prefetch(context);
    await queryClient.prefetchInfiniteQuery(listPosts.infiniteQueryOptions({}));
  },
];

export default function Home() {
  const trpc = useTRPC();
  const listPosts = useInfiniteQuery(
    trpc.listPosts.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.cursor,
      },
    ),
  );

  if (listPosts.isLoading) {
    return <Throbber large />;
  } else if (listPosts.isSuccess) {
    return (
      <div className="auto-cols grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4">
        {listPosts.data.pages.flatMap((page) =>
          page.records.map((record) => {
            return (
              <Card key={record.rkey} className="justify-between px-6">
                <Link
                  className="text-lg font-semibold text-blue-500 hover:text-blue-300"
                  to={`/${record.rkey}`}
                >
                  {record.title}
                </Link>
                <p>{new Date(record.createdAt).toLocaleString()}</p>
              </Card>
            );
          }),
        )}
      </div>
    );
  } else {
    return (
      <>
        <h2 className="text-xl font-bold">Uhh...</h2>
        <p>{listPosts.isError && listPosts.error.message}</p>
      </>
    );
  }
}
