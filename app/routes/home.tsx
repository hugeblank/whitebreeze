import { useTRPC } from "~/lib/trpc";
import type { Route } from "./+types/home";
import { useQuery } from "@tanstack/react-query";
import { prefetch } from "~/lib/prefetch";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Jebsite" },
    { name: "description", content: "Welcome to my Jebsite!" },
  ];
}

export const unstable_middleware: Route.unstable_MiddlewareFunction[] = [
  async ({ context }) => {
    const { queryClient, trpc } = prefetch(context);

    // Block the page to prefetch
    await queryClient.prefetchQuery(trpc.hero.message.queryOptions());

    // Or, if you don't want to block the page:
    // void queryClient.prefetchQuery(trpc.hero.message.queryOptions());

    // If you need to prevent internal navigations from causing prefetching, use skipIfSameOrigin
    // await skipIfSameOrigin(request, async () => {
    //   await queryClient.prefetchQuery(trpc.hero.message.queryOptions());
    // });
  },
];

export default function Home() {
  const trpc = useTRPC();
  const message = useQuery(trpc.hero.message.queryOptions());

  return (
    <main className="container mx-auto flex flex-col items-center p-4 pt-16">
      <h1 className="text-4xl">Jebsite</h1>
      <p className="animate-shimmer bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 bg-[size:200%_100%] bg-clip-text text-sm text-transparent">
        {message.data}
      </p>
    </main>
  );
}
